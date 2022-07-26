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

  const setBoardCell = (index, symbol) => {
    board[index] = symbol;
  };

  return { getBoardCell, setBoardCell };
})();

const DisplayController = (() => {
  const playerOne = Player('X');
  const playerTwo = Player('O');
  let activePlayer = playerOne;

  const cells = document.querySelectorAll('button.cell');

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
