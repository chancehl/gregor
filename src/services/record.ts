import { Record, Squad, Summoner } from '@prisma/client'

import prisma from '../services/prisma'

export class RecordService {
    static computeRecords = async (records: any[], squad: Squad & { records: Record[]; summoners: Summoner[] }) => {
        const existingRecords = squad.records

        return []
    }
}
