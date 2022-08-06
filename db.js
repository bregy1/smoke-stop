import * as fs from 'fs'
import { join } from 'path'
import { Config } from './config.js'

const NO_PLAYERS_FOUND = [
    { name: `<"${Config.playersDb}" not found>`, imgage: '', betDate: 0 }
]

const SAMPLE_PLAYERS = [
    { name: 'Chris Tenud', image: '', betDate: Date.now()}

    //{ name: 'Chris Tenud', image: 'assets/multi-smoke.gif', betDate: Date.now()}
]

const NO_FALLBACKS_FOUND = [
    'no-portrait.png'
]

export const getPlayers = async () => {
    try {
        return SAMPLE_PLAYERS
       // const players = await fs.readFileSync(playerDb)
       // return JSON.parse(players.toString())
    } catch (err) {
        console.error('failed to get players. error', err)
        return NO_PLAYERS_FOUND
    }
}

export const fallbackAssets = async (praefix) => {

    try {
        const assets = await fs.promises.readdir(Config.assetsDir)
        const targets = assets.filter(a => a.startsWith(praefix))

        if(targets.length === 0) {
            throw 'No fallback assets found with praefix ' + praefix  + ', under path ' + Config.assetsDir
        }

        return targets.map(t => join(Config.assetsDir, t))

    } catch(err) {
        console.error(err)
        return NO_FALLBACKS_FOUND
    }
}


const randomItem = (items) => {
    return items[Math.floor(Math.random()*items.length)];

}
export const randomAsset = async (praefix) => {
    const fallbacks = await fallbackAssets(praefix)
    return randomItem(fallbacks)
}
