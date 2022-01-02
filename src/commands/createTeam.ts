import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('create-team')
    .setDescription('Creates a team with the given name')
    .addStringOption((option) => option.setName('name').setDescription('The name of the team').setRequired(true))

export const execute = async (interaction: CommandInteraction) => {
    const userId = interaction.user.id
    const guildId = interaction.guildId

    console.log({ userId, guildId })

    await interaction.reply({ content: `Created a team with name ${interaction.options.getString('name')}`, ephemeral: true })
}

export default execute
