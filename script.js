const Properties = (_properties = {}) => ({
  set: (name, value) => {
    _properties[name] = value;
  },

  get: (name) => _properties[name],
});

const Player = (playerName, playerSymbol) => {
  console.log();

  return {
    ...Properties({ playerName, playerSymbol }),
  };
};

const Gameboard = (() => {
  // const board = new Array(9);
  const board = [
    'x',
    undefined,
    undefined,
    undefined,
    undefined,
    'O',
    'O',
    undefined,
    undefined,
  ];

  return {
    ...Properties({ board }),
  };
})();

const DisplayController = (() => {
  const cells = document.querySelectorAll('button.cell');

  const clear = () => {
    cells.forEach((cell) => {
      cell.textContent = '';
    });
  };

  const render = () => {
    clear();

    const board = Gameboard.get('board');

    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  render();

  return {};
})();
