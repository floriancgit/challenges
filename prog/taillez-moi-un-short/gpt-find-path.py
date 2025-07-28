#! /usr/bin/env python3
from collections import deque

def find_shortest_path(maze):
    # Trouver les positions de départ et d'arrivée
    start, end = None, None
    for i in range(len(maze)):
        for j in range(len(maze[i])):
            if maze[i][j] == 'S':
                start = (i, j)
            elif maze[i][j] == 'F':
                end = (i, j)

    if not start or not end:
        return "Start or end position not found."

    # Directions possibles : haut, bas, gauche, droite
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    # File pour le BFS
    queue = deque([(start, 0)])

    # Ensemble pour garder une trace des positions visitées
    visited = set([start])

    while queue:
        (current_pos, current_dist) = queue.popleft()
        print(f"Current position: {current_pos}, Distance: {current_dist}")

        # Si on atteint la fin, retourner la distance
        if current_pos == end:
            return current_dist

        # Explorer les voisins
        for direction in directions:
            next_pos = (current_pos[0] + direction[0], current_pos[1] + direction[1])

            # Vérifier si le voisin est dans les limites du labyrinthe, est un passage, et n'a pas été visité
            if (0 <= next_pos[0] < len(maze) and
                0 <= next_pos[1] < len(maze[0]) and
                maze[next_pos[0]][next_pos[1]] in {'1', 'F'} and
                next_pos not in visited):
                print(f"  Moving to next position: {next_pos}")
                visited.add(next_pos)
                queue.append((next_pos, current_dist + 1))

    return "No path found."

# Exemple d'utilisation
maze = [
    "00000000000",
    "0111101101F",
    "01001110110",
    "01111001100",
    "00101111000",
    "00110101110",
    "S1011111000",
    "01010101110",
    "01111111000",
    "00000000000"
]

shortest_path_length = find_shortest_path(maze)
print("Shortest path length:", shortest_path_length)
