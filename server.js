
import express from 'express'
import { format } from 'util'
import { Config } from './config.js'
import { getPlayers, randomAsset } from './db.js'
import bodyParser from 'body-parser'


var app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.sendFile(Config.winnerPage)
})

app.use('/', express.static('public'));


const handler = async (req, res, fn) => {
    try {
        await fn()
    } catch (err) {
        console.error('request failed. err', err)
        res.status(500).json({ error: format(err) })
    }
}

app.get('/api/players', (req, res) => {
    handler(req, res, async () => {
        const players = await getPlayers()
        res.status(200).json(players)
    })
})

app.get('/api/fallback/portrait', (req, res) => {
    handler(req, res, async () => {

        const asset = await randomAsset('fallback-portrait')
        res.sendFile(asset)

    })
})

app.listen(Config.port, Config.address, () => {
    console.log(`serer listening: http://${Config.address}:${Config.port}`)
})