

const d = new Date()


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


console.log(betTimeToString(d.getTime()))