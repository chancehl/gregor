import axios from 'axios'

import { AMERICAS_BASE, NA_BASE } from '../constants/url'
import { GregorLogger } from '../logger'

const logger = GregorLogger.getInstance()

export const getSummonerByName = async (name: string) => {
    try {
        const response = await axios.get(`${NA_BASE}/lol/summoner/v4/summoners/by-name/${encodeURIComponent(name)}?api_key=${process.env.RIOT_API_KEY}`)

        return response.status === 200 ? response.data : null
    } catch (err: any) {
        logger.error('Encountered an error while fetching summoner:', err.message)

        return null
    }
}

export const getSummonerById = async (id: string) => {
    try {
        const response = await axios.get(`${NA_BASE}/lol/summoner/v4/summoners/${encodeURIComponent(id)}?api_key=${process.env.RIOT_API_KEY}`)

        return response.status === 200 ? response.data : null
    } catch (err: any) {
        logger.error(`Encountered an error while fetching summoner: ${err.message}`)

        return null
    }
}

export const getSummonerMatchIds = async (summonerPuuid: string) => {
    try {
        const response = await axios.get(`${AMERICAS_BASE}/lol/match/v5/matches/by-puuid/${encodeURIComponent(summonerPuuid)}/ids?api_key=${process.env.RIOT_API_KEY}`)

        return response.status === 200 ? response.data : null
    } catch (err: any) {
        logger.error(`Encountered an error while fetching summoner matches: ${err.message}`)

        return null
    }
}

export const getSummonerMatchData = async (matchId: string) => {
    try {
        console.log({ url: `${AMERICAS_BASE}/lol/match/v5/matches/${matchId}/ids?api_key=${process.env.RIOT_API_KEY}` })

        const response = await axios.get(`${AMERICAS_BASE}/lol/match/v5/matches/${matchId}/ids?api_key=${process.env.RIOT_API_KEY}`)

        return response.status === 200 ? response.data : null
    } catch (err: any) {
        logger.error(`Encountered an error while fetching summoner matches: ${err.message}`)

        return null
    }
}
