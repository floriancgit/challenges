#!/usr/bin/env python3
import socket
import re
import numpy as np
from termcolor import colored, cprint

np.set_printoptions(threshold=1000, linewidth=1000, edgeitems=1000)

SEND_TEST = "1"  
SEND_MINE = "2"
HOST = "newbiecontest.org"  # The server's hostname or IP address
PORT = 10001  # The port used by the server
ROWS = 0
COLS = 0
BOARD = []
MINES = 0
MINES_FOUND = 0

def recvall(sock, max_msg_size=1024):
    string_lines = ""
    print("📩📩📩📩📩📩📩📩📩📩📩📩📩📩📩📩📩📩 Received 📩📩📩📩📩📩📩📩📩📩📩📩📩📩📩📩📩📩")
    while True:
        bytes_line = sock.recv(max_msg_size)
        if not bytes_line: # no data
            break
        string_lines += (bytes_line.decode('utf-8'))
        if b"Indiquer la position d'un mine\n>:" in bytes_line:
            break
        if b"Votre case (sous la forme \"x,y\") : " in bytes_line:
            break
    print(string_lines)
    print("🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺")

    return string_lines

def send(mode, cell):
    global BOARD
    print('➡️ Send mode('+mode+') & cell('+cell+')')
    s.sendall(mode.encode()) # send 1-test
    data = recvall(s)
    s.sendall(cell.encode()) # string to bytes
    data = recvall(s)

    if "Perdu" in data:
        print("❌ Perdu, exiting.")
        exit()

    # update board from input
    lines = data.split("\n")
    for i, line in enumerate(lines):
        if "+--" in line:
            for row in range(ROWS):
                for col in range(COLS):
                    char = lines[i+row+1][2 + col*2]
                    BOARD[row][col] = char
        break
    print('➡️ Board updated:')
    print_board()

def print_board():
    global BOARD
    print("➡️ Print board --------------------")
    for row in range(ROWS):
        for col in range(COLS):
            if BOARD[row][col] == "?":
                cprint(BOARD[row][col], 'yellow', end=' ')
            elif BOARD[row][col] == ".":
                cprint(BOARD[row][col], 'white', end=' ')
            elif BOARD[row][col].isdigit():
                cprint(BOARD[row][col], 'blue', end=' ')
            else:
                cprint(BOARD[row][col], 'red', end=' ')
        print()
    print("-----------------------------------")

def init_board(data):
    # init ROWS, COLS, BOARD, MINES
    global ROWS, COLS, BOARD, MINES
    lines = data.split("\n")
    for line in lines:
        if "Vous devez trouver" in line:
            match = re.search(r'(\d+) mines', line)
            if match:
                MINES = int(match.group(1))
        if "+--" in line:
            continue
        if "| ?" in line:
            COLS = line.count("?")
            ROWS += 1
    print("💡 ROWS: "+str(ROWS)+" COLS: "+str(COLS)+" MINES: "+str(MINES))
    BOARD = np.full((ROWS, COLS), ".")

    # NORTH WEST
    print('➡️ Sending NORTH WEST')
    send(SEND_TEST, '0,0')
    # NORTH EAST
    if BOARD[0][COLS-1] == "?":
        print('➡️ Sending NORTH EAST')
        send(SEND_TEST, str(COLS-1)+',0')
    # SOUTH WEST
    if BOARD[ROWS-1][0] == "?":
        print('➡️ Sending SOUTH WEST')
        send(SEND_TEST, '0,'+str(ROWS-1))
    # SOUTH EAST
    if BOARD[ROWS-1][COLS-1] == "?":
        print('➡️ Sending SOUTH EAST')
        send(SEND_TEST, str(COLS-1)+','+str(ROWS-1))

def solve_board(data):
    global BOARD, MINES_FOUND
    first_cell_0 = None
    # find first mine
    for row in range(ROWS):
        for col in range(COLS):
            if BOARD[row][col].isdigit():
                nb_mines = int(BOARD[row][col])
                adjacent_unknown = []
                adjacent_mines = 0
                for i in range(max(0, row-1), min(ROWS, row+2)):
                    for j in range(max(0, col-1), min(COLS, col+2)):
                        if BOARD[i][j] == "?":
                            adjacent_unknown.append(str(j)+","+str(i))
                        elif BOARD[i][j] == "X":
                            adjacent_mines += 1
                
                if nb_mines - adjacent_mines <= 0:
                    if len(adjacent_unknown) >0 and first_cell_0 is None:
                        first_cell_0 = adjacent_unknown[0]
                    continue
                
                print("🔍 For cell ("+str(col)+","+str(row)+") "+str(nb_mines)+" with "+str(len(adjacent_unknown))+" adjacent unknown cells: "+' / '.join(adjacent_unknown))
                
                if nb_mines - adjacent_mines == len(adjacent_unknown):
                    print("💣 Found cell with bomb: "+adjacent_unknown[0])
                    MINES_FOUND += 1

                    send(SEND_MINE, adjacent_unknown[0])
                    return
                
    print("❌ No mine found, sending the first_cell_0")
    print("➡️ Sending cell ("+first_cell_0+")")
    send(SEND_TEST, first_cell_0)
    # exit()
    return

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))
    data = recvall(s) # receive board & get N_MINES

    data = init_board(data)

    
    while MINES_FOUND < MINES and MINES_FOUND < 500:
        print('💥💥 '+str(MINES_FOUND)+' found out of '+str(MINES))
        data = solve_board(data)
