import { SlashCommandBuilder } from '@discordjs/builders'

export const data = new SlashCommandBuilder()
    .setName('create-team')
    .setDescription('Creates a team with the given name')
    .addStringOption((option) => option.setName('name').setDescription('The name of the team').setRequired(true))

export const execute = async (interaction: any) => {
    const userId = interaction.user.id
    const guildId = interaction.guildId

    console.log({ userId, guildId })

    await interaction.reply(`Created a team with name ${interaction.options.getString('name')}`)
}

export default execute
