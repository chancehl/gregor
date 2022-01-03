import { Squad } from '@prisma/client'

import { prisma } from './client'

export const createSquad = async (squad: Omit<Squad, 'id'>) => {
    return await prisma.squad.create({ data: { ...squad } })
}

export const getSquadForUser = async (id: string) => {
    return await prisma.squad.findFirst({ where: { ownerId: id } })
}
