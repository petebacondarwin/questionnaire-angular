@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "C:\Users\pete\dev\tech\kanso\bin\kanso" %*
) ELSE (
  node  "C:\Users\pete\dev\tech\kanso\bin\kanso" %*
)