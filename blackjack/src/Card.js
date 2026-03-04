class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  get value() {
    if (['J', 'Q', 'K'].includes(this.rank)) return 10;
    if (this.rank === 'A') return 11; // Aces handled in Hand
    return parseInt(this.rank);
  }

  toString() {
    return `${this.rank}${this.suit}`;
  }
}

module.exports = Card;
