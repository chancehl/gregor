import axios from 'axios'
import { Match } from '../@types/match'

import { AMERICAS_BASE, NA_BASE } from '../constants/url'
import { GregorLogger } from '../logger'

const logger = GregorLogger.getInstance()

export const getSummonerByName = async (name: string) => {
    const uriBase = `${NA_BASE}/lol/summoner/v4/summoners/by-name/${encodeURIComponent(name)}`
    const uri = uriBase + `?api_key=${process.env.RIOT_API_KEY}`

    try {
        const response = await axios.get(uri)

        return response.status === 200 ? response.data : null
    } catch (error: any) {
        logger.error(`Riot API endpoint ${uriBase} returned the following error: ${error}`)

        return null
    }
}

export const getSummonerById = async (id: string) => {
    const uriBase = `${NA_BASE}/lol/summoner/v4/summoners/${encodeURIComponent(id)}`
    const uri = uriBase + `?api_key=${process.env.RIOT_API_KEY}`

    try {
        const response = await axios.get(uri)

        return response.status === 200 ? response.data : null
    } catch (error: any) {
        logger.error(`Riot API endpoint ${uriBase} returned the following error: ${error}`)

        return null
    }
}

export const getSummonerMatchIds = async (summonerPuuid: string, options?: { from?: string }) => {
    try {
        let uri = `${AMERICAS_BASE}/lol/match/v5/matches/by-puuid/${encodeURIComponent(summonerPuuid)}/ids?api_key=${process.env.RIOT_API_KEY}`

        if (options?.from) {
            uri = `${uri}&startTime=${new Date(options.from).getTime()}`
        }

        const response = await axios.get(uri)

        return response.status === 200 ? response.data : null
    } catch (err: any) {
        logger.error(`Encountered an error while fetching summoner matches: ${err.message}`)

        return null
    }
}

export const getSummonerMatchData = async (matchId: string): Promise<Match | null> => {
    try {
        const response = await axios.get(`${AMERICAS_BASE}/lol/match/v5/matches/${matchId}?api_key=${process.env.RIOT_API_KEY}`)

        return response.status === 200 ? response.data : null
    } catch (err: any) {
        logger.error(`Encountered an error while fetching summoner matches: ${err.message}`)

        return null
    }
}
