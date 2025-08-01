var config = require('../../config');
var functions = require('../../functions');

let boardSize = 8;
let atomCount = 4;
let shoots = {};
let shootsSize = 0;
let atoms = [];
let guesses = [];
let gameStarted = false;
let deflectedShootCount = 0;
const deflectedShootAlphabet = '123456789abcdefgh'
let showpath = true;
const rowsLabels = ' 12345678 ';
const colsLabels = ' ABCDEFGH  ';
const BORDER_EMPTY = 'o';
const BORDER_HIT = 'H';
const BORDER_REFLEXION = 'R';
const BORDER_CORNER = '+';
const CELL_EMPTY = ' ';
const CELL_ATOM = 'A';
const directions ={
    'up': '-1,0',
    'down': '1,0',
    'left': '0,-1',
    'right': '0,1',
};

const board = Array(boardSize + 2).fill().map(() => Array(boardSize + 2).fill(CELL_EMPTY));

function printBoard() {
    // Print column labels
    console.log('     ' + Array.from({ length: boardSize }, (_, i) => String.fromCharCode(65 + i)).join(' '));

    // Print board with row labels
    board.forEach((row, i) => {
        if (i === 0 || i === boardSize + 1) {
            console.log('   '+row.join(' '));
        } else {
            console.log(`${i < 10 ? ' ' + i : i} ${row.join(' ')}`);
        }
    });
}

function createBoard() {
	
	for (let i = 0; i <= boardSize + 1; i++) {
		row = board[i];
		for (let j = 0; j <= boardSize + 1; j++) {
			cell = ' ';
			
			if (i === 0 || i === boardSize + 1 || j === 0 || j === boardSize + 1) {
				// corners
				if ((i === 0 || i === boardSize + 1) && (j === 0 || j === boardSize + 1)) {
					board[i][j] = BORDER_CORNER;
                    
				}
				else {
					board[i][j] = BORDER_EMPTY;
				}
			} else {
				// cell.onclick = () => toggleGuess(i, j);
			}
		}
	}
}

function getCell(row, col) {
	return board[row][col];
}
function setCell(row, col, c) {
	return board[row][col] = c;
}

function startGame() {
	resetGame();
}

function resetGame() {
	atoms = [];
	guesses = [];
	gameStarted = true;
	deflectedShootCount = 0;
	createBoard();
	
	// while (atoms.length < atomCount) {
	// 	const row = 1 + Math.floor(Math.random() * boardSize);
	// 	const col = 1 + Math.floor(Math.random() * boardSize);
	// 	const pos = `${row},${col}`;
	// 	if (!atoms.includes(pos)) {
	// 		atoms.push(pos);
    //         setCell(row, col, CELL_ATOM);
	// 	}
	// }
    atoms.push('3,2');
    atoms.push('3,7');
    atoms.push('6,4');
    atoms.push('8,7');
    setCell(3, 2, CELL_ATOM);
    setCell(3, 7, CELL_ATOM);
    setCell(6, 4, CELL_ATOM);
    setCell(8, 7, CELL_ATOM);
}

function toggleGuess(row, col) {
	if (!gameStarted) return;
	
	const cell = getCell(row, col);
	const pos = `${row},${col}`;
	const guessIndex = guesses.indexOf(pos);
	
	if (guessIndex === -1) {
		guesses.push(pos);
		cell.classList.add('guess');
	} else {
		guesses.splice(guessIndex, 1);
		cell.classList.remove('guess');
	}
}

function hasAtom(row, col) {
	return atoms.includes(`${row},${col}`);
}

