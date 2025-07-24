#! /usr/bin/env python3
# coding: utf-8

def guess_key(encoded, decoded):
    print('guess_key of', encoded)
    key = ''
    iDecoded = 0
    for i in range(0, min(len(encoded), len(decoded))):
        e = encoded[i]
        d = decoded[iDecoded]
        if e == ' ':
            print()
            continue
        print('i', i, '- e', e, ord(e), '- d', d, ord(d), '- xor', ord(e) ^ ord(d), chr(ord(e) ^ ord(d)) )
        code = ord(e) ^ ord(d)
        # code = code % 26
        # code += ord('A')
        key += chr(code)
        iDecoded += 1
    print(key)


# guess_key('YT NOT OT YASOT TRT', 'LE MOT DE PASSE EST')
s = '\u000A\u0010 \u001C\u0007\u0006\u001F \u0003\u0006\u0018'
guess_key(s, 'LEMOTDEPASSEEST')
exit()

def encrypt(encoded, key):
    iKey = 0
    pwd = ''
    print('s:', encoded)
    for i,c in enumerate(encoded):
        print('c', i, c, ord(c), key[iKey], ord(key[iKey]), ord(c) ^ ord(key[iKey]), chr(ord(c) ^ ord(key[iKey])) )
        pwd += chr(ord(c) ^ ord(key[iKey]))
        iKey += 1
        iKey = iKey % len(key)
    print(pwd)

key = 'FULL'
s = '\u000A\u0010L\u001C\u0007\u0006\u001FL\u0003\u0006\u0018L\u000A\u0014\u0002\u000B\u0013\u0014\u000B\u0009'
encrypt(s, key)
