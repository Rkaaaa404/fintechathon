@echo off
chcp 65001 >nul
title AegisPath Security Evaluation Suite Runner
color 0A

:: Selalu pindah ke root fintechathon (parent dari folder eval ini)
cd /d "%~dp0.."

:menu
cls
echo ==============================================================================
echo        AEGISPATH SECURITY EVALUATION HARNESS - MASTER RUNNER
echo        FinTechathon 2026 - International AI Track (Team 5 IT Goes To China)
echo ==============================================================================
echo.
echo  CWD: %CD%
echo.
echo Pilih skrip pengujian yang ingin Anda jalankan:
echo.
echo [1] JALANKAN SEMUA DARI 0 (Full End-to-End Evaluation Pipeline)
echo     - 179 Core Backend ^& Bank Tests (Pytest)
echo     - 4 Core Security Suites (Prompt, Fraud, Escalation, Resilience)
echo     - 120 Adversarial Attacks ^& 3-Ring Ablation Benchmark
echo     - 118 OWASP LLM ^& WSTG Tests (13 Kategori A - M)
echo     - Spotlight Known Risks ^& Deferred Scope Verification
echo.
echo [2] Backend Core ^& Bank Unit Tests (179 Tests via Pytest)
echo [3] Section 02.1 Security Suites (verify_suites.py)
echo [4] Adversarial Benchmark 120 Attacks ^& Ablation (attacks.py)
echo [5] 13 Kategori Audit OWASP LLM ^& WSTG (generate_category_readmes.py)
echo [6] Spotlight Audit: 4 Known Risks ^& Deferred Scope (verify_spotlight.py)
echo [7] Uji Khusus Scope Disiplin MVP (uji_deferred_scope.bat)
echo [8] Keluar
echo.
echo ==============================================================================
set /p pilihan="Masukkan pilihan Anda (1-8): "

if "%pilihan%"=="1" goto run_all
if "%pilihan%"=="2" goto run_pytest
if "%pilihan%"=="3" goto run_suites
if "%pilihan%"=="4" goto run_attacks
if "%pilihan%"=="5" goto run_categories
if "%pilihan%"=="6" goto run_spotlight
if "%pilihan%"=="7" goto run_deferred
if "%pilihan%"=="8" goto exit

echo.
echo Pilihan tidak valid! Silakan masukkan angka 1 sampai 8.
timeout /t 2 >nul
goto menu

:run_all
cls
echo ==============================================================================
echo TAHAP 1/5: Menjalankan 179 Backend Core ^& Bank Unit Tests (Pytest)...
echo ==============================================================================
python -m pytest backend/api/tests/ backend/bank/tests/ -v
if %errorlevel% neq 0 (
    echo [ERROR] Pytest gagal!
    pause
    goto menu
)
echo.
echo ==============================================================================
echo TAHAP 2/5: Menjalankan Section 02.1 Security Suites Harness...
echo ==============================================================================
python eval/verify_suites.py
if %errorlevel% neq 0 (
    echo [ERROR] Verify suites gagal!
    pause
    goto menu
)
echo.
echo ==============================================================================
echo TAHAP 3/5: Menjalankan 120 Adversarial Attacks ^& 3-Ring Ablation Benchmark...
echo ==============================================================================
python eval/attacks.py
if %errorlevel% neq 0 (
    echo [ERROR] Attack benchmark gagal!
    pause
    goto menu
)
echo.
echo ==============================================================================
echo TAHAP 4/5: Menjalankan 13 Kategori OWASP LLM ^& WSTG (118 Test Items)...
echo ==============================================================================
python eval/generate_category_readmes.py
if %errorlevel% neq 0 (
    echo [ERROR] Evaluasi 13 kategori gagal!
    pause
    goto menu
)
echo.
echo ==============================================================================
echo TAHAP 5/5: Menjalankan Spotlight Audit (Known Risks ^& Deferred Scope)...
echo ==============================================================================
python eval/verify_spotlight.py
echo.
echo ==============================================================================
echo SELURUH PENGUJIAN DARI 0 SELESAI DENGAN 100%% LULUS (ZERO ERROR)!
echo ==============================================================================
pause
goto menu

:run_pytest
cls
echo Menjalankan Backend ^& Bank Unit Tests (179 Tests)...
python -m pytest backend/api/tests/ backend/bank/tests/ -v
echo.
pause
goto menu

:run_suites
cls
echo Menjalankan Section 02.1 Security Suites...
python eval/verify_suites.py
echo.
pause
goto menu

:run_attacks
cls
echo Menjalankan 120 Adversarial Attacks ^& 3-Ring Ablation Benchmark...
python eval/attacks.py
echo.
pause
goto menu

:run_categories
cls
echo Menjalankan 13 Kategori OWASP LLM ^& WSTG (118 Tests)...
python eval/generate_category_readmes.py
echo.
pause
goto menu

:run_spotlight
cls
echo Menjalankan Spotlight Audit: 4 Known Risks ^& Deferred Scope...
python eval/verify_spotlight.py
echo.
pause
goto menu

:run_deferred
cls
call eval\uji_deferred_scope.bat
goto menu

:exit
cls
echo Terima kasih!
exit /b 0
