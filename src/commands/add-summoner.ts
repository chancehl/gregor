import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { fetchSummonerByName } from '../api/riot'

import { addSummonerToSquad, deleteSquad, getSquadForUser } from '../db/squad'

// prettier-ignore
export const data = new SlashCommandBuilder()
    .setName('add-summoner')
    .setDescription('Adds a summoner to the current users squad')
    .addStringOption(option => option
        .setName('summoner')
        .setDescription('The summoner you want to add to your team')
        .setRequired(true))

export const execute = async (interaction: CommandInteraction) => {
    const userId = interaction.user.id
    const summonerName = interaction.options.getString('summoner')

    const squad = await getSquadForUser(userId)

    if (squad == null) {
        await interaction.reply({ content: `You do not own a squad. Type \`/create-squad\` to create one.`, ephemeral: true })

        return
    }

    if (summonerName == null) {
        await interaction.reply({ content: `You must provide a summoner name.`, ephemeral: true })

        return
    }

    const summoner = await fetchSummonerByName(summonerName)

    if (summoner == null) {
        await interaction.reply({ content: `Hmm... I couldn't find the summoner **${summonerName}**. Are you sure that is the correct summoner name?`, ephemeral: true })

        return
    }

    if (squad.summonerIds.includes(summoner.id)) {
        await interaction.reply({ content: `That summoner already exists on your team.`, ephemeral: true })

        return
    }

    await addSummonerToSquad(squad, summoner.id)

    await interaction.reply({ content: `Added summoner **${summonerName}** to your squad.`, ephemeral: true })
}
