const Card = require('./Card');

class Deck {
  constructor() {
    this.cards = [];
    this.reset();
  }

  reset() {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    this.cards = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        this.cards.push(new Card(suit, rank));
      }
    }
    this.shuffle();
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  deal() {
    if (this.cards.length < 10) this.reset();
    return this.cards.pop();
  }
}

module.exports = Deck;
