#! /usr/bin/env python3
from collections import deque
import hashlib

class Model:
    def __init__(self, maze):
        self.maze = maze
        self.start = None
        self.shortest_paths = None
        self.end = None
        self._initialize_maze()
    
    def _initialize_maze(self):
        for i in range(len(self.maze)):
            for j in range(len(self.maze[i])):
                if self.maze[i][j] == 'S':
                    self.start = (i, j)
                elif self.maze[i][j] == 'F':
                    self.end = (i, j)

    def find_all_shortest_paths_with_directions(self):
        if not self.start or not self.end:
            return "Start or end position not found."

        directions = [(-1, 0, 'U'), (1, 0, 'D'), (0, -1, 'L'), (0, 1, 'R')]
        queue = deque([(self.start, [])])
        visited = {self.start: 0}
        shortest_paths_with_directions = []

        while queue:
            current_pos, path_directions = queue.popleft()

            if current_pos == self.end:
                if not shortest_paths_with_directions or len(path_directions) == len(shortest_paths_with_directions[0][1]):
                    shortest_paths_with_directions.append((None, path_directions))
                continue

            for dx, dy, direction in directions:
                next_pos = (current_pos[0] + dx, current_pos[1] + dy)

                if (0 <= next_pos[0] < len(self.maze) and
                    0 <= next_pos[1] < len(self.maze[0]) and
                    self.maze[next_pos[0]][next_pos[1]] in {'1', 'F'}):

                    if next_pos not in visited or visited[next_pos] == len(path_directions):
                        visited[next_pos] = len(path_directions)
                        queue.append((next_pos, path_directions + [direction]))

        self.shortest_paths = shortest_paths_with_directions

class View:
    def display_paths(self, paths):
        for i, (path, directions) in enumerate(paths):
            print(f"Path {i + 1}:")
            print(f"Directions: {''.join(directions)}\n")

class Controller:
    def __init__(self, maze):
        self.model = Model(maze)
        self.view = View()
        self.paths = []

    def run(self):
        self.model.find_all_shortest_paths_with_directions()
        self.view.display_paths(self.model.shortest_paths)
        paths = []
        for i, (path, directions) in enumerate(self.model.shortest_paths):
            paths.append(''.join(directions))

        print("Paths:", paths)
        print("Paths>Sorted:", sorted(paths))
        print("Paths>Sorted>Joined:", ''.join(sorted(paths)))

        print("Paths>Sorted>Joined>sha1:", hashlib.sha1(''.join(sorted(paths)).encode()).hexdigest())
        return hashlib.sha1(''.join(sorted(paths)).encode()).hexdigest()

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


controller = Controller(maze)
controller.run()


