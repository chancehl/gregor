import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { getSummonerByName } from '../api/riot'

import { SquadManager } from '../models/squad'

// prettier-ignore
export const data = new SlashCommandBuilder()
    .setName('remove-summoner')
    .setDescription('Removes a summoner to the current users squad')
    .addStringOption(option => option
        .setName('summoner')
        .setDescription('The summoner you want to remove from your team')
        .setRequired(true))

export const execute = async (interaction: CommandInteraction) => {
    const userId = interaction.user.id
    const summonerName = interaction.options.getString('summoner')

    const squad = await SquadManager.getSquadForUser(userId)

    if (squad == null) {
        await interaction.reply({ content: `You do not own a squad. Type \`/create-squad\` to create one.`, ephemeral: true })

        return
    }

    if (summonerName == null) {
        await interaction.reply({ content: `You must provide a summoner name.`, ephemeral: true })

        return
    }

    const summoner = await getSummonerByName(summonerName)

    if (summoner == null) {
        await interaction.reply({ content: `Hmm... I couldn't find the summoner **${summonerName}**. Are you sure that is the correct summoner name?`, ephemeral: true })

        return
    }

    if (!squad.summoners.map((summoner) => summoner.id).includes(summoner.id)) {
        await interaction.reply({ content: `That summoner is not currently on your squad.`, ephemeral: true })

        return
    }

    await SquadManager.removeSummonerFromSquad(squad, summoner.id)

    await interaction.reply({ content: `Removed summoner **${summonerName}** from your squad.`, ephemeral: true })
}
