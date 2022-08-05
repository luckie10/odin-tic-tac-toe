const Properties = (_properties = {}) => ({
  set: (name, value) => {
    _properties[name] = value;
  },

  get: (name) => _properties[name],
});

const Player = (playerSymbol, human = true) => {
  const props = { playerSymbol, human };

  return {
    ...Properties(props),
    toggleHuman: () => {
      props.human = !props.human;
    },
  };
};

const Gameboard = (() => {
  const board = new Array(9);

  const getBoardCell = (index) => board[index];

  const getGameboard = () => board;

  const setBoardCell = (index, symbol) => {
    board[index] = symbol;
  };

  const clearGameboard = () => {
    for (let i = 0; i < board.length; i += 1) {
      board[i] = undefined;
    }
  };

  return {
    getBoardCell,
    getGameboard,
    setBoardCell,
    clearGameboard,
  };
})();

const gameController = (() => {
  const checkMatchingElements = (array) =>
    array.every((element) => element === 'X') ||
    array.every((element) => element === 'O');

  const checkRows = (board) => {
    for (let row = 0; row < 3; row += 1) {
      const rowArray = [];

      for (let cell = row * 3; cell < row * 3 + 3; cell += 1) {
        rowArray.push(board[cell]);
      }

      if (checkMatchingElements(rowArray)) return rowArray[0];
    }
    return false;
  };

  const checkColumns = (board) => {
    for (let column = 0; column < 3; column += 1) {
      const columnArray = [];

      for (let cell = column; cell <= column + 6; cell += 3) {
        columnArray.push(board[cell]);
      }

      if (checkMatchingElements(columnArray)) return columnArray[0];
    }
    return false;
  };

  const checkDiagonal = (board) => {
    const diagonals = [
      [0, 4, 8],
      [2, 4, 6],
    ];
    const diagonalGameboardContents = diagonals.map((diagonal) =>
      diagonal.map((cell) => board[cell])
    );

    for (let i = 0; i < diagonalGameboardContents.length; i += 1) {
      if (checkMatchingElements(diagonalGameboardContents[i]))
        return diagonalGameboardContents[i][0];
    }

    return false;
  };

  const checkDraw = (board) => {
    if (!board.includes(undefined)) return 'draw';
    return false;
  };

  const checkWin = (board) =>
    checkRows(board) ||
    checkColumns(board) ||
    checkDiagonal(board) ||
    checkDraw(board);

  return { checkWin };
})();

const cpuController = (() => {
  const score = {
    X: 1,
    O: -1,
    draw: 0,
  };

  const minimax = (position, maximizing) => {
    const result = gameController.checkWin(position);
    if (result) return score[result];

    if (maximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < position.length; i += 1) {
        if (position[i] === undefined) {
          position[i] = 'X';
          const value = minimax(position, false);
          position[i] = undefined;
          maxEval = Math.max(value, maxEval);
        }
      }
      return maxEval;
    }

    let minEval = Infinity;
    for (let i = 0; i < position.length; i += 1) {
      if (position[i] === undefined) {
        position[i] = 'O';
        const value = minimax(position, true);
        position[i] = undefined;
        minEval = Math.min(value, minEval);
      }
    }
    return minEval;
  };

  const step = (player, board) => {
    const maximizing = player.get('playerSymbol') === 'X';
    let bestValue = maximizing ? -Infinity : Infinity;
    let bestMove;

    for (let i = 0; i < board.length; i += 1) {
      if (board[i] === undefined) {
        board[i] = player.get('playerSymbol');
        const value = minimax(board, !maximizing);
        board[i] = undefined;
        const evaluator = maximizing ? value > bestValue : value < bestValue;
        if (evaluator) {
          bestValue = value;
          bestMove = i;
        }
      }
    }

    return bestMove;
  };

  return { step };
})();

// eslint-disable-next-line no-unused-vars
const DisplayController = (() => {
  const playerOne = Player('X');
  const playerTwo = Player('O');
  let activePlayer = playerOne;

  const cells = document.querySelectorAll('button.cell');
  const restartButton = document.querySelector('button.restart');
  const messageBox = document.querySelector('.message');
  const xHumanButton = document.getElementById('x-human-toggle');
  const oHumanButton = document.getElementById('o-human-toggle');

  const toggleActivePlayer = () => {
    activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
  };

  const clear = () => {
    cells.forEach((cell) => {
      cell.textContent = '';
    });
  };

  const render = () => {
    clear();

    xHumanButton.textContent = playerOne.get('human') ? 'Human' : 'Bot';
    oHumanButton.textContent = playerTwo.get('human') ? 'Human' : 'Bot';

    cells.forEach((cell, index) => {
      const cellContents = Gameboard.getBoardCell(index);
      if (cellContents) {
        cell.textContent = cellContents;
        cell.setAttribute('disabled', '');
      }
    });
  };

  const toggleHumanButton = (event) => {
    if (event.currentTarget.id === 'x-human-toggle') playerOne.toggleHuman();
    if (event.currentTarget.id === 'o-human-toggle') playerTwo.toggleHuman();
    render();
  };

  const displayMessage = (msg) => {
    messageBox.textContent = msg;
  };

  const clearMessage = () => {
    messageBox.textContent = '';
  };

  const endGame = () => {
    cells.forEach((cell) => cell.setAttribute('disabled', ''));
  };

  const setMark = (humanIndex) => {
    const board = Gameboard.getGameboard();
    const symbol = activePlayer.get('playerSymbol');
    const index = activePlayer.get('human')
      ? humanIndex
      : cpuController.step(activePlayer, board);

    Gameboard.setBoardCell(index, symbol);
    render();

    const result = gameController.checkWin(board);
    if (result === 'draw') {
      endGame();
      displayMessage(result);
      return;
    }
    if (result) {
      endGame();
      displayMessage(`${result} wins!!!`);
      return;
    }

    toggleActivePlayer();
    if (!activePlayer.get('human')) setMark();
  };

  const restartGame = () => {
    activePlayer = playerOne;
    Gameboard.clearGameboard();
    clearMessage();
    cells.forEach((cell) => cell.removeAttribute('disabled'));
    if (!activePlayer.get('human')) setMark();
    else render();
  };

  // init
  // ####

  render();

  cells.forEach((cell, index) =>
    cell.addEventListener('click', () => setMark(index))
  );
  restartButton.addEventListener('click', restartGame);
  xHumanButton.addEventListener('click', (event) => {
    toggleHumanButton(event);
    if (!activePlayer.get('human')) {
      const cpuIndex = cpuController.step(
        activePlayer,
        Gameboard.getGameboard()
      );
      setMark(cpuIndex);
    }
  });
  oHumanButton.addEventListener('click', toggleHumanButton);

  return { playerOne, playerTwo };
})();
