//helper function for generateEdges to catch and reject
//impossible coordinates
function isLegal(position, boardSize) {
  if (position >= 0 && position < boardSize) {
    return true;
  } else {
    return false;
  }
}

//helper function to convert a unique vertex value
//  to a coordinate on a chess board
function vertexToCoordinate(vertex, gridSize) {
  const x = vertex % gridSize;
  const y = Math.floor(vertex / gridSize);
  return [x, y];
}

//Input a coordinate and size of chessboard (ie. 8 if 8x8)
// first produces an array of coordinates which represent
// legal moves a knight can make from the initial position
// converts these coordinates to unique vertex numbers to
// pass to buildgraph function
function generateEdges(coord, boardSize) {
  let newMoves = [];
  let [x, y] = coord;

  let offsets = [
    [-2, -1],
    [-1, -2],
    [-1, 2],
    [-2, 1],
    [1, -2],
    [2, -1],
    [1, 2],
    [2, 1],
  ];

  for (offset of offsets) {
    newX = x + offset[0];
    newY = y + offset[1];
    if (isLegal(newX, boardSize) && isLegal(newY, boardSize)) {
      newMoves.push([newX, newY]);
    }
  }

  // error either in the mapping func
  return newMoves.map(
    (coordinate) => coordinate[1] * boardSize + coordinate[0]
  );
}

// first creates empty graph of size n
// adds n*n vertices to form a 'grid'
// for each vertex, generates edges which correspond to ..
// legal moves a knight can make
function buildGraph(size) {
  let noVertices = size ** 2;
  let myGraph = new Graph(noVertices);
  for (i = 0; i < noVertices; i++) {
    myGraph.addVertex(i);
  }
  for (j = 0; j < noVertices; j++) {
    let coord = vertexToCoordinate(j, size);

    // feed addEdge coords.
    for (vertex of generateEdges(coord, size)) {
      myGraph.addEdge(j, vertex);
    }
  }
  return myGraph;
}

class Graph {
  constructor(numberOfVertices) {
    this.numberOfVertices = numberOfVertices;
    this.adjacentList = new Map();
  }
  addVertex(vertex) {
    this.adjacentList.set(vertex, []);
  }
  addEdge(source, destination) {
    // get list for vertex
    this.adjacentList.get(source).push(destination);
    //this.adjacentList.get(destination).push(source)
  }
  printGraph() {
    for (const [vertex, edges] of this.adjacentList) {
      const vertexStr = `Vertex ${vertex}:`;
      const edgesStr = edges.length > 0 ? ` ${edges.join(", ")}` : "";
      console.log(vertexStr + edgesStr);
    }
  }
  numberPossibleMoves() {
    let total = 0;
    for (const edges of this.adjacentList.values()) {
      total += edges.length;
    }
    return total;
  }

  travail(start, end) {
    let path = [];
    let queue = [];
    let visited = new Set();
    let parent = {}; // Store the parent of each visited node
    let distance = 0;

    queue.push(start);

    while (queue.length > 0) {
      let visitedNode = queue.shift();

      if (visitedNode === end) {
        // Reached the destination, construct the path
        let node = end;
        while (node !== start) {
          path.unshift(node);
          node = parent[node];
        }
        path.unshift(start);
        return path;
      }

      if (!visited.has(visitedNode)) {
        visited.add(visitedNode);
      }

      let neighbors = this.adjacentList.get(visitedNode);
      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
          parent[neighbor] = visitedNode; // Set the parent of the neighbor
        }
      }
    }

    return "no path found"; // If no path found, return an empty path
  }
}

// DOM:

//initialise global variables
let boardDiv = document.querySelector(".board");
let resetButton = document.querySelector(".reset");
let stepCount = document.querySelector(".stepCount");
let placingKnight = true;
let knightPosition = null;
let targetPosition = null;

//set up the board.
const setup = () => {
  boardDiv.classList.add("active");
  generateSquares();
};

const placeKnight = (parent) => {
  const knight = document.createElement("div");
  knight.classList.add("knight");
  parent.appendChild(knight);
  return parent.getAttribute("data-id");
};

const placeTarget = (parent) => {
  const target = document.createElement("div");
  target.classList.add("target");
  parent.appendChild(target);
  return parent.getAttribute("data-id");
};

//Allows user to place either a knight, or a target via the same listener.
const tryPlace = (e) => {
  if (placingKnight === "done") {
    return;
  }

  if (placingKnight) {
    knightPosition = e.target.getAttribute("data-id");
    placeKnight(e.target);
    placingKnight = false;
    return;
  }
  if (!placingKnight) {
    targetPosition = e.target.getAttribute("data-id");
    if (targetPosition == knightPosition) return;
    placeTarget(e.target);
    placingKnight = "done";
    startTravail(knightPosition, targetPosition);
    boardDiv.classList.remove("active");
    return;
    }
  }

// fill the 'board' div with 'squares'.
const generateSquares = () => {
  while (boardDiv.firstChild) {
    boardDiv.removeChild(boardDiv.firstChild);
  }
  for (let i = 0; i < 64; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.setAttribute("data-id", i);
    square.addEventListener("click", tryPlace);
    boardDiv.appendChild(square);
  }
};

//called after target square is selected. 
const startTravail = (start, end) => {
  let myGraph = buildGraph(8);
  let path = myGraph.travail(Number(start), Number(end));
  paintPath(path);
};

//passed the path the knight takes generated by 'travail' method and visually represents it to the user.
const paintPath = (path) => {
  path.forEach((item, index) => {
    let step = document.querySelector(`[data-id="${item}"]`);
    step.classList.add("step");
    const stepMarker = document.createElement("p");
    stepMarker.textContent = index;
    stepMarker.classList.add("stepMarker");
    step.appendChild(stepMarker);
    stepCount.textContent = `${
      path.length === 2
        ? `${path.length - 1} Move!`
        : `${path.length - 1} Moves!`
    }`;
  });
};

const reset = () => {
  stepCount.textContent = "";
  placingKnight = true;
  knightPosition = null;
  targetPosition = null;
  setup();
};

resetButton.addEventListener("click", () => reset());

setup();
