const Game = require('./src/Game');

const game = new Game();
game.run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
