import { Record, RecordType } from '@prisma/client'

type PartialRecord = Omit<Record, 'id' | 'squadId'>

export const DEFAULT_RECORDS: PartialRecord[] = Object.keys(RecordType).map((key) => ({
    owner: null,
    participants: [],
    type: key as RecordType,
    value: null,
}))
