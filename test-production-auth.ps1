# Test Production Authentication Script
# Use this to quickly test production login functionality

Write-Host "=== Production Authentication Test ===" -ForegroundColor Cyan

# Check if the debug endpoint is accessible
Write-Host "`nTesting debug endpoint..." -ForegroundColor Yellow
try {
    $debugResponse = Invoke-RestMethod -Uri "https://ctrlaltblock.com/api/debug/auth" -Method GET
    Write-Host "Debug endpoint accessible: $($debugResponse.environment)" -ForegroundColor Green
} catch {
    Write-Host "Debug endpoint error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test login endpoint
Write-Host "`nTesting login endpoint..." -ForegroundColor Yellow
$testCredentials = @{
    email = "test@example.com"
    password = "testpassword"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "https://ctrlaltblock.com/api/auth/signin" -Method POST -Body $testCredentials -ContentType "application/json"
    Write-Host "Login test: $($loginResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "Login test error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Manual Testing Instructions ===" -ForegroundColor Cyan
Write-Host "1. Visit: https://ctrlaltblock.com/sign-in"
Write-Host "2. Try logging in with your credentials"
Write-Host "3. Check browser DevTools Network tab for any errors"
Write-Host "4. If login fails, check: https://ctrlaltblock.com/api/debug/auth"
Write-Host "5. Monitor server logs for authentication errors"

Write-Host "`n=== Key Changes Made ===" -ForegroundColor Cyan
Write-Host "✓ Fixed schema import inconsistency (minimal → actual)"
Write-Host "✓ Added production cookie domain (.ctrlaltblock.com)"
Write-Host "✓ Enhanced cookie security (httpOnly, secure, sameSite)"
Write-Host "✓ Created debug endpoint for troubleshooting"
Write-Host "✓ Build successful after cache cleanup"
