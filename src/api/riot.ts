import axios from 'axios'

import { NA_BASE } from '../constants/url'

export const fetchSummonerByName = async (name: string) => {
    try {
        const response = await axios.get(`${NA_BASE}/lol/summoner/v4/summoners/by-name/${encodeURIComponent(name)}?api_key=${process.env.RIOT_API_KEY}`)

        return response.status === 200 ? response.data : null
    } catch (err: any) {
        console.error('Encountered an error while fetching summoner:', err.message)

        return null
    }
}
