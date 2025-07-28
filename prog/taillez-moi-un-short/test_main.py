#! /usr/bin/env python3
import unittest
from main import Controller

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

class TestMazeController(unittest.TestCase):
    def setUp(self):
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
        self.controller = Controller(maze)

    def test_controller_run(self):
        self.assertEqual('01bde0a4071b49fd652ad1352075e875b9be7912', self.controller.run())

if __name__ == '__main__':
    unittest.main()
