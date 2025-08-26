Param(
  [string]$PostgresUrl = $env:POSTGRES_URL,
  [switch]$SkipBackup,
  [string]$BackupDir = "backups",
  [switch]$RunSeed
)

Write-Host "[DEPLOY] Starting production deployment script" -ForegroundColor Cyan

if (-not $PostgresUrl) { Write-Error "POSTGRES_URL not provided (env or -PostgresUrl)."; exit 1 }

# 1. Backup (optional)
if (-not $SkipBackup) {
  if (-not (Get-Command pg_dump -ErrorAction SilentlyContinue)) {
    Write-Warning "pg_dump not found; skipping backup (pass -SkipBackup to suppress)." 
  } else {
    if (-not (Test-Path $BackupDir)) { New-Item -ItemType Directory -Path $BackupDir | Out-Null }
    $timestamp = Get-Date -Format yyyyMMddHHmmss
    $backupFile = Join-Path $BackupDir "db-backup-$timestamp.dump"
    Write-Host "[DEPLOY] Creating DB backup: $backupFile"
    $env:PGPASSWORD = ( [System.Uri]::new($PostgresUrl).UserInfo.Split(':')[1] ) 2>$null
    try {
      pg_dump $PostgresUrl -Fc -f $backupFile
      Write-Host "[DEPLOY] Backup complete." -ForegroundColor Green
    } catch { Write-Warning "Backup failed: $($_.Exception.Message)" }
  }
} else { Write-Host "[DEPLOY] Skipping backup as requested." }

# 2. Install dependencies (use ci if lockfile present)
if (Test-Path package-lock.json) {
  Write-Host "[DEPLOY] Installing dependencies (npm ci)..."
  npm ci
} else {
  Write-Host "[DEPLOY] Installing dependencies (npm install)..."
  npm install --production
}

if ($LASTEXITCODE -ne 0) { Write-Error "Dependency installation failed."; exit 1 }

# 3. Run migrations / manual SQL
Write-Host "[DEPLOY] Running migrations..." -ForegroundColor Cyan
npm run db:migrate 2>&1 | Write-Host
if ($LASTEXITCODE -ne 0) { Write-Error "Migrations failed."; exit 1 }

# 4. Restore core tables (idempotent)
Write-Host "[DEPLOY] Ensuring core tables exist..."
npm run db:restore:core
if ($LASTEXITCODE -ne 0) { Write-Error "Core table restore failed."; exit 1 }

# 5. (Optional) seed
if ($RunSeed) {
  Write-Host "[DEPLOY] Seeding database (db:seed)..."
  npm run db:seed
  if ($LASTEXITCODE -ne 0) { Write-Warning "Seeding failed; continuing." }
}

# 6. Build
Write-Host "[DEPLOY] Building application..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Build failed."; exit 1 }

Write-Host "[DEPLOY] Build complete. You can now start the server: npm start" -ForegroundColor Green
Write-Host "[DEPLOY] Done." -ForegroundColor Green
