"""
Maze Solving Problem:

Imagine you are part of an AI development team tasked with creating a system for a robot to solve mazes. 
The maze is represented by a matrix, where certain values indicate passable paths (0), walls (1), and the exit (9).

Your task is to implement a recursive function that finds the shortest path for the robot to exit the maze.
Consider the following points:

1. The matrix represents the maze, where the values are:
   0 : Passable path.
   1 : Wall, cannot be traversed.
   9 : Exit of the maze.

2. You must implement the function `solve_maze` that uses recursion to find the shortest path 
   from a starting position to the exit.

3. The function should return a list of coordinates that represent the path from the start position to the exit.

4. You can use a list of possible moves: 
   - Up: (-1, 0)
   - Down: (1, 0)
   - Left: (0, -1)
   - Right: (0, 1)

Example input and output:
Input:
- Maze (matrix)
- Starting row index
- Starting column index

Output:
Path to exit the maze: (1,1), (1,2), ..., (n,m)
"""
def main(maze, row_start, column_start):
    # Moves: Up, Down, Left, Right
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    def solve_maze(maze, row, col, path, visited):
        pass

    path = []
    visited = set()
    return solve_maze(maze, row_start, column_start, path, visited)


# Example maze
maze = [
    [0, 1, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 9, 0],
    [0, 0, 0, 0, 0]
]

# Starting at position (0, 0)
assert(main(maze, 0, 0)==[(0, 0), (1, 0), (2, 0), (2, 1), (2, 2), (3, 2), (3,3)])
# Starting at position (0, 4)
assert(main(maze, 0, 4)==[(0,4), (1, 4), (2, 4), (3, 4), (3, 3)])
# Starting at position (0, 3)
assert(main(maze, 0, 3)==[(0,3), (0,4), (1, 4), (2, 4), (3, 4), (3, 3)])