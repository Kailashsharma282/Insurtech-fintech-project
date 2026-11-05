# Update farmer insurance headers
with open('src/app/farmer/insurance/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    'FARMER NET PAYABLE (20%)',
    'FARMER SHARE'
)
text = text.replace(
    'GOVT SUBSIDY (80%)',
    'GOVT SUBSIDY'
)

with open('src/app/farmer/insurance/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

# Update insurer claims container width
with open('src/app/insurer/claims/page.tsx', 'r', encoding='utf-8') as f:
    c_text = f.read()

c_text = c_text.replace(
    'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8',
    'max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8'
)

with open('src/app/insurer/claims/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c_text)

print("Updated farmer insurance and insurer claims width successfully!")
