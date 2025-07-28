#! /usr/bin/env python3
import unittest
from PIL import Image
from main import Controller, Model, View

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

class Test(unittest.TestCase):
    def test_view_convert(self):
        image = Image.open("test_maze.png")
        view = View()
        self.assertEqual(maze, view.convert(image))

    def test_model_paths(self):
        model = Model(maze)
        model.find_all_shortest_paths_with_directions()
        self.assertEqual('01bde0a4071b49fd652ad1352075e875b9be7912', model.output())

if __name__ == '__main__':
    unittest.main()
