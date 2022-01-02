import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

export const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!')

export const execute = async (interaction: CommandInteraction) => {
    await interaction.reply('Pong!')
}

export default execute
