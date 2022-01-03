import { Squad } from '@prisma/client'

import { prisma } from './client'

export const createSquad = async (squad: Omit<Squad, 'id'>) => {
    return await prisma.squad.create({ data: { ...squad } })
}

export const getSquadForUser = async (ownerId: string) => {
    return await prisma.squad.findFirst({ where: { ownerId } })
}

export const deleteSquad = async (squadId: number) => {
    await prisma.squad.delete({ where: { id: squadId } })
}

export const addSummonerToSquad = async (squad: Squad, summonerId: string) => {
    await prisma.squad.update({ where: { id: squad.id }, data: { ...squad, summonerIds: [...squad.summonerIds, summonerId] } })
}
