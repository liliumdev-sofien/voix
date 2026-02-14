import os
import sys
import argparse
import torch
import torchaudio
import librosa
import soundfile as sf
from pathlib import Path
from vocos import Vocos
from importlib.util import find_spec

# Convert relative path to absolute for robustness
msg_ref_audio = "../tounsi_dataset/audio/172f2c04-9f8e-44ea-a1d2-6d0f8353acb2.wav"
msg_vocab_path = "../tounsi_dataset/vocab.txt"
msg_ckpt_path = "./outputs/tounsi_training/sanity_cpu_last.pt"
msg_output_path = "./output_test.wav"

def _ensure_f5_tts_importable():
    """Make local src/ importable if running from repo root."""
    repo_root = Path(__file__).resolve().parent
    src_dir = repo_root / "src"
    if src_dir.exists() and str(src_dir) not in sys.path:
        sys.path.insert(0, str(src_dir))

def get_device():
    return "cpu"

class SimpleCharTokenizer:
    def __init__(self, vocab_path):
        self.char_to_idx = {}
        tokens = []
        with open(vocab_path, "r", encoding="utf-8") as f:
            for line in f:
                tok = line.rstrip("\n").rstrip("\r")
                if tok == "": continue
                tokens.append(tok)
        
        # Ensure space is at idx 0 (matching training logic)
        if " " in tokens:
            tokens.remove(" ")
        tokens = [" "] + tokens

        seen = set()
        uniq = []
        for t in tokens:
            if t not in seen:
                uniq.append(t)
                seen.add(t)

        self.char_to_idx = {ch: i for i, ch in enumerate(uniq)}
        self.idx_to_char = {i: ch for ch, i in self.char_to_idx.items()}
        print(f"Loaded tokenizer with {len(self.char_to_idx)} tokens.")

    def encode(self, text):
        # Handle unknown chars by mapping to 0 (space/padding)
        return [self.char_to_idx.get(c, 0) for c in text]

def load_checkpoint(model, ckpt_path, device):
    print(f"Loading checkpoint from {ckpt_path}...")
    checkpoint = torch.load(ckpt_path, map_location=device)
    # Check if checkpoint is state_dict or full wrapper
    if "model_state_dict" in checkpoint:
        state_dict = checkpoint["model_state_dict"]
    elif "state_dict" in checkpoint:
        state_dict = checkpoint["state_dict"]
    else:
        state_dict = checkpoint # Assume direct state dict
    
    # Handle DDP keys if present
    new_state_dict = {}
    for k, v in state_dict.items():
        k = k.replace("module.", "")
        new_state_dict[k] = v
        
    model.load_state_dict(new_state_dict)
    model.to(device)
    model.eval()
    print("Checkpoint loaded.")
    return model

