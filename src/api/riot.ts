import axios from 'axios'

import { NA_BASE } from './url'

export const validateSummonerExists = async (name: string) => {
    try {
        const response = await axios.get(`${NA_BASE}/lol/summoner/v4/summoners/by-name/${encodeURIComponent(name)}?api_key=${process.env.RIOT_API_KEY}`)

        return response.status !== 404
    } catch (err: any) {
        console.error(err.message)

        return false
    }
}

export const validateSummonersExist = async (names: string[]) => {
    const promises = names.map((name) => {
        return new Promise<boolean>((resolve, reject) => {
            try {
                resolve(validateSummonerExists(name))
            } catch (err) {
                reject(err)
            }
        })
    })

    const players = await Promise.all(promises)

    let allExist = true
    let missingSummoners = []

    for (let index = 0; index < players.length; index++) {
        const player = players[index]

        if (!player) {
            allExist = false
            missingSummoners.push(names[index])
        }
    }

    return { allExist, missingSummoners }
}
