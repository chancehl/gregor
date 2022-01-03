import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { validateSummonerExists, validateSummonersExist } from '../api/riot'

export const DEFAULT_TEAM_NAME = 'The goon squad'

// prettier-ignore
export const data = new SlashCommandBuilder()
    .setName('create-team')
    .setDescription('Creates a team with the given name')
    .addStringOption((option) => option
        .setName('name')
        .setDescription('The name of the team')
        .setRequired(true))
    .addStringOption((option) => option
        .setName('players')
        .setDescription('A comma separated list of players for your team')
        .setRequired(false))

export const execute = async (interaction: CommandInteraction) => {
    const userId = interaction.user.id
    const guildId = interaction.guildId

    // Validate inputs
    const nameInput = interaction.options.getString('name') ?? DEFAULT_TEAM_NAME
    const playersInput = interaction.options.getString('players') ?? null

    console.log({ userId, guildId, input: { name: nameInput, players: playersInput } })

    if (nameInput == null) {
        await interaction.reply('Sorry, you must provide a team name before I can create one for you.')

        return
    }

    if (playersInput == null) {
        await interaction.reply('The list of players is not in the correct format.')

        return
    }

    // Parse player names
    const players = playersInput.split(',').map((player) => player.replace(',', ''))

    const { allExist, missingSummoners } = await validateSummonersExist(players)

    if (!allExist) {
        const formattedMissingSummoners = missingSummoners.map((summoner) => `**${summoner}**`).join(', ')

        await interaction.reply({
            content: `Hmm... I couldn't find the following summoners: ${formattedMissingSummoners}. Are you sure those are the correct in-game names?`,
            ephemeral: true,
        })

        return
    }

    await interaction.reply({ content: `Created a team with name ${nameInput}`, ephemeral: true })
}

export default execute
