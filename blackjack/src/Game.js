const readline = require('readline');
const Deck = require('./Deck');
const Hand = require('./Hand');

const LINE = '─'.repeat(44);

class Game {
  constructor() {
    this.deck = new Deck();
    this.balance = 1000;
    this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  }

  ask(prompt) {
    return new Promise(resolve => this.rl.question(prompt, answer => resolve(answer.trim())));
  }

  printTable(playerHand, dealerHand, hideDealer = true) {
    console.log('\n' + LINE);
    const dealerValue = hideDealer ? '?' : dealerHand.value;
    console.log(`  Dealer: ${dealerHand.display(hideDealer)}   (${dealerValue})`);
    console.log(`  You:    ${playerHand.display()}   (${playerHand.value})`);
    console.log(LINE);
  }

  async getBet() {
    while (true) {
      const input = await this.ask(`\n  Balance: $${this.balance} | Bet: $`);
      const bet = parseInt(input);
      if (!isNaN(bet) && bet >= 1 && bet <= this.balance) return bet;
      console.log(`  Invalid bet. Enter a number between $1 and $${this.balance}.`);
    }
  }

  async playRound() {
    let bet = await this.getBet();

    const player = new Hand();
    const dealer = new Hand();

    // Deal alternating cards
    player.add(this.deck.deal());
    dealer.add(this.deck.deal());
    player.add(this.deck.deal());
    dealer.add(this.deck.deal());

    this.printTable(player, dealer);

    // --- Blackjack checks ---
    const playerBJ = player.isBlackjack;
    const dealerBJ = dealer.isBlackjack;

    if (playerBJ || dealerBJ) {
      this.printTable(player, dealer, false);
      if (playerBJ && dealerBJ) {
        console.log('\n  Both Blackjack — Push!');
      } else if (playerBJ) {
        const win = Math.floor(bet * 1.5);
        this.balance += win;
        console.log(`\n  BLACKJACK! You win $${win}!  Balance: $${this.balance}`);
      } else {
        this.balance -= bet;
        console.log(`\n  Dealer has Blackjack. You lose $${bet}.  Balance: $${this.balance}`);
      }
      return;
    }

    // --- Player turn ---
    let playerDone = false;
    while (!playerDone) {
      const canDouble = player.cards.length === 2 && this.balance >= bet;
      const opts = canDouble ? '(h)it  (s)tand  (d)ouble: ' : '(h)it  (s)tand: ';
      const action = (await this.ask(`\n  Action — ${opts}`)).toLowerCase();

      if (action === 'h') {
        player.add(this.deck.deal());
        this.printTable(player, dealer);
        if (player.isBust) {
          this.balance -= bet;
          console.log(`\n  Bust! You lose $${bet}.  Balance: $${this.balance}`);
          return;
        }
        if (player.value === 21) break; // auto-stand on 21

      } else if (action === 's') {
        playerDone = true;

      } else if (action === 'd' && canDouble) {
        bet *= 2;
        player.add(this.deck.deal());
        this.printTable(player, dealer);
        if (player.isBust) {
          this.balance -= bet;
          console.log(`\n  Bust on double! You lose $${bet}.  Balance: $${this.balance}`);
          return;
        }
        playerDone = true;

      } else {
        console.log('  Invalid — enter h, s' + (canDouble ? ', or d.' : '.'));
      }
    }

    // --- Dealer turn ---
    console.log('\n  Dealer reveals...');
    while (dealer.value < 17) {
      dealer.add(this.deck.deal());
    }
    this.printTable(player, dealer, false);

    // --- Result ---
    const pv = player.value;
    const dv = dealer.value;

    if (dealer.isBust || pv > dv) {
      this.balance += bet;
      console.log(`\n  You win $${bet}!  Balance: $${this.balance}`);
    } else if (pv === dv) {
      console.log(`\n  Push — bet returned.  Balance: $${this.balance}`);
    } else {
      this.balance -= bet;
      console.log(`\n  Dealer wins. You lose $${bet}.  Balance: $${this.balance}`);
    }
  }

  async run() {
    console.log('\n' + '='.repeat(44));
    console.log('           BLACKJACK  (Node.js CLI)');
    console.log('='.repeat(44));
    console.log('  Starting balance: $1000');
    console.log('  Actions: (h)it  (s)tand  (d)ouble down');
    console.log('  Dealer stands on 17+. Blackjack pays 3:2.');

    while (this.balance > 0) {
      await this.playRound();
      if (this.balance <= 0) break;
      const again = await this.ask('\n  Play another round? (y/n): ');
      if (again.toLowerCase() !== 'y') break;
    }

    if (this.balance <= 0) {
      console.log('\n  You are out of money. Game over!');
    } else {
      console.log(`\n  Thanks for playing! Final balance: $${this.balance}`);
    }

    this.rl.close();
  }
}

module.exports = Game;
