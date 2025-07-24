#! /usr/bin/env python3
# coding: utf-8

# Bruteforce du XOR du mot "ANNVONT" avec toutes les clés possibles (1 octet)
mot = b"ANNVONT"

for c in mot:
    print(f"- Caractère '{chr(c)}' ({c}): ", end=' ')
    for i in range(256):
        key = i
        resultat_int = c ^ key
        resultat_bin = bytes([resultat_int])
        resultat_str = resultat_bin.decode('utf-8', errors='ignore')
        if not resultat_str.isalpha() and not resultat_str.isupper():
            continue
        print(resultat_str, end=' ')
    print()  # Nouvelle ligne après chaque caractère traité