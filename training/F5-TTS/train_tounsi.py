import argparse
import sys
from pathlib import Path
from typing import Dict, List

import torch
from torch.utils.data import DataLoader
from torch.optim import AdamW

from accelerate import Accelerator

from tounsi_dataset_loader import load_tounsi_dataset


def _ensure_f5_tts_importable() -> None:
    """
    Make local `src/` importable when running from the repo root on Windows
    without requiring `pip install -e .`.
    """
    repo_root = Path(__file__).resolve().parent
    src_dir = repo_root / "src"
    if src_dir.exists() and str(src_dir) not in sys.path:
        sys.path.insert(0, str(src_dir))


def load_vocab_char_map(vocab_path: str) -> Dict[str, int]:
    """
    Load a character vocab file (one token per line) into {char: idx}.

    F5-TTS char tokenizer expects:
    - index 0 is " " (space)
    - unknown chars fall back to 0
    """
    tokens: List[str] = []
    with open(vocab_path, "r", encoding="utf-8") as f:
        for line in f:
            tok = line.rstrip("\n").rstrip("\r")
            if tok == "":
                continue
            tokens.append(tok)

    # Ensure space is at idx 0
    if " " in tokens:
        tokens.remove(" ")
    tokens = [" "] + tokens

    # De-duplicate while preserving order (just in case)
    seen = set()
    uniq: List[str] = []
    for t in tokens:
        if t not in seen:
            uniq.append(t)
            seen.add(t)

    return {ch: i for i, ch in enumerate(uniq)}


def build_model(args, vocab_char_map: Dict[str, int]):
    _ensure_f5_tts_importable()

    # Repo layout (src/f5_tts/...) vs older HF-space layout (model/...)
    try:
        from f5_tts.model import CFM, DiT  # type: ignore
    except Exception:
        from model import CFM, DiT  # type: ignore

    mel_spec_kwargs = dict(
        target_sample_rate=args.sample_rate,
        n_mel_channels=args.n_mel_channels,
        hop_length=args.hop_length,
    )

    vocab_size = len(vocab_char_map)

    # DiT init supports mel_dim + text_num_embeds :contentReference[oaicite:3]{index=3}
    transformer = DiT(
        dim=args.dim,
        depth=args.depth,
        heads=args.heads,
        ff_mult=args.ff_mult,
        mel_dim=args.n_mel_channels,
        text_num_embeds=vocab_size,
        text_dim=args.text_dim,
        conv_layers=args.conv_layers,
        dropout=args.dropout,
    )

    # CFM wrapper config matches reference training code :contentReference[oaicite:4]{index=4}
    model = CFM(
        transformer=transformer,
        mel_spec_kwargs=mel_spec_kwargs,
        vocab_char_map=vocab_char_map,
    )
    return model


def train(args):
    torch.set_num_threads(args.num_threads)

    accelerator = Accelerator(gradient_accumulation_steps=args.gradient_accumulation_steps)
    device = accelerator.device
    print(f"Training on: {device}")

    dataset = load_tounsi_dataset(
        data_dir=args.data_dir,
        sample_rate=args.sample_rate,
        max_duration=args.max_duration,
        min_duration=args.min_duration,
        debug=args.debug,
    )
    print(f"Loaded {len(dataset)} samples from {args.data_dir}")

    # Windows sanity: keep num_workers=0 to avoid spawn/re-import noise + worker crashes
    dataloader = DataLoader(
        dataset,
        batch_size=args.batch_size,
        shuffle=True,
        num_workers=args.num_workers,
        collate_fn=dataset.collate_fn,
        pin_memory=False,
        drop_last=False,
    )

    vocab_char_map = load_vocab_char_map(args.vocab_path)
    print(f"Vocab size (char map): {len(vocab_char_map)}")

    model = build_model(args, vocab_char_map)
    optimizer = AdamW(model.parameters(), lr=args.learning_rate, weight_decay=args.weight_decay)

    model, optimizer, dataloader = accelerator.prepare(model, optimizer, dataloader)
    model.train()

    global_step = 0
    data_iter = iter(dataloader)

    while global_step < args.max_steps:
        try:
            batch = next(data_iter)
        except StopIteration:
            data_iter = iter(dataloader)
            batch = next(data_iter)

        with accelerator.accumulate(model):
            wave = batch["audio"].to(device)   # (B, T)
            texts = batch["text"]              # list[str]

            # Forward returns (loss, cond, pred) in CFM :contentReference[oaicite:5]{index=5}
            out = model(wave, texts)
            loss = out[0] if isinstance(out, tuple) else out
            loss = loss.mean()

            accelerator.backward(loss)

            if accelerator.sync_gradients:
                torch.nn.utils.clip_grad_norm_(model.parameters(), args.max_grad_norm)

            optimizer.step()
            optimizer.zero_grad(set_to_none=True)

        if accelerator.is_main_process and (global_step % args.logging_steps == 0):
            print(f"step {global_step:04d} | loss {loss.item():.6f}")

        global_step += 1

    accelerator.wait_for_everyone()
    if accelerator.is_main_process:
        out_dir = Path(args.output_dir)
        out_dir.mkdir(parents=True, exist_ok=True)
        ckpt = out_dir / "sanity_cpu_last.pt"
        accelerator.save(accelerator.get_state_dict(model), ckpt)
        print(f"Saved checkpoint: {ckpt}")


def main():
    p = argparse.ArgumentParser()

    p.add_argument("--data_dir", type=str, required=True)
    p.add_argument("--vocab_path", type=str, required=True)

    # Audio / filtering
    p.add_argument("--sample_rate", type=int, default=24000)
    p.add_argument("--min_duration", type=float, default=0.5)
    p.add_argument("--max_duration", type=float, default=30.0)

    # MelSpec params (match common F5 defaults)
    p.add_argument("--n_mel_channels", type=int, default=100)
    p.add_argument("--hop_length", type=int, default=256)

    # Model params (small enough for CPU sanity)
    p.add_argument("--dim", type=int, default=512)
    p.add_argument("--depth", type=int, default=8)
    p.add_argument("--heads", type=int, default=8)
    p.add_argument("--ff_mult", type=int, default=2)
    p.add_argument("--text_dim", type=int, default=256)
    p.add_argument("--conv_layers", type=int, default=2)
    p.add_argument("--dropout", type=float, default=0.1)

    # Train params
    p.add_argument("--batch_size", type=int, default=1)
    p.add_argument("--gradient_accumulation_steps", type=int, default=4)
    p.add_argument("--max_steps", type=int, default=10)
    p.add_argument("--learning_rate", type=float, default=1e-4)
    p.add_argument("--weight_decay", type=float, default=1e-2)
    p.add_argument("--max_grad_norm", type=float, default=1.0)
    p.add_argument("--logging_steps", type=int, default=1)
    p.add_argument("--output_dir", type=str, default="./outputs/tounsi_training")

    # Runtime (Windows-safe)
    p.add_argument("--num_workers", type=int, default=0)
    p.add_argument("--num_threads", type=int, default=6)
    p.add_argument("--debug", action="store_true")

    args = p.parse_args()
    train(args)


if __name__ == "__main__":
    main()
