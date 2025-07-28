#!/usr/bin/env python3
import numpy as np

def deduce_mines(board, revealed, marked):
    rows, cols = board.shape
    changes = True

    while changes:
        changes = False
        for row in range(rows):
            for col in range(cols):
                if revealed[row, col] and board[row, col] > 0:
                    # Vérifier les cellules adjacentes
                    adjacent_cells = []
                    for i in range(max(0, row-1), min(rows, row+2)):
                        for j in range(max(0, col-1), min(cols, col+2)):
                            if not revealed[i, j] and not marked[i, j]:
                                adjacent_cells.append((i, j))

                    # Si le nombre de cellules adjacentes non révélées est égal au nombre de mines indiqué
                    if len(adjacent_cells) == board[row, col]:
                        for i, j in adjacent_cells:
                            marked[i, j] = True
                            changes = True

                    # Si le nombre de mines marquées est égal au nombre de mines indiqué
                    marked_count = 0
                    for i, j in adjacent_cells:
                        if marked[i, j]:
                            marked_count += 1

                    if marked_count == board[row, col]:
                        for i, j in adjacent_cells:
                            if not marked[i, j]:
                                revealed[i, j] = True
                                changes = True
    return revealed, marked

# Exemple d'utilisation
board = np.array([
    [1, -1, 1, 0, 0],
    [1, 2, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, -1],
    [0, 0, 0, 1, 1]
])

revealed = np.array([
    [True, False, True, False, False],
    [True, False, True, False, False],
    [False, True, True, True, False],
    [False, False, False, True, False],
    [False, False, False, True, False]
])

marked = np.zeros_like(board, dtype=bool)

revealed, marked = deduce_mines(board, revealed, marked)

print("Revealed:")
print(revealed)
print("\nMarked Mines:")
print(marked)
