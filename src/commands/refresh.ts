import { promisify } from 'util'
import { Record } from '@prisma/client'

import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

import { SquadService } from '../services/squad'

import { getSummonerMatchIds, getSummonerMatchData } from '../api/riot'
import { GregorLogger } from '../logger'

// prettier-ignore
export const data = new SlashCommandBuilder()
    .setName('refresh')
    .setDescription('Refreshes the records for the users squad')

export const execute = async (interaction: CommandInteraction) => {
    const logger = GregorLogger.getInstance()

    const userId = interaction.user.id

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

    for (const summoner of squad.summoners) {
        const matchIds = await getSummonerMatchIds(summoner.puuid, { from: squad.refreshedOn })

        logger.debug(`Fetched the following match ids for summoner ${summoner.name} (id: ${summoner.id}): ${matchIds.join(', ')}`)

        if (matchIds.length < 1) {
            logger.warn(`Could not find any matches after ${squad.refreshedOn} for summoner ${summoner.name} (puuid: ${summoner.puuid})`)

            break
        }

        logger.debug(`Fetched the following match ids for summoner ${summoner.name} (id: ${summoner.id}): ${matchIds.join(', ')}`)

        for (const matchId of matchIds) {
            const match = await getSummonerMatchData(matchId)

            console.log({ match })
        }
    }

    const records: Record[] = []

    // update the database
    // await upsertRecords(records)

    // refresh the squad
    await SquadService.updateRefreshDate(squad)

    // tell the user that we've got some new reords
    await interaction.editReply({ content: "Ok, I've updated your squads reords." })
}