function shootRay(row, col) {
    console.log(`🩻 Shooting ray from (${row}, ${col})`);
	if (!gameStarted) return;
	
	// clearPath();
	let currentRow = row;
	let currentCol = col;
	let direction;
	
	// Determine initial direction
	if (row === 0) direction = 'down';
	else if (row === boardSize + 1) direction = 'up';
	else if (col === 0) direction = 'right';
	else direction = 'left';
	
	const path = [];
	let hit = false;
	let reflexion = false;
	
	while (true) {
		let nextRow = currentRow;
		let nextCol = currentCol;

		// Check if the next cell in row has an atom (meaning direct H)
		if      (direction === 'right' && hasAtom(nextRow, nextCol+1)) { hit = true; }
		else if (direction === 'left'  && hasAtom(nextRow, nextCol-1)) { hit = true; }
		else if (direction === 'down'  && hasAtom(nextRow+1, nextCol)) { hit = true; }
		else if (direction === 'up'    && hasAtom(nextRow-1, nextCol)) { hit = true; }

		// Check REFLEXION directly on entry
		if      ( (nextRow === boardSize + 1) && (hasAtom(nextRow-1, nextCol-1) || hasAtom(nextRow-1, nextCol+1)) ) { reflexion = true } // up
		else if ( (nextRow === 0)             && (hasAtom(nextRow+1, nextCol-1) || hasAtom(nextRow+1, nextCol+1)) ) { reflexion = true } // down
		else if ( (nextCol === 0)             && (hasAtom(nextRow-1, nextCol+1) || hasAtom(nextRow+1, nextCol+1)) ) { reflexion = true } // right
		else if ( (nextCol === boardSize + 1) && (hasAtom(nextRow-1, nextCol-1) || hasAtom(nextRow+1, nextCol-1)) ) { reflexion = true } // left

		if (reflexion && !hit) {
			setCell(row, col, BORDER_REFLEXION);
			break;
		}

		if (hit) {
			setCell(row, col, BORDER_HIT);
			break;
		}

		// Check diagonal atoms and deflect accordingly
		if (direction === 'right') {
			if      ( hasAtom(nextRow-1, nextCol+1) && !hasAtom(nextRow+1, nextCol+1)) { direction = 'down'; }
			else if (!hasAtom(nextRow-1, nextCol+1) &&  hasAtom(nextRow+1, nextCol+1)) { direction = 'up'; }
			else if ( hasAtom(nextRow-1, nextCol+1) &&  hasAtom(nextRow+1, nextCol+1)) { direction = 'left' }
		} else if (direction === 'left') {
			if      ( hasAtom(nextRow-1, nextCol-1) && !hasAtom(nextRow+1, nextCol-1)) { direction = 'down'; }
			else if (!hasAtom(nextRow-1, nextCol-1) &&  hasAtom(nextRow+1, nextCol-1)) { direction = 'up'; }
			else if ( hasAtom(nextRow-1, nextCol-1) &&  hasAtom(nextRow+1, nextCol-1)) { direction = 'right'; }
		} else if (direction === 'down') {
			if      ( hasAtom(nextRow+1, nextCol-1) && !hasAtom(nextRow+1, nextCol+1)) { direction = 'right'; }
			else if (!hasAtom(nextRow+1, nextCol-1) &&  hasAtom(nextRow+1, nextCol+1)) { direction = 'left'; }
			else if ( hasAtom(nextRow+1, nextCol-1) &&  hasAtom(nextRow+1, nextCol+1)) { direction = 'up'; }
		} else if (direction === 'up') {
			if      ( hasAtom(nextRow-1, nextCol-1) && !hasAtom(nextRow-1, nextCol+1)) { direction = 'right'; }
			else if (!hasAtom(nextRow-1, nextCol-1) &&  hasAtom(nextRow-1, nextCol+1)) { direction = 'left'; }
			else if ( hasAtom(nextRow-1, nextCol-1) &&  hasAtom(nextRow-1, nextCol+1)) { direction = 'down'; }
		}

		// Calculate next position based on direction
		switch (direction) {
			case 'up': nextRow--; break;
			case 'down': nextRow++; break;
			case 'left': nextCol--; break;
			case 'right': nextCol++; break;
		}

		// Check if we reached a border
		if (nextRow < 1 || nextRow > boardSize || nextCol < 1 || nextCol > boardSize) {
			const cell = getCell(row, col);
			// if border reached on same cell as entry cell, we get a reflexion.
			if (nextRow == row && nextCol == col) {
				setCell(row, col, BORDER_REFLEXION);
			}
			// else, ray has traveled accross the board and exited not in the entry cell
			else {
				let shootIndex = null;
				// if borderCell contains a numeral from a precedent shoot
				if (Number.isInteger(parseInt(cell))) {
					shootIndex = parseInt(cell);
				} else {
					deflectedShootCount++
					shootIndex = deflectedShootCount;
				}
				// mark entry
				setCell(row, col, shootIndex);
				// mark exit
				setCell(Math.max(0, Math.min(nextRow, boardSize+1)), Math.max(0, Math.min(nextCol, boardSize+1)), shootIndex);
			}
			break;
		}
		// Add current position to path
		path.push([nextRow, nextCol]);
		currentRow = nextRow;
		currentCol = nextCol;
	}
	
	// Mark the path
	if (showpath) {
		for (const [pathRow, pathCol] of path) {
			if (pathRow >= 1 && pathRow <= boardSize && pathCol >= 1 && pathCol <= boardSize) {
				setCell(pathRow, pathCol, hit ? '+' : '*');
			}
		}
	}
    printBoard();
}

function clearPath() {
	for (let i = 1; i <= boardSize; i++) {
		for (let j = 1; j <= boardSize; j++) {
			const cell = getCell(i, j);
			setCell(i, j, ' ');
		}
	}
}

function solveGame() {
	if (!gameStarted) return;
	
	for (let i = 1; i <= boardSize; i++) {
		for (let j = 1; j <= boardSize; j++) {
			const cell = getCell(i, j);
			if (atoms.includes(`${i},${j}`)) {
				cell.classList.add('atom');
			}
		}
	}
}

function getHorizontalShoot(shoots){
    return shoots.find(shoot => shoot.border === 'left' || shoot.border === 'right');
}
function getVerticalShoot(shoots){
    return shoots.find(shoot => shoot.border === 'up' || shoot.border === 'down');
}

