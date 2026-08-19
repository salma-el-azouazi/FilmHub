from pathlib import Path

path = Path('app.py')
text = path.read_text(encoding='utf-8')
old = '@app.before_first_request\ndef startup():\n    init_db()\n\n'
if old not in text:
    raise SystemExit('pattern not found')
text = text.replace(old, 'def startup():\n    init_db()\n\n# Initialize the database before starting the app\nstartup()\n\n')
path.write_text(text, encoding='utf-8')
print('patched app.py')
