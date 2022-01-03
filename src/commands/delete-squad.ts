import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

import { deleteSquad, getSquadForUser } from '../db/squad'

export const data = new SlashCommandBuilder().setName('delete-squad').setDescription('Deletes the current users squad')

export const execute = async (interaction: CommandInteraction) => {
    const userId = interaction.user.id

    const squad = await getSquadForUser(userId)

    if (squad == null) {
        await interaction.reply({ content: `The current user does not own a squad.`, ephemeral: true })

        return
    }

    await deleteSquad(squad.id)

    await interaction.reply({ content: `Deleted the squad: **${squad.name}**`, ephemeral: true })
}
