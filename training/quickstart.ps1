# Quick Start Script for F5-TTS CPU Sanity Check
# Run this after setting up the environment

Write-Host "=== F5-TTS CPU Sanity Check - Quick Start ===" -ForegroundColor Green
Write-Host ""

# Check if F5-TTS is set up
if (-not (Test-Path "F5-TTS\venv")) {
    Write-Host "ERROR: F5-TTS not set up yet!" -ForegroundColor Red
    Write-Host "Please run: .\setup_f5_cpu.ps1 first" -ForegroundColor Yellow
    exit 1
}

# Activate environment
Write-Host "Activating F5-TTS environment..." -ForegroundColor Yellow
& .\F5-TTS\venv\Scripts\Activate.ps1

# Set CPU thread limits
Write-Host "Setting CPU thread limits (6 threads for i5-11500H)..." -ForegroundColor Yellow
$env:OMP_NUM_THREADS = "6"
$env:MKL_NUM_THREADS = "6"

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Prepare your dataset:" -ForegroundColor White
Write-Host "   python prepare_tounsi.py --snapshot-zip /path/to/snapshot.zip --limit 20" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Run sanity check training:" -ForegroundColor White  
Write-Host "   cd F5-TTS" -ForegroundColor Gray
Write-Host "   accelerate launch --config_file ../accelerate_cpu_config.yaml train.py \" -ForegroundColor Gray
Write-Host "     --dataset_name ../tounsi_dataset \" -ForegroundColor Gray
Write-Host "     --output_dir ../outputs/tounsi_sanity_check \" -ForegroundColor Gray
Write-Host "     --per_device_train_batch_size 1 \" -ForegroundColor Gray
Write-Host "     --max_steps 10 \" -ForegroundColor Gray
Write-Host "     --logging_steps 1" -ForegroundColor Gray
Write-Host ""
Write-Host "See README.md for detailed instructions" -ForegroundColor Cyan
