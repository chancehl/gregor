import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

import { deleteSquad, getSquadForUser } from '../db/squad'

// prettier-ignore
export const data = new SlashCommandBuilder()
    .setName('delete-squad')
    .setDescription('Deletes the current users squad')

export const execute = async (interaction: CommandInteraction) => {
    const userId = interaction.user.id

    const squad = await getSquadForUser(userId)

    if (squad == null) {
        await interaction.reply({ content: `You do not own a squad. Type \`/create-squad\` to create one`, ephemeral: true })

        return
    }

    await deleteSquad(squad.id)

    await interaction.reply({ content: `Deleted the squad **${squad.name}**`, ephemeral: true })
}
