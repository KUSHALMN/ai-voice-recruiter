import os
import sys

# Forward to scripts/run_backend.py
script_path = os.path.join(os.path.dirname(__file__), 'scripts', 'run_backend.py')
with open(script_path, 'r', encoding='utf-8') as f:
    code = f.read()
exec(compile(code, script_path, 'exec'))
