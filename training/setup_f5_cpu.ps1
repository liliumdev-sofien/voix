# F5-TTS CPU Setup Script for Windows PowerShell
# Optimized for Intel i5-11500H with 32GB RAM

Write-Host "=== F5-TTS CPU Setup for Tounsi TTS ===" -ForegroundColor Green

# Clone F5-TTS repository
if (-not (Test-Path "F5-TTS")) {
    Write-Host "Cloning F5-TTS repository..." -ForegroundColor Yellow
    git clone https://github.com/SWivid/F5-TTS.git
    Set-Location F5-TTS
} else {
    Write-Host "F5-TTS directory already exists, skipping clone..." -ForegroundColor Yellow
    Set-Location F5-TTS
}

# Create virtual environment
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Install CPU-only PyTorch
Write-Host "Installing PyTorch (CPU-only)..." -ForegroundColor Yellow
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu

# Install F5-TTS dependencies
Write-Host "Installing F5-TTS dependencies..." -ForegroundColor Yellow
pip install transformers accelerate datasets
pip install librosa soundfile
pip install pydub jieba pypinyin cn2an
pip install cached_path einops tqdm

# Install F5-TTS package
Write-Host "Installing F5-TTS..." -ForegroundColor Yellow
pip install -e .

# Verify installation
Write-Host ""
Write-Host "=== Installation Complete ===" -ForegroundColor Green
Write-Host "Verifying PyTorch CPU installation..." -ForegroundColor Yellow
python -c "import torch; print(f'PyTorch version: {torch.__version__}'); print(f'CUDA available: {torch.cuda.is_available()}'); print(f'CPU threads: {torch.get_num_threads()}')"

Write-Host ""
Write-Host "Setup complete! Virtual environment is at: $PWD\venv" -ForegroundColor Green
Write-Host "To activate: .\F5-TTS\venv\Scripts\Activate.ps1" -ForegroundColor Cyan
