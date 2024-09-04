
const gridSize = 10;
const mineCount = 10;
let gameGrid = [];
let minePositions = [];

function createGame() {
    const gameElement = document.getElementById('game');
    gameElement.innerHTML = '';
    gameGrid = [];
    minePositions = [];
    
    // Create grid and add cells to DOM
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-id', i);
        cell.addEventListener('click', handleClick);
        cell.addEventListener('contextmenu', handleRightClick);
        gameElement.appendChild(cell);
        gameGrid.push(cell);
    }
    
    // Place mines
    while (minePositions.length < mineCount) {
        const pos = Math.floor(Math.random() * gridSize * gridSize);
        if (!minePositions.includes(pos)) {
            minePositions.push(pos);
        }
    }
}

function handleClick(event) {
    const id = parseInt(event.target.getAttribute('data-id'));
    if (minePositions.includes(id)) {
        revealMines();
        alert('Hai perso!');
    } else {
        revealCell(id);
    }
}

function handleRightClick(event) {
    event.preventDefault();
    const id = parseInt(event.target.getAttribute('data-id'));
    const cell = gameGrid[id];
    if (cell.classList.contains('flagged')) {
        cell.classList.remove('flagged');
    } else {
        cell.classList.add('flagged');
    }
}

function revealMines() {
    minePositions.forEach(pos => {
        const cell = gameGrid[pos];
        cell.classList.add('mine');
    });
}

function revealCell(id) {
    const cell = gameGrid[id];
    if (cell.classList.contains('revealed')) return;
    cell.classList.add('revealed');
    
    const adjacentMines = countAdjacentMines(id);
    if (adjacentMines > 0) {
        cell.textContent = adjacentMines;
    } else {
        // Reveal neighboring cells if no adjacent mines
        const neighbors = getNeighbors(id);
        neighbors.forEach(neighborId => revealCell(neighborId));
    }
}

function countAdjacentMines(id) {
    let mineCount = 0;
    const neighbors = getNeighbors(id);
    neighbors.forEach(neighborId => {
        if (minePositions.includes(neighborId)) {
            mineCount++;
        }
    });
    return mineCount;
}

function getNeighbors(id) {
    const neighbors = [];
    const x = id % gridSize;
    const y = Math.floor(id / gridSize);

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
                neighbors.push(ny * gridSize + nx);
            }
        }
    }
    return neighbors;
}

// Initialize the game on page load
createGame();
