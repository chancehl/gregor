import { Record as PrismaRecord, RecordType, Squad, Summoner } from '@prisma/client'

import { Match, Participant } from '../@types/match'
import { GregorLogger } from '../logger'

import prisma from '../services/prisma'

export class RecordService {
    private static logger = GregorLogger.getInstance()

    static computeRecords = async (matches: Match[], squad: Squad & { records: PrismaRecord[]; summoners: Summoner[] }) => {
        const filteredMatches = matches.map((match) => ({
            ...match,
            info: {
                ...match.info,
                participants: match.info.participants.filter((participant) => squad.summoners.map((summoner) => summoner.puuid).includes(participant.puuid)),
            },
        }))

        const record = this.computeRecord(filteredMatches, squad, RecordType.MOST_PERSONAL_KILLS, 'kills')

        return [record]
    }

    private static computeRecord = (matches: Match[], squad: Squad & { records: PrismaRecord[] }, recordType: RecordType, key: keyof Participant) => {
        let record: PrismaRecord = squad.records.find((record) => record.type === recordType) as PrismaRecord

        for (const match of matches) {
            this.logger.debug(`Evaluating match id ${match.metadata.matchId} to see if any records were broken`)

            const participants = match.info.participants

            for (const participant of participants) {
                if (record.value == null || +record.value < participant[key]) {
                    this.logger.debug(
                        `Record ${record.type} was broken by summoner ${participant.summonerName} (id: ${participant.puuid}). Previous value=${record.value}, new value=${participant[key]}`,
                    )

                    record = {
                        id: record.id,
                        type: recordType,
                        value: participant[key].toString(),
                        owner: participant.puuid,
                        participants: participants.map((participant) => participant.puuid),
                        summonerId: participant.summonerId,
                        squadId: squad.id,
                        lastUpdated: new Date().toISOString(),
                    }
                }
            }
        }

        return record
    }

    static updateRecords = async (records: PrismaRecord[]) => {
        for (const record of records) {
            await prisma.record.update({ where: { id: record.id }, data: { ...record } })
        }
    }
}
