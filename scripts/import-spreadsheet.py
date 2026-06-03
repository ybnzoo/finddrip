#!/usr/bin/env python3
"""Regénère products.js depuis Shasiel Spreadsheet.xlsx"""
import json
import re
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
XLSX = ROOT / 'Shasiel Spreadsheet.xlsx'
OUT = ROOT / 'products.js'

EUR_RATE = 0.92


def parse_price(raw):
    if raw is None:
        return '€ —'
    s = str(raw).strip().replace(',', '')
    m = re.search(r'[\d.]+', s)
    if not m:
        return '€ —'
    usd = float(m.group())
    if usd > 50000:
        return '€ —'
    eur = round(usd * EUR_RATE, 2)
    return f'€ {eur:.2f}'.replace('.00', '')


def extract_link(row):
    for cell in row[3:8]:
        if not cell:
            continue
        m = re.search(r'https://weidian\.com/item\.html\?itemID=\d+', str(cell))
        if m:
            return m.group(0)
    return None


def main():
    wb = openpyxl.load_workbook(XLSX, read_only=True)
    ws = wb.active
    products = []
    category = 'SHOES, BOOTS, SLIDES, ETC'
    seen = set()

    for row in ws.iter_rows(min_row=7, values_only=True):
        name = row[0] if row else None
        if not name or not isinstance(name, str):
            continue
        if name.startswith('='):
            continue
        if 'http' not in str(row) and row[2] is None and row[3] is None:
            category = name
            continue
        link = extract_link(row)
        if not link:
            continue
        key = (name.strip(), link)
        if key in seen:
            continue
        seen.add(key)
        products.append({
            'name': name.strip(),
            'price': parse_price(row[2]),
            'category': category,
            'link': link,
            'platform': 'Weidian',
        })

    OUT.write_text(
        'const PRODUCTS = ' + json.dumps(products, ensure_ascii=False, indent=2) + ';\n',
        encoding='utf-8',
    )
    print(f'Wrote {len(products)} products to {OUT}')


if __name__ == '__main__':
    main()
