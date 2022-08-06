import * as fs from 'fs'
import { Config } from './config.js'

const SAMPLE_PLAYERS = [
    { name: 'Chris Tenud', image: 'assets/multi-smoke.gif', betDate: Date.now()}
]

fs.writeFileSync(Config.playersDb, JSON.stringify(SAMPLE_PLAYERS))
