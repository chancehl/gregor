import { promisify } from 'util'
import { Record } from '@prisma/client'

import { Embed, SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

import { getSummonerMatchIds, getSummonerMatchData } from '../api/riot'

import { GregorLogger } from '../logger'

import { RecordService } from '../services/record'
import { EmbedService } from '../services/embed'
import { SquadService } from '../services/squad'

// prettier-ignore
export const data = new SlashCommandBuilder()
    .setName('refresh')
    .setDescription('Refreshes the records for the users squad')

export const execute = async (interaction: CommandInteraction) => {
    const logger = GregorLogger.getInstance()

    const userId = interaction.user.id
    const userName = interaction.user.username

    const squad = await SquadService.getSquadForUser(userId)

    if (squad == null) {
        await interaction.reply({ content: `You do not own a squad. Type \`/create-squad\` to create one.`, ephemeral: true })

        return
    }

    if (squad.summoners.length < 1) {
        await interaction.reply({ content: `There are no summoners on your squad to hold records. Type \`/add-summoner\` to add one to your squad.`, ephemeral: true })

        return
    }

    // tell the interaction to defer
    await interaction.deferReply({ ephemeral: true })

    // compute the latest records
    await promisify(setTimeout)(4000)

    const matches = []

    // fetch all matches for the summoners on this squad since the last time this squad was refreshed
    for (const summoner of squad.summoners) {
        const matchIds = await getSummonerMatchIds(summoner.puuid, { from: process.env.BYPASS_TIMEFRAMES ? undefined : squad.refreshedOn })

        if (matchIds.length < 1) {
            logger.warn(`Could not find any matches after ${squad.refreshedOn} for summoner ${summoner.name} (puuid: ${summoner.puuid})`)

            break
        }

        logger.debug(`Fetched ${matchIds.length} match ids for summoner ${summoner.name} (id: ${summoner.id})`)

        for (const matchId of matchIds) {
            const match = await getSummonerMatchData(matchId)

            if (match == null) {
                logger.warn(`Could not find a match for ${matchId}, skipping this match id`)

                continue
            }

            matches.push(match)
        }
    }

    // Get all records
    const records = await RecordService.computeRecords(matches, squad)

    const updatedRecords = records.filter((record) => {
        const currentRecord = squad.records.find((current) => current.type === record.type)

        if (currentRecord && new Date(currentRecord.lastUpdated) < new Date(record.lastUpdated)) {
            return true
        }

        return false
    })

    if (updatedRecords.length) {
        // modify the squad data
        squad.records = records

        // update the database
        await RecordService.updateRecords(updatedRecords)

        // refresh the squad
        await SquadService.updateRefreshDate(squad)

        // tell ther user
        await interaction.editReply({ embeds: [EmbedService.generateSquadEmbed(userName, squad)] })

        return
    } else {
        logger.debug(`Refresh complete. No records were broken recently for squad ${squad.name} (id: ${squad.id})`)

        await interaction.editReply({ content: `Looks like no records were broken recently. Type \`/squad\` to show your current records.` })

        return
    }
}