function getOppositeDirection(direction) {
    switch (direction) {
        case 'up': return 'down';
        case 'down': return 'up';
        case 'left': return 'right';
        case 'right': return 'left';
    }
}

function verifyGuesses() {
	if (!gameStarted) return;
	
	for (const guess of guesses) {
		const [row, col] = guess.split(',').map(Number);
		const cell = getCell(row, col);
		if (atoms.includes(guess)) {
			cell.classList.add('atom');
		} else {
			cell.classList.add('incorrect-guess');
		}
	}
}

createBoard();
functions.get(config.URLS.prog.blackbox.problem)
.then(response => response.text())
.then(text => {
    groups = text.split('&nbsp;');
    lines = groups[2].split('<br />');
    console.log('get | header', groups[1]);
    console.log('get | lines', lines);
    console.log('get | footer', groups[3]);

    // lines
    for(col=0; col<boardSize; col++){
        board[0][col+1] = groups[1][col];
        board[boardSize+1][col+1] = groups[3][col];
    }
    // cols
    for(row=0; row<boardSize; row++){
        board[row+1][0] = lines[row+1][0];
        board[row+1][boardSize+1] = lines[row+1][boardSize+1];
    }
    
    printBoard();

    // pour chaque lettre de l'alphabet, on tire un rayon
    for(iShoot=0; iShoot<deflectedShootAlphabet.length; iShoot++){
        let letter = deflectedShootAlphabet[iShoot];
        shoots[letter] = [];
        console.log(`🔫 Shooting ray for letter ${letter}`);
        found = false;
        // for (const [key, dir] of Object.entries(directions)) {
        //     console.log(key, dir);
        //     let dirRow = parseInt(dir.split(',')[0]);
        //     let dirCol = parseInt(dir.split(',')[1]);
        //     for(i=1; i<=boardSize; i++){
        //         if(getCell(dirRow*i, dirCol*i) === letter){
        //             console.log(`Found at LEFT: (${row}, 0)`);
        //             shoots[letter].push(`(${row}, 0)`);
        //             found = true;
        //             break;
        //         }
        //     }
        // };
        for(row=1; row<=boardSize; row++){
            if(getCell(row, 0) === letter){
                console.log(`Found at LEFT: (${row}, 0)`);
                shoots[letter].push({border: 'left', pos:`${row},0`});
                found = true;
                break;
            }
        }
        for(row=1; row<=boardSize; row++){
            if(getCell(row, boardSize+1) === letter){
                console.log(`Found at RIGHT: (${row}, ${boardSize+1})`);
                shoots[letter].push({border: 'right', pos:`${row},${boardSize+1}`});
                found = true;
                break;
            }
        }
        for(col=1; col<=boardSize; col++){
            if(getCell(0, col) === letter){
                console.log(`Found at UP: (0, ${col})`);
                shoots[letter].push({border: 'up', pos:`${0},${col}`});
                found = true;
                break;
            }
        }
        for(col=1; col<=boardSize; col++){
            if(getCell(boardSize+1, col) === letter){
                console.log(`Found at DOWN: (${boardSize+1}, ${col})`);
                shoots[letter].push({border: 'down', pos:`${boardSize+1},${col}`});
                found = true;
                break;
            }
        }
        if (!found) {
            shootsSize = iShoot;
            delete shoots[letter];
            console.log(`BREAK, unable to find ray. # shoots: ${shootsSize}. Positions:`, shoots);
            break;
        }
    }

    // pour chaque lettre trouvee, chercher les reflections
    for (const [letter, pair] of Object.entries(shoots)) {
        if(pair.length != 2) {
            console.log(`❌ Invalid shoots for ${letter}`);
            continue;
        }
        hShoot = getHorizontalShoot(pair);
        vShoot = getVerticalShoot(pair);
        if(!hShoot || !vShoot || hShoot.border == vShoot.border) {
            console.log(`❌ no horizontal or vertical shoot for ${letter}`);
            continue;
        }
        console.log(`✅ Found reflection for ${letter}:`, pair);
        console.log(`angle ${hShoot.pos[0]},${vShoot.pos[2]} `);
        row = parseInt(hShoot.pos[0]) + (vShoot.border == 'up'?1:-1);
        col = parseInt(vShoot.pos[2]) + (hShoot.border == 'left'?1:-1);
        console.log(`atom ${row},${col}`);
        setCell(row, col, CELL_ATOM);
        shootRay(pair[0].pos[0], pair[0].pos[2]);
        printBoard();
        atoms.push(`${row},${col}`);
    }

    result = '';
    for(let row=0; row<boardSize; row++){
        result += board[row+1].join('').substring(1, 1+boardSize).replaceAll(CELL_EMPTY, '0').replaceAll(CELL_ATOM, '1');
    }
    console.log('Result:', result);

    functions.get(config.URLS.prog.blackbox.solution+result)
        .then(response => response.text())
        .then(text => { console.log('Solution response:', text); })
});