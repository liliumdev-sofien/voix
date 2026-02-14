import json
import wave
from pathlib import Path
from typing import Dict, List, Any, Optional

import torch
from torch.utils.data import Dataset
from torch.nn.utils.rnn import pad_sequence

import numpy as np
import librosa


class TounsiDataset(Dataset):
    def __init__(
        self,
        data_dir: str,
        sample_rate: int = 24000,
        max_duration: float = 30.0,
        min_duration: float = 0.5,
        debug: bool = False,
    ):
        self.data_dir = Path(data_dir)
        self.sample_rate = sample_rate
        self.max_duration = max_duration
        self.min_duration = min_duration
        self.debug = debug

        self.metadata = self._load_metadata()

    def _load_metadata(self) -> List[Dict[str, Any]]:
        jsonl_path = self.data_dir / "metadata.jsonl"
        if not jsonl_path.exists():
            raise FileNotFoundError(
                f"metadata.jsonl not found at {jsonl_path}. "
                "Run your prepare script first."
            )

        samples: List[Dict[str, Any]] = []
        with open(jsonl_path, "r", encoding="utf-8") as f:
            for line in f:
                if not line.strip():
                    continue
                samples.append(json.loads(line))

        if self.debug:
            print(f"Loaded {len(samples)} samples from {jsonl_path}")

        return samples

    @staticmethod
    def _wav_duration_seconds(path: Path) -> Optional[float]:
        """
        Fast duration for WAV files using stdlib wave (no torchaudio/ffmpeg/torchcodec).
        Returns None if not a readable WAV.
        """
        try:
            with wave.open(str(path), "rb") as wf:
                frames = wf.getnframes()
                sr = wf.getframerate()
            if sr <= 0:
                return None
            return frames / float(sr)
        except Exception:
            return None

    def filter_by_duration(self) -> None:
        filtered: List[Dict[str, Any]] = []
        skipped = 0

        for sample in self.metadata:
            audio_path = Path(sample["audio_path"])
            if not audio_path.is_absolute():
                audio_path = self.data_dir / audio_path

            if not audio_path.exists():
                skipped += 1
                if self.debug:
                    print(f"Missing file: {audio_path}")
                continue

            dur = self._wav_duration_seconds(audio_path)
            if dur is None:
                # Fallback (slower): librosa duration
                try:
                    dur = float(librosa.get_duration(path=str(audio_path)))
                except Exception:
                    skipped += 1
                    if self.debug:
                        print(f"Could not read duration: {audio_path}")
                    continue

            if dur < self.min_duration or dur > self.max_duration:
                skipped += 1
                if self.debug:
                    print(f"Skip duration {dur:.2f}s: {audio_path}")
                continue

            sample = dict(sample)
            sample["audio_path"] = str(audio_path)
            sample["duration"] = dur
            filtered.append(sample)

        print(
            f"Filtered from {len(self.metadata)} to {len(filtered)} samples (skipped {skipped})"
        )
        self.metadata = filtered

    def __len__(self) -> int:
        return len(self.metadata)

    def __getitem__(self, idx: int) -> Dict[str, Any]:
        sample = self.metadata[idx]
        audio_path = Path(sample["audio_path"])

        # librosa avoids torchaudio->torchcodec DLL issues on Windows
        y, _ = librosa.load(str(audio_path), sr=self.sample_rate, mono=True)
        if y.ndim != 1:
            y = np.mean(y, axis=-1)

        waveform = torch.from_numpy(y).float()  # (T,)
        duration = float(len(y)) / float(self.sample_rate)

        return {
            "audio": waveform,
            "text": sample["text"],
            "duration": duration,
            "audio_path": str(audio_path),
        }

    @staticmethod
    def collate_fn(batch: List[Dict[str, Any]]) -> Dict[str, Any]:
        audios = [item["audio"] for item in batch]
        lengths = torch.tensor([a.shape[0] for a in audios], dtype=torch.long)

        padded_audios = pad_sequence(audios, batch_first=True)  # (B, T_max)
        texts = [item["text"] for item in batch]
        durations = torch.tensor([item["duration"] for item in batch], dtype=torch.float32)

        return {
            "audio": padded_audios,
            "audio_lens": lengths,
            "text": texts,
            "duration": durations,
        }


def load_tounsi_dataset(
    data_dir: str,
    sample_rate: int = 24000,
    max_duration: float = 30.0,
    min_duration: float = 0.5,
    debug: bool = False,
) -> TounsiDataset:
    dataset = TounsiDataset(
        data_dir=data_dir,
        sample_rate=sample_rate,
        max_duration=max_duration,
        min_duration=min_duration,
        debug=debug,
    )
    dataset.filter_by_duration()
    return dataset
