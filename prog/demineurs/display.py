#!/usr/bin/env python3

import numpy as np
import random

def create_minesweeper_board(size=10, num_mines=10):
    board = np.zeros((size, size), dtype=int)
    mine_positions = random.sample(range(size * size), num_mines)

    for pos in mine_positions:
        row, col = divmod(pos, size)
        board[row, col] = -1  # -1 represents a mine

    for row in range(size):
        for col in range(size):
            if board[row, col] == -1:
                continue
            # Check all 8 surrounding cells
            for i in range(max(0, row-1), min(size, row+2)):
                for j in range(max(0, col-1), min(size, col+2)):
                    if board[i, j] == -1:
                        board[row, col] += 1

    return board

# Create a board
board = create_minesweeper_board()
print(board)