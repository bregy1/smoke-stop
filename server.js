
import express from 'express'
import { Config } from './config'

var app = express()

app.get('/', (req, res) => {
    res.sendFile(Config.winnerPage)
})

