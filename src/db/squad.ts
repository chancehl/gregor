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
