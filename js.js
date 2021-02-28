/**
 * @property {int} rowsCount
 * @property {int} colsCount
 * @property {int} speed
 * @property {int} winLength
 */

const settings = {
    rowsCount: 10,
    colsCount: 10,
    speed: 2,
    winFoodCount: 99,
};

/**
 * @property {settings} settings
 */

const config = {
    settings,
    /**
     * @param {Object} userSettings
     */
    init(userSettings) {
        Object.assign(this.settings, userSettings);
    },
    /**
     * @returns {int}
     */
    getRowsCount() {
        return this.settings.rowsCount;
    },
    /** 
     * @returns {int}
     */
    getColsCount() {
        return this.settings.colsCount;
    },

    /** 
     * @returns {int}
     */
    getSpeed() {
        return this.settings.speed;
    },

    /** 
     * @returns {int}
     */
    getWinFoodCount() {
        return this.settings.winFoodCount;
    },
    /**
     * @returns {{isValid: boolean, errors: Array}}
     */

    // validate() {
    //     /**
    //      * @property {boolean} isValid
    //      * @property {string[]} errors
    //      */
    //     const result = {
    //         isValid: true,
    //         errors: [],
    //     };

    //     if (this.settings.rowsCount < 7 || this.settings.rowsCount > 30) {
    //         result.isValid = false;
    //         result.errors.push('Неверные настройки, значение rowsCount должно быть в диапазоне от 7 до 30.');
    //     }

    //     if (this.settings.colsCount < 7 || this.settings.colsCount > 30) {
    //         result.isValid = false;
    //         result.errors.push('Неверные настройки, значение colsCount должно быть в диапазоне от 7 до 30.');
    //     }

    //     if (this.settings.speed < 1 || this.settings.speed > 10) {
    //         result.isValid = false;
    //         result.errors.push('Неверные настройки, значение speed должно быть в диапазоне от 1 до 10.');
    //     }

    //     if (this.settings.winFoodCount < 5 || this.settings.winFoodCount > 100) {
    //         result.isValid = false;
    //         result.errors.push('Неверные настройки, значение winLength должно быть в диапазоне от 5 до 100');
    //     }

    //     return result;
    // },
};

/**
 * @property {Object} cells
 * @property {Array} usedCells
 */

const map = {
    cells: null,
    usedCells: null,

    /**
     * @param {int} rowsCount
     * @param {int} colsCount
     */

    init(rowsCount, colsCount) {
        const table = document.getElementById('game');
        table.innerHTML = "";
        this.cells = {};
        this.usedCells = [];

        for (let row = 0; row < rowsCount; row++) {
            const tr = document.createElement('tr');
            tr.classList.add('row');
            table.appendChild(tr);

            for (let col = 0; col < colsCount; col++) {
                const td = document.createElement('td');
                td.classList.add('cell');
                this.cells[`x${col.toString()}_y${row.toString()}`] = td;
                tr.appendChild(td);
            }
        }
    },

    /**
     * @param {{x: int, y: int}[]} snakePointsArray 
     * @param {{x: int, y: int}} foodPoint 
     * @see {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach|Array.prototype.forEach()}
     */

    render(snakePointsArray, foodPoint) {
        for (const cell of this.usedCells) {
            cell.className = 'cell';
        }
        this.usedCells = [];
        snakePointsArray.forEach((point, idx) => {
            const snakeCell = this.cells[`x${point.x}_y${point.y}`];
            snakeCell.classList.add(idx === 0 ? 'snakeHead' : 'snakeBody');
            this.usedCells.push(snakeCell);
        });
        const foodCell = this.cells[`x${foodPoint.x}_y${foodPoint.y}`];
        foodCell.classList.add('food');
        this.usedCells.push(foodCell);
    },
};

/**
 * @property {{x: int, y: int}[]} body
 * @property {string} direction
 * @property {string} lastStepDirection
 * @property {int} maxX
 * @property {int} maxY
 */

