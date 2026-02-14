"""
Generate vocab.txt from metadata.jsonl
Extracts all unique characters from Arabizi text for tokenizer
"""

import json
import argparse
from pathlib import Path
from collections import Counter

def extract_vocab(metadata_path: str, output_path: str, min_freq: int = 1):
    """
    Extract vocabulary from metadata.jsonl
    
    Args:
        metadata_path: Path to metadata.jsonl
        output_path: Path to output vocab.txt
        min_freq: Minimum character frequency to include
    """
    print(f"Loading metadata from {metadata_path}...")
    
    # Count character frequencies
    char_counter = Counter()
    num_samples = 0
    
    with open(metadata_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                entry = json.loads(line)
                text = entry.get('text', '')
                char_counter.update(text)
                num_samples += 1
    
    print(f"Processed {num_samples} samples")
    print(f"Found {len(char_counter)} unique characters")
    
    # Filter by frequency
    filtered_chars = [char for char, freq in char_counter.items() if freq >= min_freq]
    filtered_chars = sorted(filtered_chars)  # Sort alphabetically
    
    print(f"After filtering (min_freq={min_freq}): {len(filtered_chars)} characters")
    
    # Special tokens
    special_tokens = ['<pad>', '<unk>', '<sos>', '<eos>']
    
    # Write vocab file
    with open(output_path, 'w', encoding='utf-8') as f:
        # Write special tokens first
        for token in special_tokens:
            f.write(token + '\n')
        
        # Write characters
        for char in filtered_chars:
            f.write(char + '\n')
    
    total_vocab_size = len(special_tokens) + len(filtered_chars)
    print(f"\nVocabulary saved to {output_path}")
    print(f"Total vocabulary size: {total_vocab_size}")
    print(f"  - Special tokens: {len(special_tokens)}")
    print(f"  - Characters: {len(filtered_chars)}")
    
    # Show most common characters
    print(f"\nTop 20 most common characters:")
    for char, freq in char_counter.most_common(20):
        print(f"  '{char}': {freq}")

def main():
    parser = argparse.ArgumentParser(description='Generate vocab.txt from metadata.jsonl')
    parser.add_argument('--metadata', type=str, required=True,
                       help='Path to metadata.jsonl')
    parser.add_argument('--output', type=str, default='vocab.txt',
                       help='Output path for vocab.txt')
    parser.add_argument('--min-freq', type=int, default=1,
                       help='Minimum character frequency')
    
    args = parser.parse_args()
    
    extract_vocab(args.metadata, args.output, args.min_freq)

if __name__ == '__main__':
    main()
