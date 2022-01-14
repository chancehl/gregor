import { promisify } from 'util'
import { Record } from '@prisma/client'

import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

import { getSquadForUser } from '../models/squad'
import { upsertRecords } from '../models/record'

import { getSummonerMatches } from '../api/riot'

// prettier-ignore
export const data = new SlashCommandBuilder()
    .setName('refresh')
    .setDescription('Refreshes the records for the users squad')

export const execute = async (interaction: CommandInteraction) => {
    const userId = interaction.user.id

    const squad = await getSquadForUser(userId)

    if (squad == null) {
        await interaction.reply({ content: `You do not own a squad. Type \`/create-squad\` to create one.`, ephemeral: true })

        return
    }

    // tell the interaction to defer
    await interaction.deferReply({ ephemeral: true })

    // compute the latest records
    await promisify(setTimeout)(4000)

    for (const summonerId of squad.summonerIds) {
        const matches = await getSummonerMatches(summonerId)

        console.log({ matches })
    }

    const records: Record[] = []

    // update the database
    await upsertRecords(records)

    // tell the user that we've got some new reords
    await interaction.editReply({ content: "Ok, I've updated your squads reords." })
}
