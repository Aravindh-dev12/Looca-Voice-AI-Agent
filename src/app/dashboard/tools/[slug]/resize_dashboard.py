import os
import re

file_path = r'c:\Users\ELCOT\Downloads\looca-voice-ai\src\app\dashboard\tools\[slug]\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Sidebar width
content = content.replace('w-[360px] border-l', 'w-[300px] border-l')

# 2. Sidebar padding and spacing
content = content.replace('px-6 pt-6 shrink-0 bg-white', 'px-5 pt-5 shrink-0 bg-white')
content = content.replace('pb-4 pr-8 text-xs', 'pb-3 pr-6 text-[10px]')
content = content.replace('pb-4 px-8 text-xs', 'pb-3 px-6 text-[10px]')
content = content.replace('right-8 h-[2px]', 'right-6 h-[2px]')
content = content.replace('left-8 right-8 h-[2px]', 'left-6 right-6 h-[2px]')
content = content.replace('p-6 space-y-8', 'p-5 space-y-6')

# 3. Bottom bar
content = content.replace('h-20 border-t border-zinc-50 flex items-center justify-between px-8', 'h-16 border-t border-zinc-50 flex items-center justify-between px-6')
content = content.replace('w-4 h-4 rounded-full border-2 border-zinc-100 flex items-center justify-center', 'w-3.5 h-3.5 rounded-full border-2 border-zinc-100 flex items-center justify-center')
content = content.replace('w-1.5 h-1.5 rounded-full bg-zinc-200', 'w-1 h-1 rounded-full bg-zinc-200')
content = content.replace('text-xs font-bold text-zinc-300', 'text-[10px] font-bold text-zinc-300')
content = content.replace('h-12 px-12 rounded-2xl text-sm', 'h-10 px-8 rounded-xl text-xs')

# 4. Sound Effects (VFX) header and categories
content = content.replace('pb-4">', 'pb-3">')
content = content.replace('text-[2rem] font-black tracking-tight text-black">Sound Effects', 'text-xl font-black tracking-tight text-black">Sound Effects')
content = content.replace('rounded-[28px]', 'rounded-[20px]')
content = content.replace('text-4xl', 'text-2xl') # This might affect other things but let's see
content = content.replace('p-4">', 'p-3">')
content = content.replace('text-sm font-black tracking-tight text-white', 'text-[11px] font-black tracking-tight text-white uppercase')

# 5. Search inputs and buttons
content = content.replace('h-11 pl-12 pr-4', 'h-10 pl-10 pr-4')
content = content.replace('w-5 h-5 text-zinc-400 absolute left-4', 'w-4 h-4 text-zinc-400 absolute left-3.5')
content = content.replace('h-11 px-5 rounded-xl font-bold border-zinc-200 text-zinc-600', 'h-10 px-4 rounded-xl font-bold border-zinc-200 text-xs text-zinc-600')
content = content.replace('w-4 h-4 ml-2', 'w-3.5 h-3.5 ml-2')

# 6. VFX Prompt bar
content = content.replace('max-w-2xl bg-white border border-zinc-200 rounded-[28px] shadow-xl p-4 flex flex-col gap-4', 'max-w-xl bg-white border border-zinc-200 rounded-[24px] shadow-lg p-3 flex flex-col gap-3')
content = content.replace('text-base font-medium text-zinc-900 placeholder:text-zinc-400 bg-transparent focus:outline-none', 'text-sm font-medium text-zinc-900 placeholder:text-zinc-400 bg-transparent focus:outline-none')
content = content.replace('w-10 h-10 rounded-full bg-zinc-900 hover:bg-black text-white p-0 flex items-center justify-center disabled:opacity-50', 'w-8 h-8 rounded-full bg-zinc-900 hover:bg-black text-white p-0 flex items-center justify-center disabled:opacity-50')
content = content.replace('width="16" height="16"', 'width="14" height="14"')

# 7. Processing view
content = content.replace('w-48 h-48', 'w-36 h-36')
content = content.replace('cx="96" cy="96" r="90"', 'cx="72" cy="72" r="66"')
content = content.replace('strokeDasharray="565.48"', 'strokeDasharray="414.69"')
content = content.replace('animate={{ strokeDashoffset: 565.48', 'animate={{ strokeDashoffset: 414.69')

# 8. Tool Editor / Transcript view
content = content.replace('rounded-[40px] border border-zinc-100 shadow-sm p-10 flex flex-col space-y-6', 'rounded-[32px] border border-zinc-100 shadow-sm p-6 flex flex-col space-y-4')
content = content.replace('text-4xl font-black text-zinc-900 placeholder:text-zinc-100', 'text-2xl font-black text-zinc-900 placeholder:text-zinc-100')
content = content.replace('h-20 w-20 items-center justify-center rounded-3xl', 'h-14 w-14 items-center justify-center rounded-2xl')
content = content.replace('h-9 w-9', 'h-6 w-6')
content = content.replace('text-4xl font-black tracking-tight text-black', 'text-2xl font-black tracking-tight text-black')
content = content.replace('mt-2 text-lg text-zinc-500', 'mt-1 text-sm text-zinc-500')
content = content.replace('rounded-[36px] border border-zinc-200 bg-zinc-50 p-8 shadow-sm', 'rounded-[28px] border border-zinc-200 bg-zinc-50 p-6 shadow-sm')
content = content.replace('text-lg leading-8 text-zinc-800', 'text-base leading-7 text-zinc-800')

# 9. Tool Info / Icon
content = content.replace('w-20 h-20 bg-black rounded-3xl flex items-center justify-center mx-auto shadow-2xl', 'w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto shadow-xl')
content = content.replace('w-10 h-10 text-white', 'w-8 h-8 text-white')
content = content.replace('text-4xl font-black text-black tracking-tight', 'text-2xl font-black text-black tracking-tight')
content = content.replace('text-zinc-500 font-medium text-base max-w-lg mx-auto', 'text-zinc-500 font-medium text-sm max-w-md mx-auto')

# 10. Upload Card
content = content.replace('max-w-lg p-8 border-[3px] border-dashed border-zinc-100 rounded-[36px] bg-white hover:border-zinc-200 hover:bg-zinc-50 transition-all cursor-pointer group shadow-xl', 'max-w-md p-6 border-2 border-dashed border-zinc-100 rounded-[28px] bg-white hover:border-zinc-200 hover:bg-zinc-50 transition-all cursor-pointer group shadow-lg')
content = content.replace('space-y-6 text-center', 'space-y-4 text-center')
content = content.replace('w-24 h-24 rounded-3xl bg-zinc-100 flex items-center justify-center mx-auto group-hover:scale-110', 'w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto group-hover:scale-105')
content = content.replace('Upload className="w-10 h-10', 'Upload className="w-7 h-7')
content = content.replace('text-[1.7rem] font-black text-black', 'text-xl font-black text-black')
content = content.replace('text-zinc-400 font-medium text-xs font-black uppercase tracking-widest', 'text-zinc-400 font-medium text-[10px] font-black uppercase tracking-widest')

# 11. Dropdowns and Settings
content = content.replace('h-12 px-4 flex items-center justify-between bg-white border border-zinc-100 rounded-2xl text-xs font-bold text-zinc-900', 'h-10 px-4 flex items-center justify-between bg-white border border-zinc-100 rounded-xl text-[11px] font-bold text-zinc-900')
content = content.replace('space-y-10 pt-4', 'space-y-6 pt-2')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully replaced all dashboard tool sizes.")
