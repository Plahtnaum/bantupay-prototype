import os

files = [
    'app/(app)/activity/page.tsx',
    'app/(app)/asset/[id]/page.tsx',
    'app/(app)/merchant/page.tsx',
    'app/(app)/profile/page.tsx',
    'app/(app)/receive/page.tsx',
    'app/(app)/scan/page.tsx',
    'app/(app)/send/page.tsx',
    'app/(app)/swap/page.tsx',
    'app/(app)/wallet/page.tsx',
    'app/onboarding/page.tsx',
    'components/layout/NotificationCenter.tsx'
]

for f_path in files:
    if not os.path.exists(f_path):
        print(f"Skipping {f_path}, not found.")
        continue
    
    with open(f_path, 'r') as f:
        content = f.read()
    
    # Fix corrupted template literals
    # We replace literal 'backslash-backtick' with 'backtick'
    # and literal 'backslash-dollar-brace' with 'dollar-brace'
    new_content = content.replace('\\`', '`').replace('\\${', '${')
    
    if new_content != content:
        with open(f_path, 'w') as f:
            f.write(new_content)
        print(f"Fixed {f_path}")
    else:
        print(f"No changes needed for {f_path}")
