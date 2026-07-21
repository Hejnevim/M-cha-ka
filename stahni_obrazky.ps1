# Stazeni obrazku katalogu + knihoven (alternativa bez Pythonu)
# Spusteni: prave tlacitko na tento soubor -> "Spustit v prostredi PowerShell"
# Skript lze prerusit a spustit znovu - uz stazene soubory preskakuje.

$ErrorActionPreference = "SilentlyContinue"
Set-Location -Path $PSScriptRoot

$hlavicky = @{ Referer = "https://www.stricker-europe.com/cz/katalog/" }

function Stahni($url, $cesta) {
    if (Test-Path $cesta) {
        $b = [System.IO.File]::ReadAllBytes($cesta)
        if ($b.Length -gt 4 -and $b[0] -ne 60) { return $false }
        Remove-Item $cesta -Force  # vadny soubor (HTML) -> stahnout znovu
    }
    $dir = Split-Path $cesta
    if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    try {
        Invoke-WebRequest -Uri $url -OutFile $cesta -Headers $hlavicky -UseBasicParsing -TimeoutSec 30
        $b = [System.IO.File]::ReadAllBytes($cesta)
        if ($b.Length -lt 4 -or $b[0] -eq 60) {  # 60 = '<' -> HTML misto obrazku
            Remove-Item $cesta -Force
            Write-Host ("  ! server vratil HTML misto obrazku: " + $cesta)
            return $false
        }
        return $true
    } catch {
        Write-Host ("  ! chyba: " + $cesta)
        return $false
    }
}

Write-Host "1/2  Stahuji knihovny (offline beh aplikace)..."
Stahni "https://unpkg.com/react@18.3.1/umd/react.production.min.js" "lib/react.production.min.js" | Out-Null
Stahni "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" "lib/react-dom.production.min.js" | Out-Null
Stahni "https://unpkg.com/htm@3.1.1/dist/htm.js" "lib/htm.js" | Out-Null

Write-Host "2/2  Stahuji obrazky katalogu (5583 souboru, cca 15-40 minut)..."
$map = Get-Content -Raw -Encoding UTF8 "seznam_obrazku.json" | ConvertFrom-Json
$i = 0
$celkem = ($map.PSObject.Properties | Measure-Object).Count
foreach ($p in $map.PSObject.Properties) {
    Stahni $p.Name $p.Value | Out-Null
    $i++
    if ($i % 250 -eq 0) { Write-Host ("    " + $i + " / " + $celkem) }
}

Write-Host ""
Write-Host "Hotovo. Otevrete (nebo obnovte klavesou F5) index.html."
Read-Host "Stisknete Enter pro zavreni"
