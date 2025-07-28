#! /usr/bin/env python3
# coding: utf-8
import sys
from datetime import datetime
import hashlib
from collections import deque
from PIL import Image

sys.path.insert(0, '../..')
from config import *
from functions import *

class Model:
    def __init__(self, maze):
        self.maze = maze
        self.start = None
        self.shortest_paths_with_directions = []
        self.shortest_paths = []
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

        self.shortest_paths_with_directions = shortest_paths_with_directions

        for i, (path, directions) in enumerate(shortest_paths_with_directions):
            self.shortest_paths.append(''.join(directions))

    def output(self):
        print("Paths:", self.shortest_paths)
        print("Paths>Sorted:", sorted(self.shortest_paths))
        print("Paths>Sorted>Joined:", ''.join(sorted(self.shortest_paths)))
        print("Paths>Sorted>Joined>sha1:", hashlib.sha1(''.join(sorted(self.shortest_paths)).encode()).hexdigest())
        return hashlib.sha1(''.join(sorted(self.shortest_paths)).encode()).hexdigest()

class View:
    def convert(self, image):
        X_TILE = 5 # a tile is (5,5) wide
        Y_TILE = 5
        TILE_WALL = (0, 0, 0) # RGB values for tiles
        TILE_PATH = (255, 255, 255)
        TILE_START = (0, 0, 255)
        TILE_END = (255, 0, 0)
        print('image(x,y)', image.size)
        xMax = int(image.size[0] / X_TILE) # define horizontal number of tiles
        yMax = int(image.size[1] / Y_TILE) # define vertical number of tiles
        maximum = max(xMax, yMax)
        print('tiles(x,y)', (xMax,yMax))
        matrix = ['' for y in range(maximum-1)] # create matrix of ''
        pixels = image.load() # get the pixel map
        # for each tile(x,y)
        for y in range(yMax):
            for x in range(xMax):
                # rgb = image.getpixel((x*X_TILE,y*Y_TILE))
                rgb = pixels[x*X_TILE, y*Y_TILE]
                if rgb == TILE_WALL:
                    char = '0'
                elif rgb == TILE_PATH:
                    char = '1'
                elif rgb == TILE_START:
                    char = 'S'
                elif rgb == TILE_END:
                    char = 'F'
                # if not wall, assign weight=1
                matrix[y] += char
        print("Converted maze:", matrix)
        return matrix

class Controller:
    def __init__(self, image):
        self.image = image
        self.paths = []

    def run(self):
        self.view = View()
        maze = self.view.convert(self.image)
        self.model = Model(maze)
        self.model.find_all_shortest_paths_with_directions()
        return self.model.output()


# image = Image.open("test_maze.png")
print(get(URLS['prog']['short']['problem'], True)) # https://

bin_data = get(config.URLS['prog']['short']['problem'], True).content
filename = 'results/'+datetime.now().isoformat().replace(':', '')+'file.png'
with open(filename, "wb") as local_file:
    local_file.write(bin_data)
    print(filename+' ok')
image = Image.open(filename)

controller = Controller(image)
sha1 = controller.run()

print(get(URLS['prog']['short']['solution']+sha1)) # https://
