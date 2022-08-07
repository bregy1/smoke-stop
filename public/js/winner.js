const playerImageFallback = () => {
    return 'api/fallback/portrait?abc='+Date.now()
}

function betTimeToString(time) {
    const date = new Date()
    date.setTime(time)

    return `
        ${date.getDay()}.${date.getMonth()}.${date.getFullYear()}
    `
}


async function fetchPlayers() {
    const res = await fetch('/api/players')
    return res.json()
}

function determineWinner(players) {
    return players[0]
}

function showPlayer(player, opts) {
    const winnerWrap = document.getElementById('winner-wrap')
    if (opts && opts.clear) {
        winnerWrap.innerHTML = ''
    }
    const playerEl = playerView(player)
    winnerWrap.appendChild(playerEl)
}

function showAsActivePlayer(player, opts) {
    SHOWN_PLAYER = player
    showPlayer(player, opts)
}

function showWinner(players) {
    showAsActivePlayer(determineWinner(players))
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
    nameEl.innerHTML = `${player.name}`
    nameEl.classList.add('winner-title')
    nameEl.classList.add('multicolortext')

    const dateEl = document.createElement('h1')
    dateEl.innerHTML = `Winning period: ${betTimeToString(player.betDate)} - ${betTimeToString(Date.now())}`

    winnerEl.appendChild(img)
    winnerEl.appendChild(nameEl)
    winnerEl.appendChild(dateEl)
    return winnerEl

}

let PLAYERS = []
let SHOWN_PLAYER
async function fetchData() {
    PLAYERS = await fetchPlayers()
    showWinner(PLAYERS)
}

async function init() {
    try {
        await fetchData()
        confettiAsInterval()
    } catch (err) {
        console.error(err)
        alert('Page broken. Please open console and send Log to Silvan Bregy. Thanks.')
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

    console.log('show player with index', index)
    showAsActivePlayer(PLAYERS[index], { clear: true })
}

function showNextPlayer() {
    let index = PLAYERS.findIndex(p => p.name === SHOWN_PLAYER.name)
    console.log('found index', index)
    
    if (index === -1 || index >= PLAYERS.length-1) {
        index = 0
    }
    else {
        index++
    }

    showAsActivePlayer(PLAYERS[index], { clear: true })
}