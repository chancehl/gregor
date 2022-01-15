import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { getSummonerByName } from '../api/riot'
import { GregorLogger } from '../logger'

import { SquadManager } from '../models/squad'

// prettier-ignore
export const data = new SlashCommandBuilder()
    .setName('add-summoner')
    .setDescription('Adds a summoner to the current users squad')
    .addStringOption(option => option
        .setName('summoner')
        .setDescription('The summoner you want to add to your team')
        .setRequired(true))

export const execute = async (interaction: CommandInteraction) => {
    const logger = GregorLogger.getInstance()

    try {
        const userId = interaction.user.id
        const summonerName = interaction.options.getString('summoner')

        const squad = await SquadManager.getSquadForUser(userId)

        if (squad == null) {
            logger.error(`${userId} attempted to add ${summonerName} to their squad, but that user does not own a squad`)

            await interaction.reply({ content: `You do not own a squad. Type \`/create-squad\` to create one.`, ephemeral: true })

            return
        }

        if (summonerName == null) {
            logger.error(`${userId} attempted to add ${summonerName} to their squad, but that summoner name is invalid`)

            await interaction.reply({ content: `You must provide a summoner name.`, ephemeral: true })

            return
        }

        const summoner = await getSummonerByName(summonerName)

        if (summoner == null) {
            logger.error(`${userId} attempted to add ${summonerName} to their squad, but that summoner doesn't exist`)

            await interaction.reply({ content: `Hmm... I couldn't find the summoner **${summonerName}**. Are you sure that is the correct summoner name?`, ephemeral: true })

            return
        }

        if (squad.summoners.find((squadSummoner) => squadSummoner.id === summoner.id)) {
            logger.error(`${userId} attempted to add ${summonerName} to their squad, but that summoner already exists on their squad.`)

            await interaction.reply({ content: `That summoner already exists on your squad.`, ephemeral: true })

            return
        }

        await SquadManager.addSummonerToSquad(squad, summoner)

        await interaction.reply({ content: `Added summoner **${summonerName}** to your squad.`, ephemeral: true })
    } catch (error: any) {
        logger.error(`Encountered an error while adding a summoner to squad: ${error.message}`)

        await interaction.reply({ content: `An error occurred while adding a summoner to your squad: ${error.message}`, ephemeral: true })
    }
}
