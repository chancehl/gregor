import { PrismaClient, Squad } from '@prisma/client'
import { GregorLogger } from '../logger'

import { prisma } from '../services/prisma'

export class SquadManager {
    static client: PrismaClient = prisma

    static logger = GregorLogger.getInstance()

    constructor() {}

    static createSquad = async (squad: Omit<Squad, 'id'>) => {
        return await this.client.squad.create({ data: { ...squad } })
    }

    static getSquadForUser = async (ownerId: string) => {
        try {
            this.logger.debug(`Finding squad for ownerId: ${ownerId}`)

            const squad = await this.client.squad.findFirst({ where: { ownerId }, include: { records: true } })

            if (squad == null) {
                throw new Error(`Could not find squad for ownerId: ${ownerId}`)
            }

            return squad
        } catch (error: any) {
            this.logger.error(`Encountered an error while running prisma.squad.findFirst: ${error.message}`)

            throw error
        }
    }

    static deleteSquad = async (squadId: number) => {
        await this.client.squad.delete({ where: { id: squadId } })
    }

    static addSummonerToSquad = async (squad: Squad, summonerId: string, summonerPuuid: string) => {
        try {
            await this.client.squad.update({
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
