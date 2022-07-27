const Properties = (_properties = {}) => ({
  set: (name, value) => {
    _properties[name] = value;
  },

  get: (name) => _properties[name],
});

const Player = (playerSymbol) => {
  console.log();

  return {
    ...Properties({ playerSymbol }),
  };
};

const Gameboard = (() => {
  const board = new Array(9);

  const getBoardCell = (index) => board[index];

  const getGameboard = () => board;

  const setBoardCell = (index, symbol) => {
    board[index] = symbol;
  };

  return { getBoardCell, getGameboard, setBoardCell };
})();

const DisplayController = (() => {
  const playerOne = Player('X');
  const playerTwo = Player('O');
  let activePlayer = playerOne;

  const cells = document.querySelectorAll('button.cell');

  const checkMatchingElements = (array) =>
    array.every((element) => element === 'X') ||
    array.every((element) => element === 'O');

  const checkRows = () => {
    for (let row = 0; row < 3; row += 1) {
      const rowArray = [];

      for (let cell = row * 3; cell < row * 3 + 3; cell += 1) {
        rowArray.push(Gameboard.getBoardCell(cell));
      }

      if (checkMatchingElements(rowArray)) return true;
    }
    return false;
  };

  const checkColumns = () => {
    for (let column = 0; column < 3; column += 1) {
      const columnArray = [];

      for (let cell = column; cell <= column + 6; cell += 3) {
        columnArray.push(Gameboard.getBoardCell(cell));
      }

      if (checkMatchingElements(columnArray)) return true;
    }
    return false;
  };

  const checkDiagonal = () => {
    const diagonals = [
      [0, 4, 8],
      [2, 4, 6],
    ];
    const diagonalGameboardContents = diagonals.map((diagonal) =>
      diagonal.map((cell) => Gameboard.getBoardCell(cell))
    );

    for (let i = 0; i < diagonalGameboardContents.length; i += 1) {
      if (checkMatchingElements(diagonalGameboardContents[i])) return true;
    }

    return false;
  };

  const checkWin = () => checkRows() || checkColumns() || checkDiagonal();

  const checkDraw = () => !Gameboard.getGameboard().includes(undefined);

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

    cells.forEach((cell, index) => {
      const cellContents = Gameboard.getBoardCell(index);
      if (cellContents) {
        cell.textContent = cellContents;
        cell.setAttribute('disabled', '');
      }
    });
  };

  const setMark = (index) => {
    const symbol = activePlayer.get('playerSymbol');
    Gameboard.setBoardCell(index, symbol);

    if (checkWin()) console.log(activePlayer.get('playerSymbol'), 'wins!!!');
    if (checkDraw()) console.log('Draw!!!');

    toggleActivePlayer();

    render();
  };

  // init
  // ####

  render();

  cells.forEach((cell, index) =>
    cell.addEventListener('click', (event) => setMark(index))
  );

  return {};
})();
