const present = require('present');

module.exports.calcStats = stats => {
  const totalTime = stats.reduce((prev, stat) => prev + stat.time, 0)
  const totalTurn = stats.reduce((prev, stat) => prev + stat.nbTurn, 0)
  const totalBattles = stats.reduce((prev, stat) => prev + stat.nbBattles, 0)
  const [totalPlayer1, totalPlayer2] = stats.reduce((prev, stat) => {
    stat.winner === 1 ? prev[0]++ : prev[1]++
    return prev
  }, [0, 0])
  const avgTime = stats.reduce((prev, stat, i, array) => {
    if (i === array.length - 1) {
      prev += stat.time
      return prev / array.length
    }
    prev += stat.time
    return prev
  }, 0)
  const avgBattles = stats.reduce((prev, stat, i, array) => {
    if (i === array.length - 1) {
      prev += stat.nbBattles
      return prev / array.length
    }
    prev += stat.nbBattles
    return prev
  }, 0)
  console.log(`${totalTime.toFixed(4)}ms ce sont écoulées en temps de jeu pour ${stats.nbGame} parties`)
  console.log(`En moyenne une partie mets ${avgTime.toFixed(4)}ms`)
  console.log(`Il y a eu ${totalTurn} tours sur les ${stats.nbGame} parties`)
  console.log(`Le joueur 1 a gagné ${totalPlayer1} fois`)
  console.log(`Le joueur 2 a gagné ${totalPlayer2} fois`)
  console.log(`Il y a eu ${totalBattles} batailles au total`)
  console.log(`En moyenne il y a eu ${avgBattles.toFixed(0)} batailles par partie`)
}

module.exports.timer = function () {
  const start = present();
  return { stop: _ => present() - start }
};