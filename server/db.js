import * as fs from 'fs'
import { join } from 'path'
import { Config } from './config.js'

const NO_PLAYERS_FOUND = [
    { name: `<"${Config.playersDb}" not found>`, imgage: '', betDate: 0 }
]

const NO_FALLBACKS_FOUND = [
    'no-portrait.png'
]

export const getPlayers = async () => {
    try {
       const players = await fs.readFileSync(Config.playersDb)
       return JSON.parse(players.toString())
    } catch (err) {
        console.error('failed to get players. error', err)
        return NO_PLAYERS_FOUND
    }
}

const assetCache = { }

const loadAssets = async (assetDir, praefix) => {
    if(!assetCache[praefix]) {
        const assets = await fs.promises.readdir(assetDir)
        const matches = assets.filter(a => a.startsWith(praefix))
        assetCache[praefix] = matches.map(t => join(Config.assetsDir, t))
        setTimeout(() => { assetCache[praefix] = undefined }, 60 * 1000)
    }

    return assetCache[praefix]

}
export const fallbackAssets = async (praefix) => {

    try {

        const assets = await loadAssets(Config.assetsDir, praefix)
        
        if(assets.length === 0) {
            throw 'No fallback assets found with praefix ' + praefix  + ', under path ' + Config.assetsDir
        }

        return assets

    } catch(err) {
        console.error(err)
        return NO_FALLBACKS_FOUND
    }
}


const randomItem = (items) => {
    return items[Math.floor(Math.random()*items.length)]
}

export const randomAsset = async (praefix) => {
    const fallbacks = await fallbackAssets(praefix)
    return randomItem(fallbacks)
}
