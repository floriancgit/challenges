#! /usr/bin/env python3
# coding: utf-8

def main():
    # Initialisation des "mémoires"
    memory_80 = [0] * 256
    memory_a0 = [0] * 256
    memory_90 = [0] * 256

    # Stocker des valeurs initiales
    memory_80[0x80] = 0x00
    memory_a0[0xA0] = 0x10
    memory_80[0x81] = 0x17
    memory_a0[0xA1] = 0x17
    memory_90[0x90] = 0xD2
    memory_90[0x91] = 0xBB

    # Remplir les mémoires avec des valeurs spécifiques
    data_80 = [0xA7, 0xA1, 0xB4, 0x35, 0x28, 0x24, 0xB8, 0x3F, 0xA6]
    data_a0 = [0x50, 0x61, 0x70, 0x79, 0x41, 0x6C, 0x6C, 0x61, 0x6E]

    for i in range(len(data_80)):
        memory_80[i] = data_80[i]
        memory_a0[i] = data_a0[i]

    # Traitement des données
    for y in range(len(data_80)):
        value_80 = memory_80[y]
        value_a0 = memory_a0[y]

        # Effectuer des opérations logiques et arithmétiques
        result = ((value_80 & 0x80) != 0)  # Tester le bit le plus significatif
        value_80_rolled = ((value_80 << 1) | (value_80 >> 7)) & 0xFF  # Rotation à gauche
        eor_result = value_80_rolled ^ value_a0
        final_value = (eor_result + 0x30) & 0xFF

        # Stocker le résultat
        memory_90[y] = final_value

    # Afficher les résultats
    print("Memory 90 contents:", [hex(x) for x in memory_90[:len(data_80)]])

if __name__ == "__main__":
    main()