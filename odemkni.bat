@echo off
REM Odemkne nebo zamkne technologii. Bez parametru vypise stav.
REM   odemkni.bat            stav vsech technologii
REM   odemkni.bat FIR        odemkne FIR
REM   odemkni.bat SCR -z     zamkne SCR
python "%~dp0odemkni.py" %*
if "%~1"=="" pause
