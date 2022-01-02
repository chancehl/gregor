import { SlashCommandBuilder } from '@discordjs/builders'

export const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!')

export const execute = async (interaction: any) => {
    await interaction.reply('Pong!')
}

export default execute
