import { PrismaClient, Squad } from '@prisma/client'

import { prisma } from './client'

export class SquadManager {
    private static client: PrismaClient

    constructor(client: PrismaClient) {
        SquadManager.client = client ?? prisma
    }

    static createSquad = async (squad: Omit<Squad, 'id'>) => {
        return await SquadManager.client.squad.create({ data: { ...squad } })
    }

    static getSquadForUser = async (ownerId: string) => {
        try {
            return await SquadManager.client.squad.findFirst({ where: { ownerId }, include: { records: true } })
        } catch (error: any) {
            console.log(`Encountered an error while running prisma.squad.findFirst: ${error.message}`)

            throw error
        }
    }

    static deleteSquad = async (squadId: number) => {
        await SquadManager.client.squad.delete({ where: { id: squadId } })
    }

    static addSummonerToSquad = async (squad: Squad, summonerId: string, summonerPuuid: string) => {
        try {
            await SquadManager.client.squad.update({
                where: {
                    id: squad.id,
                },
                data: {
                    summonerIds: [...squad.summonerIds, summonerId],
                    summonerPuuids: [...squad.summonerPuuids, summonerPuuid],
                },
            })
        } catch (error: any) {
            console.log(`Encountered an error while running prisma.squad.update: ${error.message}`)

            throw error
        }
    }

    static removeSummonerFromSquad = async (squad: Squad, summonerId: string, summonerPuuid: string) => {
        await SquadManager.client.squad.update({
            where: {
                id: squad.id,
            },
            data: {
                summonerIds: squad.summonerIds.filter((id) => id != summonerId),
                summonerPuuids: squad.summonerPuuids.filter((puuid) => puuid != summonerPuuid),
            },
        })
    }
}
