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
        this.remainingShips = [5, 4, 3, 3, 2];
        this.lastHit = [];
        this.potentialMoves = [];

        // If string of ships is hit, then we are on a thread, and the second element is the direction
        this.onThread = {
            hit: false,
            direction: null,
            origin: null,
        }

        // Generate potential moves
        for (let row = 0; row < board_size; row++) {
            for (let col = 0; col < board_size; col++) {
                this.potentialMoves.push([row, col]);
            }
        }
    }

    getNextMove = (board) => {
        let newBoard = board.map(arr => arr.slice());
        let newRow, newCol;
        
        if (!this.onThread.hit) {
            return this.getRandomMove(newBoard);
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
                this.onThread.hit = false;
                this.onThread.direction = null;
                return this.getRandomMove(newBoard);
            }
        }
        //remove the move from potential moves
        this.potentialMoves = this.potentialMoves.filter(move => !(move[0] === newRow && move[1] === newCol));

        if (newBoard[newRow][newCol] !== null && isAlphabetical(newBoard[newRow][newCol])) {
            newBoard[newRow][newCol] = 2;
            this.lastHit = [newRow, newCol];
            this.onThread.hit = true;
        } else {
            newBoard[newRow][newCol] = 1;

            if (isEqual(this.onThread.origin, this.lastHit)) {
        
                for (let [dx, dy] of directions) {
                    let [ox, oy] = this.onThread.origin;
                    let r = ox + dx;
                    let c = oy + dy;
                    if (this.checkValidMove(r, c)) {
                        this.onThread.direction = [dx, dy];
                        this.onThread.hit = true;
                        return newBoard;
                    }
                }
            }

            this.onThread.hit = false;
            this.onThread.direction = null;
        }

        return newBoard;       
    }

    getRandomMove = (board) => {
        let newBoard = board.map(arr => arr.slice());
        const randomIndex = Math.floor(Math.random() * this.potentialMoves.length);
        const [row, col] = this.potentialMoves[randomIndex];
        // Remove the move from potential moves
        this.potentialMoves.splice(randomIndex, 1);


        if (newBoard[row][col] !== null && isAlphabetical(newBoard[row][col])) {
            newBoard[row][col] = 2;
            this.lastHit = [row, col];
            this.onThread.hit = true;
            this.onThread.origin = [row, col];
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
}

export default AIManager;
