

const d = new Date()

const d2 = JSON.parse(JSON.stringify(d))

const strDate = JSON.stringify(d2)

console.log('strDate', strDate)


const dateParse = JSON.parse(strDate)

console.log('dateParse', dateParse, typeof dateParse, new Date(dateParse).getTime())
