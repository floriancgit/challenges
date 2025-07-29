#! /usr/bin/env python3
# coding: utf-8
import sys
from datetime import datetime
import os
import re
from collections import deque
from PIL import Image

sys.path.insert(0, '../..')
from config import *
from functions import *

import networkx as nx
from collections import deque

class SokobanState:
    def __init__(self, player_pos, box_positions, target_positions, grid):
        self.player_pos = player_pos
        self.box_positions = frozenset(box_positions)
        self.target_positions = frozenset(target_positions)
        self.grid = grid

    def is_goal(self):
        return self.box_positions == self.target_positions

    def __eq__(self, other):
        return (self.player_pos == other.player_pos and
                self.box_positions == other.box_positions)

    def __hash__(self):
        return hash((self.player_pos, self.box_positions))

def get_next_states(state):
    next_states = []
    directions = [(-1, 0, 'L'), (1, 0, 'R'), (0, -1, 'U'), (0, 1, 'D')]

    for dx, dy, direction in directions:
        new_player_pos = (state.player_pos[0] + dx, state.player_pos[1] + dy)

        if (new_player_pos[0] < 0 or new_player_pos[0] >= len(state.grid) or
            new_player_pos[1] < 0 or new_player_pos[1] >= len(state.grid[0])):
            continue

        if state.grid[new_player_pos[0]][new_player_pos[1]] != '0':
            new_box_positions = list(state.box_positions)

            if new_player_pos in state.box_positions:
                new_box_pos = (new_player_pos[0] + dx, new_player_pos[1] + dy)

                if (new_box_pos[0] < 0 or new_box_pos[0] >= len(state.grid) or
                    new_box_pos[1] < 0 or new_box_pos[1] >= len(state.grid[0])):
                    continue

                if state.grid[new_box_pos[0]][new_box_pos[1]] != '0':
                    new_box_positions.remove(new_player_pos)
                    new_box_positions.append(new_box_pos)
                    new_box_positions = frozenset(new_box_positions)
                    new_state = SokobanState(new_player_pos, new_box_positions, state.target_positions, state.grid)
                    next_states.append((new_state, direction))
            else:
                new_state = SokobanState(new_player_pos, state.box_positions, state.target_positions, state.grid)
                next_states.append((new_state, direction))

    return next_states

def solve_sokoban_with_networkx(initial_state):
    queue = deque([(initial_state, "")])
    visited = set([initial_state])
    shortest_solutions = []
    shortest_length = None

    while queue:
        current_state, path = queue.popleft()

        if current_state.is_goal():
            if shortest_length is None:
                shortest_length = len(path)
                shortest_solutions.append(path)
            elif len(path) == shortest_length:
                shortest_solutions.append(path)
            continue

        if shortest_length is not None and len(path) >= shortest_length:
            continue


        for next_state, direction in get_next_states(current_state):
            if next_state not in visited:
                visited.add(next_state)
                queue.append((next_state, path + direction))

    if shortest_solutions:
        print("Solutions found:", len(shortest_solutions))
        for i, solution in enumerate(shortest_solutions):
            print(f"Solution {i + 1}: {solution}")
        return shortest_solutions
    else:
        print("No solution found.")
        return []

for i in range(5):
    url = URLS['prog']['sokoban']['problem']
    if i > 0:
        url += '?n' + str(i+2)
    text = get(url)
    print(text)
    filename = 'results/'+datetime.now().isoformat().replace(':', '')+'/file'+str(i)+'.html'
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "wb") as local_file:
        local_file.write(text.encode('utf-8'))
        print(filename+' ok')
    result = re.search('lignes : (\d+).+colonnes : (\d+).+S : (\d+,\d+).+B : (\d+,\d+).+H : (\d+,\d+).+', text)
    print(result.groups())
    ROWS = int(result.groups()[0])
    COLS = int(result.groups()[1])
    TILE_PATH = '1'
    START = result.groups()[2].split(',')
    BLOCK = result.groups()[3].split(',')
    HOLE = result.groups()[4].split(',')

    grid = [[TILE_PATH for x in range(COLS-1)] for y in range(ROWS-1)]

    # grid[int(START[1])][int(START[0])] = 'S'
    # grid[int(BLOCK[1])][int(BLOCK[0])] = 'B'
    # grid[int(HOLE[1])][int(HOLE[0])] = 'H'

    print(grid)

    player_pos = (int(START[1]), int(START[0]))
    box_positions = [(int(BLOCK[1]), int(BLOCK[0]))]
    target_positions = [(int(HOLE[1]), int(HOLE[0]))]

    initial_state = SokobanState(player_pos, box_positions, target_positions, grid)
    solutions = solve_sokoban_with_networkx(initial_state)
    solutions = sorted(solutions)
    print(solutions)

    if len(solutions) > 0:
        text = get(URLS['prog']['sokoban']['solution'] + solutions[0])
        print(text)
        if 'Allez hop ! Encore un tour !' not in text:
            exit()
    else:
        exit()
