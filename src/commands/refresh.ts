import { promisify } from 'util'
import { Record } from '@prisma/client'

import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

import { SquadManager } from '../models/squad'
import { upsertRecords } from '../models/record'

import { getSummonerMatchIds, getSummonerMatchData } from '../api/riot'

// prettier-ignore
export const data = new SlashCommandBuilder()
    .setName('refresh')
    .setDescription('Refreshes the records for the users squad')

export const execute = async (interaction: CommandInteraction) => {
    const userId = interaction.user.id

    const squad = await SquadManager.getSquadForUser(userId)

    if (squad == null) {
        await interaction.reply({ content: `You do not own a squad. Type \`/create-squad\` to create one.`, ephemeral: true })

        return
    }

    // tell the interaction to defer
    await interaction.deferReply({ ephemeral: true })

    // compute the latest records
    await promisify(setTimeout)(4000)

    for (const summonerPuuid of squad.summonerPuuids) {
        const matchIds = await getSummonerMatchIds(summonerPuuid)

        for (const matchId of matchIds) {
            const match = await getSummonerMatchData(matchId)

            console.log({ match })
        }
    }

    const records: Record[] = []

    // update the database
    await upsertRecords(records)

    // tell the user that we've got some new reords
    await interaction.editReply({ content: "Ok, I've updated your squads reords." })
}
