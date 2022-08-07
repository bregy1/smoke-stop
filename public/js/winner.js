const playerImageFallback = () => {
    return 'api/fallback/portrait?refresh='+Date.now()
}

function betTimeToString(time, fallback) {

    let display = fallback
    if(time !== -1) {
        const date = new Date()
        date.setTime(time)
        display = `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`
    }

    return `
        <span class="win-date">${display}</span>
    `
}


const calcFirstWinDay = (previousPlayer, player, defaultValue) => {
    if(!player || !previousPlayer) return defaultValue
    return player.betDate - ((player.betDate - previousPlayer.betDate) / 2)
}
const calcLastWinDay = (player, nextPlayer, defaultValue) => {
    if(!player || !nextPlayer) return defaultValue
    return player.betDate + ((nextPlayer.betDate - player.betDate) / 2)
}
const calcWinPeriod = (player, index, players) => {
    const nextPlayer = players[index+1]
    const lastWinDay = calcLastWinDay(player, nextPlayer, -1)
 
    const previousPlayer = players[index-1]
    const firstWinDay = calcFirstWinDay(previousPlayer, player, -1)

    return [firstWinDay, lastWinDay]
}

async function fetchPlayers() {
    const res = await fetch('/api/players')
    return res.json()
}

async function loadPlayers() {
    const players = await fetchPlayers()
    return players.map((p, i) => ({
        ...p,
        winPeriod: calcWinPeriod(p, i, players)
    })).sort((p1, p2) => p1.betDate - p2.betDate)
}

function determineWinner(players) {
    const now = Date.now()
    const winners = players.filter(p => {
        const [start, end] = p.winPeriod
        return (start === -1 || now > start) && (end === -1 || now < end)
    })


    console.log('possible winners', winners)
    return winners[0]
    
}

function showPlayer(player, opts) {
    
    const winnerWrap = document.getElementById('winner-wrap')
    if (opts && opts.clear) {
        winnerWrap.innerHTML = ''
    }
    const playerEl = playerView(player)
    
    winnerWrap.appendChild(playerEl)
}

function visualiseWinner() {
    startConfetti()
    document.body.classList.add('winner-visualisation')
}

function stopVisualisingWinner() {
    stopConfetti()
    document.body.classList.remove('winner-visualisation')
}

function showAsActivePlayer(player, opts) {
    SHOWN_PLAYER = player
    stopVisualisingWinner()
    showPlayer(player, opts)

    if(player.name === WINNER.name) {
        visualiseWinner()
    }
}

function showWinner(players) {
    WINNER = determineWinner(players)
    showAsActivePlayer(WINNER)
}

function playerView(player) {
    let src = player.image
    if (!src) {
        src = playerImageFallback()
    }
    const img = new Image()
    img.src = src

    const winnerEl = document.createElement('div')
    winnerEl.classList.add('winner')

    const nameEl = document.createElement('h2')
    nameEl.innerHTML = `${player.name}&nbsp;`

    const bedDateEl  =document.createElement('div')
    bedDateEl.classList.add('bed-date-title')
    bedDateEl.innerHTML = `(${betTimeToString(player.betDate)})`
    nameEl.appendChild(bedDateEl)

    nameEl.classList.add('winner-title')
    nameEl.classList.add('multicolortext')

    const dateEl = document.createElement('div')
    dateEl.classList.add('win-period')
    dateEl.innerHTML = `Gewinnt von ${betTimeToString(player.winPeriod[0], 'Geburt')} bis ${betTimeToString(player.winPeriod[1], 'Tod')}`

    winnerEl.appendChild(img)
    winnerEl.appendChild(nameEl)
    winnerEl.appendChild(dateEl)
    return winnerEl

}

let PLAYERS = []
let SHOWN_PLAYER
let WINNER

function showPot(players) {
    const pot = players.reduce((acc, player) => {
        return acc + player.donation
    }, 0)
    document.getElementById('pot').innerHTML = `Aktueller Gewinn $${pot}$`
}

async function fetchData() {
    PLAYERS = await loadPlayers()
    showPot(PLAYERS)
    console.log('loaded players', PLAYERS)
    showWinner(PLAYERS)
}

async function init() {
    try {
        await fetchData()
    } catch (err) {
        console.error(err)
        alert('Page broken. Please open console and send Log to Silvan Bregy. Thanks. Reload hopefully fixes it..')
    }
}

function showPreviousPlayer() {
    let index = PLAYERS.findIndex(p => p.name === SHOWN_PLAYER.name)
    if (index < 1) {
        index = PLAYERS.length - 1
    }
    else {
        index--
    }

    showAsActivePlayer(PLAYERS[index], { clear: true })
}

function showNextPlayer() {
    let index = PLAYERS.findIndex(p => p.name === SHOWN_PLAYER.name)
    if (index === -1 || index >= PLAYERS.length-1) {
        index = 0
    }
    else {
        index++
    }

    showAsActivePlayer(PLAYERS[index], { clear: true })
}