class Hand {
  constructor() {
    this.cards = [];
  }

  add(card) {
    this.cards.push(card);
  }

  clear() {
    this.cards = [];
  }

  get value() {
    let total = 0;
    let aces = 0;
    for (const card of this.cards) {
      if (card.rank === 'A') {
        aces++;
        total += 11;
      } else {
        total += card.value;
      }
    }
    // Convert aces from 11 -> 1 as needed to avoid bust
    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }
    return total;
  }

  get isBlackjack() {
    return this.cards.length === 2 && this.value === 21;
  }

  get isBust() {
    return this.value > 21;
  }

  display(hideSecond = false) {
    return this.cards
      .map((card, i) => (hideSecond && i === 1 ? '[?]' : card.toString()))
      .join('  ');
  }
}

module.exports = Hand;
