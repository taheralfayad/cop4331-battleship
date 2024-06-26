const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

const isAlphabetical = (str) => {
    return /^[A-Za-z]+$/.test(str);
}

function isEqual(a, b) {
    return a.join() == b.join();
}

class AIManager {

    constructor(board_size) {
        this.size = board_size;
        this.difficulty = 1;  // 0: easy, 1: medium, 2: hard
        this.remainingShips = [5, 4, 3, 3, 2];
        this.lastHit = [];
        this.potentialMoves = [];

        // If string of ships is hit, then we are on a thread, and the second element is the direction
        this.onThread = {
            hit: false,
            direction: null,
            origin: null,
            length: 0,
        }

        // Generate potential moves
        for (let row = 0; row < board_size; row++) {
            for (let col = 0; col < board_size; col++) {
                this.potentialMoves.push([row, col]);
            }
        }
    }

    getNextMove = (board, wasLastMoveHit) => {
        let newBoard = board.map(arr => arr.slice());
        let newRow, newCol;
        
        // Not on a thread: get a random move OR easy mode
        if (!this.onThread.hit || this.difficulty == 0) {
            return this.getRandomMove(newBoard, wasLastMoveHit);
        }

        let [last_row, last_col] = this.lastHit;

        // We dont know the direction of the thread: try all directions until we find a hit
        if (this.onThread.direction === null) {
            let validDirectionFound = false;
            for (let [dx, dy] of directions) {
                newRow = last_row + dx;
                newCol = last_col + dy;
                if (this.checkValidMove(newRow, newCol)) {
                    this.onThread.direction = [dx, dy];
                    validDirectionFound = true;
                    break;
                }
            }
            
            // Return to random move if we couldnt find a direction
            if (!validDirectionFound) {
                this.onThread.hit = false;
                this.onThread.direction = null;
                    return this.getRandomMove(newBoard);
            }
        }
        // Continue the thread direction
        else {
            let [dx, dy] = this.onThread.direction;
            newRow = last_row + dx;
            newCol = last_col + dy;

            // If the next move is invalid, then we have reached the end of the thread
            if (!this.checkValidMove(newRow, newCol)) {
                // HARD DIFFICULTY FEATURE: flip directions
                if (this.onThread.length < Math.max(...this.remainingShips) && this.difficulty == 2) {
                    let flippedBoard = this.flipDirection(newBoard);
                    if (flippedBoard) {
                        return flippedBoard;
                    }
                }

                this.onThread.hit = false;
                this.onThread.direction = null;
                return this.getRandomMove(newBoard);
            }
        }
        //remove the move from potential moves
        this.potentialMoves = this.potentialMoves.filter(move => !(move[0] === newRow && move[1] === newCol));

        // Hit/Miss logic for thread move
        if (newBoard[newRow][newCol] !== null && isAlphabetical(newBoard[newRow][newCol])) {
            newBoard[newRow][newCol] = 2;
            this.lastHit = [newRow, newCol];
            this.onThread.hit = true;
            if(wasLastMoveHit) {
                wasLastMoveHit.hit = true;
                wasLastMoveHit.row = newRow;
                wasLastMoveHit.col = newCol;
            }
            this.onThread.length++;
        } else {
            newBoard[newRow][newCol] = 1;

            // If the thread is only 1 cell long, try all directions before moving on
            if (this.onThread.length == 1) {
                for (let [dx, dy] of directions) {
                    let [ox, oy] = this.onThread.origin;
                    let r = ox + dx;
                    let c = oy + dy;
                    if (this.checkValidMove(r, c)) {
                        this.onThread.direction = [dx, dy];
                        this.onThread.hit = true;
                        return newBoard
                    }
                }
            }
            
            // HARD DIFFICULTY FEATURE: If the thread is longer than 1 cell, check if we can flip direction
            if (this.onThread.length < Math.max(...this.remainingShips) && this.difficulty == 2) {
                let flippedBoard = this.flipDirection(newBoard);
                if (flippedBoard) {
                    return flippedBoard;
                }
            }

            this.onThread.hit = false;
            this.onThread.direction = null;
            this.onThread.length = 0;
        }

        return newBoard;       
    }

    getRandomMove = (board, wasLastMoveHit) => {
        let newBoard = board.map(arr => arr.slice());
        const randomIndex = Math.floor(Math.random() * this.potentialMoves.length);
        const [row, col] = this.potentialMoves[randomIndex];
        // Remove the move from potential moves
        this.potentialMoves.splice(randomIndex, 1);


        if (newBoard[row][col] !== null && isAlphabetical(newBoard[row][col])) {
            newBoard[row][col] = 2;
            this.lastHit = [row, col];
            this.onThread.hit = true;
            if(wasLastMoveHit) {
                wasLastMoveHit.hit = true;
                wasLastMoveHit.row = row;
                wasLastMoveHit.col = col;
            }
            this.onThread.origin = [row, col];
            this.onThread.length = 1;
            return newBoard;
        }

        newBoard[row][col] = 1;
        
        return newBoard;
    }

    checkValidMove = (row, col) => {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
            return false;
        }

        if (!this.potentialMoves.some(move => move[0] === row && move[1] === col)) {
            return false;
        }

        return true;
    }

    checkSurrondings = (row, col) => {
        for (let [dx, dy] of directions) {
            let newRow = row + dx;
            let newCol = col + dy;
            if (this.checkValidMove(newRow, newCol)) {
                return true;
            }
        }

        return false;
    }

    flipDirection = (board) => {
        let [dx, dy] = [-this.onThread.direction[0], -this.onThread.direction[1]];
        let [ox, oy] = this.onThread.origin;
        // Ensure the cell opposite direction from origin is valid
        let r = ox + dx;
        let c = oy + dy;
        if (this.checkValidMove(r, c)) {
            this.onThread.direction = [dx, dy];
            this.onThread.hit = true;
            this.lastHit = [ox, oy];
            return board;
        }

        // THREAD IS FINISHED SHIP IS SUNK
        else {
            this.remainingShips = this.remainingShips.filter(ship => ship != this.onThread.length);
        }

        return null;
    }
}

export default AIManager;
