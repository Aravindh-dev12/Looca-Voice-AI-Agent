import os
import re

file_path = r'c:\Users\ELCOT\Downloads\looca-voice-ai\src\app\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Modal size
content = content.replace('max-w-4xl rounded-[32px]', 'max-w-3xl rounded-[28px]')
content = content.replace('text-3xl font-bold tracking-tight', 'text-2xl font-bold tracking-tight')
content = content.replace('p-5 text-left transition-all', 'p-4 text-left transition-all')
content = content.replace('h-12 w-12 items-center justify-center rounded-2xl', 'h-10 w-10 items-center justify-center rounded-xl')

# 2. Main heading
content = content.replace('text-4xl font-bold tracking-tight text-slate-950">Talk to Looca', 'text-3xl font-bold tracking-tight text-slate-950">Talk to Looca')

# 3. Talk button
content = content.replace('h-52 w-52 items-center justify-center rounded-full', 'h-40 w-40 items-center justify-center rounded-full')
content = content.replace('h-16 w-16 items-center justify-center rounded-full', 'h-12 w-12 items-center justify-center rounded-full')
content = content.replace('text-2xl font-bold text-slate-950', 'text-xl font-bold text-slate-950')

# 4. Context cards and other cards
content = content.replace('rounded-[32px] border border-slate-200 bg-white p-6 shadow', 'rounded-[28px] border border-slate-200 bg-white p-5 shadow')
content = content.replace('rounded-[28px] border border-slate-200 bg-slate-50 p-4', 'rounded-[24px] border border-slate-200 bg-slate-50 p-3.5')
content = content.replace('px-4 py-4 text-sm leading-6', 'px-3.5 py-3.5 text-xs leading-5')
content = content.replace('h-11 w-11 items-center justify-center rounded-2xl', 'h-9 w-9 items-center justify-center rounded-xl')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully replaced all dashboard home sizes.")