const snake = {
    body: null,
    direction: null,
    lastStepDirection: null,
    maxX: null,
    maxY: null,

    /**
    * @param {{x: int, y: int}[]} startBody
    * @param {string} direction
    * @param {int} maxX
    * @param {int} maxY
    */

    init(startBody, direction, maxX, maxY) {
        this.body = startBody;
        this.direction = direction;
        this.lastStepDirection = direction;
        this.maxX = maxX;
        this.maxY = maxY;
    },

    /**
     * @return {{x: int, y: int}[]};
     */

    getBody() {
        return this.body;
    },
    getLastStepDirection() {
        return this.lastStepDirection;
    },

    /**
     * @see {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/some|Array.prototype.some()}
     * @param {{x: int, y: int}} point
     * @returns {boolean}
     */

    isOnPoint(point) {
        return this.body.some(snakePoint => snakePoint.x === point.x && snakePoint.y === point.y);
    },

    makeStep() {
        this.lastStepDirection = this.direction;
        this.body.unshift(this.getNextStepHeadPoint());
        this.body.pop();
    },

    growUp() {
        const lastBodyIdx = this.body.length - 1;
        const lastBodyPoint = this.body[lastBodyIdx];
        const lastBodyPointClone = Object.assign({}, lastBodyPoint);
        this.body.push(lastBodyPointClone);
    },

    /**
     * @returns {{x: int, y: int}}
     */

    getNextStepHeadPoint() {
        const firstPoint = this.body[0];

        switch (this.direction) {

            case 'up':
                return { x: firstPoint.x, y: firstPoint.y !== 0 ? firstPoint.y - 1 : this.maxY };
            case 'right':
                return { x: firstPoint.x !== this.maxX ? firstPoint.x + 1 : 0, y: firstPoint.y };
            case 'down':
                return { x: firstPoint.x, y: firstPoint.y !== this.maxY ? firstPoint.y + 1 : 0 };
            case 'left':
                return { x: firstPoint.x !== 0 ? firstPoint.x - 1 : this.maxX, y: firstPoint.y };
        }
    },

    /**
     * @param {string} direction
     */

    setDirection(direction) {
        this.direction = direction;
    },
};


/**
 * @property {int} x
 * @property {int} y
 */
const food = {
    x: null,
    y: null,

    /**
     * @returns {{x: int, y: int}}
     */

    getCoordinates() {
        return {
            x: this.x,
            y: this.y,
        }
    },

    /**
     * @param {{x: int, y: int}} point
     */

    setCoordinates(point) {
        this.x = point.x;
        this.y = point.y;
    },

    /**
    * @param {{x: int, y: int}} point
    * @returns {boolean}
    */

    isOnPoint(point) {
        return this.x === point.x && this.y === point.y;
    },
};

/**
 * @property {string} condition
 */

const status = {
    condition: null,

    setPlaying() {
        this.condition = 'playing';
    },
    setStopped() {
        this.condition = 'stopped';
    },
    setFinished() {
        this.condition = 'finished';
    },

    /**
     * @returns {boolean}
     */
    isPlaying() {
        return this.condition === 'playing';
    },
    /**
     * @returns {boolean}
     */
    isStopped() {
        return this.condition === 'stopped';
    },
};

/**
 * @property {int} count
 * @property {HTMLElement} countEl
 */

const score = {
    count: 0,
    countEl: null,

    init() {
        this.countEl = document.getElementById('score-count');
        this.drop();
    },
    increment() {
        this.count++;
        this.render();
    },
    drop() {
        this.count = 0;
        this.render();
    },
    render() {
        this.countEl.textContent = this.count;
    }
};

/**
 * @property {settings} settings
 * @property {map} map
 * @property {snake} snake
 * @property {food} food
 * @property {status} status
 * @property {score} score
 * @property {int} tickInterval
 */

