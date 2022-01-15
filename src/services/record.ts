import { Record } from '@prisma/client'

import prisma from '../services/prisma'

export const upsertRecords = async (records: Record[]) => {
    for (const record of records) {
        await prisma.record.upsert({ where: { id: record.id }, update: { ...record }, create: { ...record } })
    }
}
