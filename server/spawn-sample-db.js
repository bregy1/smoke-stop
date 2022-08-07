import * as fs from 'fs'
import { Config } from './config.js'

const SAMPLE_PLAYERS = [
    { name: 'Thomas Burgener', image: '', betDate: new Date('2022-01-11').getTime(), date: '2022-01-11'},
    { name: 'Martin Andres', image: '', betDate: new Date('2022-10-20').getTime(), date: '2022-10-20'},
    { name: 'Silvan Vonschallen', image: '', betDate: new Date('2023-03-01').getTime(), date: '2023-03-01'},
    { name: 'Silvan Bregy', image: '', betDate: new Date('2023-01-15').getTime(), date: '2023-01-15'},
    { name: 'Chris Tenud', image: '', betDate: new Date('2022-08-31').getTime(), date: '2022-08-31'}
]

fs.writeFileSync(Config.playersDb, JSON.stringify(SAMPLE_PLAYERS))
