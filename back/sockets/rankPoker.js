const _ = require("lodash");

const countOccurences = (list, value) => {
  return _.filter(list, o => {
    return o.indexOf(value) >= 0;
  }).length;
};

const RANKS_ = "23456789TJQKA";
const ADJUSTED_SCORES = [1, [3, 1, 2], [3, 1, 3], [5]];
const getCards = handString => {
  return handString.split(" ");
};

const rankHand = handString => {
  const hand = getCards(handString);
  const handLength = _.size(hand);
  if (handLength > 5) {
    const possible = [];
    _.times(handLength, i => {
      const a = hand.slice(0, i);
      const b = hand.slice(i + 1);
      const r = rankHand(a.concat(b).join(" "));
      possible.push(r);
    });
    return max(possible);
  }
  const RANK_MAP = {};
  _.each(hand, (card, i) => {
    const [cardRank, cardSuit] = card.split("");
    const rankIndex = RANKS_.indexOf(cardRank);
    RANK_MAP[rankIndex] = countOccurences(hand.join(""), cardRank);
  });

  const tuples = _.map(RANK_MAP, (occurences, k) => {
    return [occurences, k].map(Number);
  });
  const sortedTuples = _.sortBy(tuples, ["0", "1"]);
  //   console.log(sortedTuples);
  let [score, ranks] = [
    _.map(sortedTuples, "0").reverse(),
    _.map(sortedTuples, "1").reverse()
  ];
  //   console.log(score, ranks);
  if (score.length === 5) {
    // console.log(`----- ADJUSTED ------`);
    // if there are 5 different ranks it could be a straight or a flush (or both)
    ranksSplit = ranks.slice(0, 2);
    if (ranksSplit[0] === 12 && ranksSplit[1] === 3) {
      ranks = [3, 2, 1, 0, -1]; // adjust if 5 high straight
    }

    // # high card, straight, flush, straight flush
    const uniqueSuits = _.uniq(_.map(hand, "1"));
    const flush = uniqueSuits.length === 1 ? 1 : 0;
    const straight = ranks[0] - ranks[4] === 4 ? 1 : 0;
    const adjustmentIndex = parseInt(`${flush}${straight}`, 2);
    score = ADJUSTED_SCORES[adjustmentIndex];
  }
  console.log(score, ranks);
  console.log(`-----------------`);
  return [score, ranks];
};

const holdEm = (boardString, handsList) => {
  scores = _.map(handsList, (hand, i) => {
    const handString = `${boardString} ${hand}`;
    return [rankHand(handString), i];
  });
  best = Math.max(scores[0]);
  console.log("--- BEST ---");
  console.log(scores);
  return best;
};

console.log(`RANKING`);
rankHand("9H TC JC KS KC");
rankHand("9H TC JC JS KC");
rankHand("9H TC AD 8C 2C");

// holdEm("9H TC JC QS KC", [
//   "JS JD", // 0
//   "AD 9C", // 1 A-straight
//   "JD 2C", // 2
//   "AC 8D", // 3 A-straight
//   "QH KH", // 4
//   "TS 9C", // 5
//   "AH 3H", // 6 A-straight
//   "3D 2C" // 7
//   // '8C 2C', // 8 flush
// ]);
