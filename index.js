const Promise = require('bluebird')
const helpers = require('./helpers')
Array.prototype.shuffle = function () {
  this.forEach((arr, i) => {
    const j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  })
  return this;
}
const getValue = strength => {
  if (strength === 12) return 'As'
  if (strength === 11) return 'King'
  if (strength === 10) return 'Queen'
  if (strength === 9) return 'Valet'
  if (strength < 10) return (strength + 2).toString()
}
let cards = Array(13)
  .fill().reduce((prev, _, i) => [
    ...prev,
    {strength: i, value: getValue(i), color: 'Heart'},
    {strength: i, value: getValue(i), color: 'Tile'},
    {strength: i, value: getValue(i), color: 'Clover'},
    {strength: i, value: getValue(i), color: 'Pike'}
  ], []).shuffle()
const distribute = cards => ([cards.slice(0, cards.length / 2), cards.slice(cards.length / 2, cards.length)])
const pickCards = (deck1, deck2) => ([deck1.shift(), deck2.shift()])
const whoWin = (deck1, deck2) => {
  if (!deck1.length) return [1, [], 0]
  if (!deck2.length) return [2, [], 0]
  const [card1, card2] = pickCards(deck1, deck2)
  if (!card1) return [1, [], 0]
  if (!card2) return [2, [], 0]
  if (card1.strength > card2.strength) return [1, [card1, card2].shuffle(), 0]
  else if (card1.strength < card2.strength) return [2, [card1, card2].shuffle(), 0]
  else {
    const [temp1, temp2] = pickCards(deck1, deck2)
    const winner = whoWin(deck1, deck2)
    winner[1].push(...[card1, card2, temp1, temp2].shuffle())
    winner[2]++
    return winner
  }
}
const launchGame = (cards, verbose) => {
  const t = helpers.timer()
  const [player1, player2] = distribute(cards)
  if (verbose) console.log('Player 1:', player1.toString())
  if (verbose) console.log('Player 2:', player2.toString())
  let i = 0
  let nbBattles = 0
  while (player1.length && player2.length) {
    const winner = whoWin(player1, player2)
    if (winner[0] === 1) player1.push(...winner[1])
    else player2.push(...winner[1])
    nbBattles += winner[2]
    i++
  }
  if (verbose) console.log(`Le joueur ${player1.length ? 1 : 2} a gagné en ${i} tours \n`)
  return {
    time: +t.stop(),
    winner: +player1.length ? 1 : 2,
    nbTurn: +i,
    nbBattles
  }
}
;(async _ => {
  const nbGame = +process.env.nbTurn || 1000
  const promises = Array(nbGame).fill().map(_ => launchGame(cards, nbGame === 1 ? true : false))
  const stats = await Promise.map(promises, res=> res, {concurrency: 5})
  stats.nbGame = nbGame
  helpers.calcStats(stats)
})().catch(console.error)
