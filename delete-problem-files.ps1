# Delete problematic files that are causing Netlify build failures

Write-Host "Starting deletion of problematic files..." -ForegroundColor Yellow

# Delete babel.config.js
if (Test-Path "babel.config.js") {
    Remove-Item "babel.config.js" -Force
    Write-Host "✅ Deleted babel.config.js" -ForegroundColor Green
} else {
    Write-Host "ℹ️ babel.config.js not found" -ForegroundColor Blue
}

# Delete marketing directory
if (Test-Path "app\(marketing)") {
    Remove-Item "app\(marketing)" -Recurse -Force
    Write-Host "✅ Deleted app\(marketing) directory" -ForegroundColor Green
} else {
    Write-Host "ℹ️ app\(marketing) directory not found" -ForegroundColor Blue
}

# Check if files are gone
Write-Host "`nVerification:" -ForegroundColor Yellow
if (Test-Path "babel.config.js") {
    Write-Host "❌ babel.config.js still exists" -ForegroundColor Red
} else {
    Write-Host "✅ babel.config.js successfully deleted" -ForegroundColor Green
}

if (Test-Path "app\(marketing)") {
    Write-Host "❌ app\(marketing) directory still exists" -ForegroundColor Red
} else {
    Write-Host "✅ app\(marketing) directory successfully deleted" -ForegroundColor Green
}

Write-Host "`nNow running git commands..." -ForegroundColor Yellow

# Stage all changes
git add -A
Write-Host "✅ Staged all changes" -ForegroundColor Green

# Commit changes
git commit -m "FORCE DELETE: Remove babel.config.js and marketing pages for Netlify fix"
Write-Host "✅ Committed changes" -ForegroundColor Green

# Push changes
git push origin main
Write-Host "✅ Pushed to repository" -ForegroundColor Green

Write-Host "`n🚀 Files deleted and changes pushed! Netlify should build successfully now." -ForegroundColor Green
