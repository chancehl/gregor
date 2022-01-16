export type Match = {
    metadata: MetaData
    info: Info
}

export type MetaData = {
    matchId: string
    participants: string[]
}

export type Info = {
    gameCreation: number
    gameDuration: number
    gameEndTimestamp: number
    gameId: number
    gameMode: 'CLASSIC'
    gameStartTimestamp: number
    gameType: 'MATCHED_GAME'
    participants: Participant[]
}

export type Participant = {
    assists: number
    championId: number
    championName: string
    deaths: number
    doubleKills: number
    goldEarned: number
    killingSprees: number
    kills: number
    longestTimeSpentLiving: number
    magicDamageDealt: number
    participantId: number
    pentaKills: number
    physicalDamageDealt: number
    puuid: string
    quadraKills: number
    summonerId: string
    summonerName: string
    totalDamageTaken: number
    totalHeal: number
    totalMinionsKilled: number
    totalDamageDealt: number
    tripleKills: number
    trueDamageDealt: number
    visionScore: number
}
