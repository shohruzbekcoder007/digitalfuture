@echo off
echo === Journal platform — local setup ===
echo.

cd /d "%~dp0"

if not exist backend\.env (
  echo [1/4] backend\.env yaratilmoqda...
  copy backend\.env.example backend\.env >nul
) else (
  echo [1/4] backend\.env mavjud, o'tkazib yuborildi.
)

if not exist frontend\.env (
  echo [2/4] frontend\.env yaratilmoqda...
  copy frontend\.env.example frontend\.env >nul
) else (
  echo [2/4] frontend\.env mavjud, o'tkazib yuborildi.
)

echo [3/4] Dependency'lar o'rnatilmoqda (root + backend + frontend)...
call npm install
call npm --prefix backend install
call npm --prefix frontend install

echo.
echo [4/4] Tayyor!
echo.
echo Endi quyidagilarni bajaring:
echo   1) MongoDB ishlayotganiga ishonch hosil qiling (mongod yoki MongoDB Compass).
echo   2) Seed data: npm run seed
echo   3) Dev: npm run dev
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000/api/health
echo.
pause
