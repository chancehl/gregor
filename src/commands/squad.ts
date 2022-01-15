import { SlashCommandBuilder } from '@discordjs/builders'
import { Squad, RecordType } from '@prisma/client'
import { CommandInteraction, MessageEmbed } from 'discord.js'

import { getSummonerById } from '../api/riot'
import { GregorLogger } from '../logger'
import { SquadManager } from '../models/squad'

// prettier-ignore
export const data = new SlashCommandBuilder()
    .setName('squad')
    .setDescription('Shows the current users squad')

export const execute = async (interaction: CommandInteraction) => {
    const logger = GregorLogger.getInstance()

    try {
        const userName = interaction.user.username
        const userId = interaction.user.id

        const squad = await SquadManager.getSquadForUser(userId)

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

        await interaction.reply({ embeds: [generateEmbed(userName, squad, summoners)] })
    } catch (error: any) {
        await interaction.reply({ content: `An error occurred while fetching your squad: ${error.message}`, ephemeral: true })
    }
}

const generateEmbed = (userName: string, squad: Squad, summoners: any[]) => {
    // inside a command, event listener, etc.
    const embed = new MessageEmbed()

    const dummyRecords = [
        ...Object.keys(RecordType).map((key) => ({
            name: key.replaceAll('_', ' ').toLowerCase(),
            value: 'todo',
            inline: true,
        })),
    ]

    return (
        embed
            .setColor('#0099ff')
            .setTitle(squad.name.toUpperCase())
            .setDescription(`${userName}'s squad`)
            .setThumbnail(`https://static.wikia.nocookie.net/leagueoflegends/images/5/5f/Gregor_Shopkeeper_Render.png/revision/latest?cb=20200601034901`)
            // .setImage(`https://static.wikia.nocookie.net/leagueoflegends/images/5/5f/Gregor_Shopkeeper_Render.png/revision/latest?cb=20200601034901`)
            .addFields(
                { name: 'Squad members', value: summoners.map((summoner) => summoner.name).join(', ') },
                // TODO: map these out from the records saved in db
                ...dummyRecords,
            )
    )
}
