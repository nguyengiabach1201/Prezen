@echo off
setlocal enabledelayedexpansion
@REM ,.\src\prezen.js
set "file_list=.\plugins\tex-chtml.js,.\plugins\chart.js,.\src\js\prezen-chart.min.js,.\src\js\prezen.min.js" 
set "output_file=prezen.js"

set "output_path=."

if not exist "%output_path%" mkdir "%output_path%"

set output_file_path="%output_path%\%output_file%"

type nul > "%output_file_path%"

for %%a in ("%file_list%") do (
    type "%%a" >> "%output_file_path%"
)

echo Merging complete. Output file: %output_file_path%