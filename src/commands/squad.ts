import { SlashCommandBuilder } from '@discordjs/builders'
import { Squad, RecordType } from '@prisma/client'
import { CommandInteraction, MessageEmbed } from 'discord.js'

import { getSummonerById } from '../api/riot'
import { GregorLogger } from '../logger'
import { EmbedService } from '../services/embed'
import { SquadService } from '../services/squad'

// prettier-ignore
export const data = new SlashCommandBuilder()
    .setName('squad')
    .setDescription('Shows the current users squad')

export const execute = async (interaction: CommandInteraction) => {
    const logger = GregorLogger.getInstance()

    try {
        const userName = interaction.user.username
        const userId = interaction.user.id

        const squad = await SquadService.getSquadForUser(userId)

        if (squad == null) {
            logger.warn(`${userName} (id: ${userId}) ran /squad but does not own a squad`)

            await interaction.reply({ content: `You do not own a squad. Type \`/create-squad\` to create one.`, ephemeral: true })

            return
        }

        if (squad.summoners.length < 1) {
            logger.warn(`${userName} (id: ${userId}) requested their squad information but their squad has no members.`)

            await interaction.reply({ content: `Your squad has no members. Try adding one first by running the \`/add-summoner\` command.`, ephemeral: true })

            return
        }

        let summoners = []

        for (const squadSummoner of squad.summoners) {
            const summoner = await getSummonerById(squadSummoner.id)

            summoners.push(summoner)
        }

        await interaction.reply({ embeds: [EmbedService.generateSquadEmbed(userName, squad, summoners)] })
    } catch (error: any) {
        await interaction.reply({ content: `An error occurred while fetching your squad: ${error.message}`, ephemeral: true })
    }
}
