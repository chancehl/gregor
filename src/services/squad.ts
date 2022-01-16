import { PrismaClient, Record, Squad, Summoner } from '@prisma/client'
import { GregorLogger } from '../logger'

import { prisma } from './prisma'

type PartialRecord = Omit<Record, 'id' | 'squadId'>

type PartialSummoner = Omit<Summoner, 'squadId'>

export class SquadService {
    static client: PrismaClient = prisma

    static logger = GregorLogger.getInstance()

    constructor() {}

    static createSquad = async (squad: Omit<Squad, 'id'> & { summoners: PartialSummoner[]; records: PartialRecord[] }) => {
        return await this.client.squad.create({
            include: {
                records: true,
                summoners: true,
            },
            data: {
                ...squad,
                summoners: {
                    createMany: {
                        data: squad.summoners,
                    },
                },
                records: {
                    createMany: {
                        data: squad.records,
                    },
                },
            },
        })
    }

    static getSquadForUser = async (ownerId: string) => {
        try {
            this.logger.debug(`Finding squad for ownerId: ${ownerId}`)

            return await this.client.squad.findFirst({
                where: {
                    ownerId,
                },
                include: {
                    records: true,
                    summoners: true,
                },
            })
        } catch (error: any) {
            this.logger.error(`Encountered an error while running prisma.squad.findFirst: ${error.message}`)

            throw error
        }
    }

    static deleteSquad = async (squadId: number) => {
        await this.client.squad.delete({ where: { id: squadId } })
    }

    static addSummonerToSquad = async (squad: Squad, summoner: Summoner) => {
        try {
            await this.client.summoner.upsert({
                where: {
                    id: summoner.id,
                },
                create: {
                    id: summoner.id,
                    name: summoner.name,
                    puuid: summoner.puuid,
                    squadId: squad.id,
                },
                update: {
                    squadId: squad.id,
                },
            })
        } catch (error: any) {
            this.logger.error(`Encountered an error while running prisma.squad.update: ${error.message}`)

            throw error
        }
    }

    static removeSummonerFromSquad = async (squad: Squad, summonerId: string) => {
        await SquadService.client.squad.update({
            where: {
                id: squad.id,
            },
            data: {
                summoners: {
                    delete: {
                        id: summonerId,
                    },
                },
            },
        })
    }

    static updateRefreshDate = async (squad: Squad) => {
        await SquadService.client.squad.update({
            where: {
                id: squad.id,
            },
            data: {
                refreshedOn: new Date().toISOString(),
            },
        })
    }
}
