# KnightsTravails

A variation on the classic "Knight's Tour" chess problem. Given any start and end point, the algorithm finds the shortest path.

## Implementation:

The shortest path is found by doing a breadth-first-search on a 'Knight's graph' - which represents all legal moves a knight can make on a chessboard.

Though setup here like an 8x8 chessboard, the Graph class can be arbitrarily extended to represent a board of any n x n size.

## Limitations / to-do:

- A module bundler like webpack could be utilised to help split up and organise the code: javascript is currently contained in a monolith file.
- Other kinds of operations can be performed on a knight's graph, like the Knight's tour.
- 

