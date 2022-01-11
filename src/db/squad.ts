import { Squad } from '@prisma/client'

import { prisma } from './client'

export const createSquad = async (squad: Omit<Squad, 'id'>) => {
    return await prisma.squad.create({ data: { ...squad } })
}

export const getSquadForUser = async (ownerId: string) => {
    return await prisma.squad.findFirst({ where: { ownerId }, include: { records: true } })
}

export const deleteSquad = async (squadId: number) => {
    await prisma.squad.delete({ where: { id: squadId } })
}

export const addSummonerToSquad = async (squad: Squad, summonerId: string, summonerPuuid: string) => {
    try {
        await prisma.squad.update({
            where: { id: squad.id },
            data: { ...squad, summonerIds: [...squad.summonerIds, summonerId], summonerPuuids: [...squad.summonerPuuids, summonerPuuid] },
        })
    } catch (error: any) {
        console.log(`Encountered an error while running prisma.squad.update: ${error.message}`)
    }
}

export const removeSummonerFromSquad = async (squad: Squad, summonerId: string) => {
    await prisma.squad.update({ where: { id: squad.id }, data: { ...squad, summonerIds: squad.summonerIds.filter((id) => id != summonerId) } })
}
