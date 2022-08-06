
import { join } from 'path'
import ip from 'ip'

const root = process.cwd()
const publicDir = join(root, 'public')
const dataDir = join(root, 'data')
const dbDir = join(dataDir, 'db')

export const Config = {
    winnerPage: join(publicDir, 'index.html'),
    assetsDir: join(publicDir, 'assets'),
    playersDb: join(dbDir, 'players.json'),
    address: ip.address(),
    port: 42420
}