def main():
    _ensure_f5_tts_importable()
    
    # Import F5-TTS modules
    try:
        from f5_tts.model import CFM, DiT
    except ImportError:
        # Fallback if f5_tts package not installed but src is in path
        try:
            from model import CFM, DiT
        except ImportError:
             raise ImportError("Could not import F5-TTS model. Ensure setup is correct.")

    parser = argparse.ArgumentParser()
    parser.add_argument("--text", type=str, required=True, help="Text to generate")
    parser.add_argument("--output", type=str, default="./output.wav", help="Output WAV path")
    parser.add_argument("--ref_audio", type=str, default=msg_ref_audio, help="Reference audio path (relative to script or absolute)")
    args = parser.parse_args()

    device = get_device()
    print(f"Inference Device: {device}")

    # 1. Setup paths
    base_dir = Path(__file__).parent
    
    # Resolve ref_audio relative to base_dir if default, else use as is (if absolute or CWD-relative)
    # But for simplicity, if it matches default, use base_dir logic.
    if args.ref_audio == msg_ref_audio:
        ref_audio_path = base_dir / args.ref_audio
    else:
        ref_audio_path = Path(args.ref_audio)

    vocab_path = base_dir / msg_vocab_path
    ckpt_path = base_dir / msg_ckpt_path
    output_path = Path(args.output)

    if not ref_audio_path.exists():
        raise FileNotFoundError(f"Reference audio not found: {ref_audio_path}")

    # 2. Initialize Tokenizer
    tokenizer = SimpleCharTokenizer(vocab_path)

    # 3. Model Configuration (Must match training!)
    model_dim = 512
    model_depth = 8
    model_heads = 8
    ff_mult = 2
    text_dim = 256  # Matches default in training script
    vocab_size = len(tokenizer.char_to_idx)
    target_sample_rate = 24000
    n_mel_channels = 100
    hop_length = 256

    print("Initializing DiT Backbone...")
    transformer = DiT(
        dim=model_dim,
        depth=model_depth,
        heads=model_heads,
        ff_mult=ff_mult,
        mel_dim=n_mel_channels,
        text_num_embeds=vocab_size,
        text_dim=text_dim,
        conv_layers=2, # Matches training default (not 4, but 2 in User's diff step 704)
        dropout=0.1
    )

    print("Initializing CFM Wrapper...")
    model = CFM(
        transformer=transformer,
        mel_spec_kwargs=dict(
            target_sample_rate=target_sample_rate,
            n_mel_channels=n_mel_channels,
            hop_length=hop_length,
        ),
        vocab_char_map=tokenizer.char_to_idx,
    )

    # 4. Load Weights
    model = load_checkpoint(model, ckpt_path, device)

    # 5. Load Vocoder
    print("Loading Vocos...")
    vocos = Vocos.from_pretrained("charactr/vocos-mel-24khz").to(device)

    # 6. Prepare Input
    target_text = args.text
    print(f"Target Text: {target_text}")
    print(f"Reference Audio: {ref_audio_path}")

    # Load audio using librosa (no torchaudio.info)
    # Load as mono 24khz
    audio, sr = librosa.load(str(ref_audio_path), sr=target_sample_rate, mono=True)
    
    # Calculate duration (sanity check)
    duration = librosa.get_duration(y=audio, sr=sr)
    print(f"Ref Audio Duration: {duration:.2f}s")
    
    # Convert to tensor
    audio_tensor = torch.from_numpy(audio).float().unsqueeze(0).to(device) # (1, T)
    
    # Needs to be (1, 1, T) for audio? Or (1, T)? 
    # CFM forward expects (b, n, d) or (b, nw). 
    # model.sample expects cond as (b, n, d) or (b, nw).
    # If nw (raw wave), it needs to be processed.
    # CFM.sample logic: "if cond.ndim == 2: cond = self.mel_spec(cond)" -> (b, n_mels, t_frames) -> permute(0,2,1) -> (b, t_frames, n_mels)
    # audio_tensor is (1, T). ndim=2. So it works.
    
    # Calculate duration (ref + estimated target)
    ref_frames = audio_tensor.shape[-1] // hop_length
    # Estimate: ~0.15s per character for Tounsi/code-switched speech
    gen_seconds = len(target_text) * 0.15
    gen_frames = int(gen_seconds * target_sample_rate / hop_length)
    total_duration = ref_frames + gen_frames
    
    print(f"Ref Frames: {ref_frames}, Est. Gen Frames: {gen_frames}, Total: {total_duration}")
    
    # 7. Inference
    print("Running Inference...")
    with torch.no_grad():
        # Call sample
        # text can be string list (handled by CFM if vocab_char_map set)
        output_mel, _ = model.sample(
            cond=audio_tensor,
            text=[target_text],
            duration=total_duration, # Explicit duration required
            steps=32, # Euler steps
            cfg_strength=2.0,
            sway_sampling_coef=-1.0, 
        )
        
        # output_mel is (b, n, d) i.e. (1, T_frames, n_mels)
        # Vocos expects (b, n_mels, T_frames)
        output_mel = output_mel.permute(0, 2, 1)
        
        print("Decoding with Vocos...")
        generated_audio = vocos.decode(output_mel)

    # 8. Save Output
    print(f"Saving to {output_path}...")
    sf.write(output_path, generated_audio.squeeze().cpu().numpy(), target_sample_rate)
    print("Done!")

if __name__ == "__main__":
    main()