const game = {
    config,
    map,
    snake,
    food,
    status,
    score,
    tickInterval: null,

    /**
     * @param {object} userSettings
     */

    init(userSettings) {
        this.config.init(userSettings);
        // const validation = this.config.validate();
        // if (!validation.isValid) {
        //     for (const err of validation.errors) {
        //         console.error(err);
        //     }
        //     return;
        // }
        this.map.init(this.config.getRowsCount(), this.config.getColsCount());
        this.score.init();
        this.setEventHandlers();
        this.reset();
    },

    reset() {
        this.stop();
        this.score.drop();
        this.snake.init(this.getStartSnakeBody(), 'up', this.config.getColsCount() - 1, this.config.getRowsCount() - 1);
        this.food.setCoordinates(this.getRandomFreeCoordinates());
        this.render();
    },

    play() {
        this.status.setPlaying();
        this.tickInterval = setInterval(() => this.tickHandler(), 1000 / this.config.getSpeed());
        this.setPlayButton('Приостановить');
    },

    stop() {
        this.status.setStopped();
        clearInterval(this.tickInterval);
        this.setPlayButton('Начать');
    },

    finish() {
        this.status.setFinished();
        clearInterval(this.tickInterval);
        this.setPlayButton('Игра окончена!', true);
    },

    tickHandler() {
        if (!this.canMakeStep()) {
            return this.finish();
        }
        if (this.food.isOnPoint(this.snake.getNextStepHeadPoint())) {
            this.snake.growUp();
            this.score.increment();
            this.food.setCoordinates(this.getRandomFreeCoordinates());
            if (this.isGameWon()) {
                this.finish();
            }
        }
        this.snake.makeStep();
        this.render();
    },

    /**
     * @param {string} textContent
     * @param {boolean} [isDisabled = false]
     */

    setPlayButton(textContent, isDisabled = false) {
        const playButton = document.getElementById('playButton');
        playButton.textContent = textContent;
        isDisabled ? playButton.classList.add('disabled') : playButton.classList.remove('disabled');
    },
    /**
     * @returns {{x: int, y: int}[]}
     */

    getStartSnakeBody() {
        return [{
            x: Math.floor(this.config.getColsCount() / 2),
            y: Math.floor(this.config.getRowsCount() / 2)
        }];
    },

    setEventHandlers() {
        document.getElementById('playButton').addEventListener('click', () => this.playClickHandler());

        document.getElementById('newGameButton').addEventListener('click', event => this.newGameClickHandler(event));

        document.addEventListener('keydown', event => this.keyDownHandler(event));
    },

    render() {
        this.map.render(this.snake.getBody(), this.food.getCoordinates());
    },

    /**
     * @return {{x: int, y: int}}
     */

    getRandomFreeCoordinates() {
        const exclude = [this.food.getCoordinates(), ...this.snake.getBody()];

        while (true) {

            const rndPoint = {
                x: Math.floor(Math.random() * this.config.getColsCount()),
                y: Math.floor(Math.random() * this.config.getRowsCount()),
            };

            if (!exclude.some(exPoint => rndPoint.x === exPoint.x && rndPoint.y === exPoint.y)) {
                return rndPoint;
            }
        }
    },

    playClickHandler() {
        if (this.status.isPlaying()) {
            this.stop();
        } else if (this.status.isStopped()) {
            this.play();
        }
    },

    newGameClickHandler() {
        // Ставим игру в начальное положение.
        this.reset();
    },

    /**
     * @param {KeyboardEvent} event
     */

    keyDownHandler(event) {
        if (!this.status.isPlaying()) {
            return;
        }
        const direction = this.getDirectionByCode(event.code);
        if (this.canSetDirection(direction)) {
            this.snake.setDirection(direction);
        }
    },

    /**
     * @param {string} code
     * @returns {string}
     */

    getDirectionByCode(code) {
        switch (code) {
            case 'KeyW':
            case 'ArrowUp':
                return 'up';
            case 'KeyD':
            case 'ArrowRight':
                return 'right';
            case 'KeyS':
            case 'ArrowDown':
                return 'down';
            case 'KeyA':
            case 'ArrowLeft':
                return 'left';
            default:
                return '';
        }
    },
    /**
     * @param {string} direction
     * @returns {boolean}
     */

    canSetDirection(direction) {
        const lastStepDirection = this.snake.getLastStepDirection();

        return direction === 'up' && lastStepDirection !== 'down' ||
            direction === 'right' && lastStepDirection !== 'left' ||
            direction === 'down' && lastStepDirection !== 'up' ||
            direction === 'left' && lastStepDirection !== 'right';
    },

    /**
     * @returns {boolean}
     */

    canMakeStep() {
        return !this.snake.isOnPoint(this.snake.getNextStepHeadPoint());
    },
};

window.onload = game.init({ speed: 5 });