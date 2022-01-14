// lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { GregorLogger } from '../logger'

declare global {
    var prisma: PrismaClient | undefined
}

export let prisma: PrismaClient

const logger = GregorLogger.getInstance()

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient()
    }
    prisma = global.prisma
}

prisma.$use(async (params, next) => {
    const before = Date.now()

    const result = await next(params)

    const after = Date.now()

    logger.info(`Query ${params.model}.${params.action} took ${after - before}ms`)

    return result
})

export default prisma
