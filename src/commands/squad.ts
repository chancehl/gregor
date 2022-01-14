import { SlashCommandBuilder } from '@discordjs/builders'
import { Squad } from '@prisma/client'
import { CommandInteraction, MessageEmbed } from 'discord.js'

import { getSummonerById } from '../api/riot'
import { getSquadForUser } from '../models/squad'

// prettier-ignore
export const data = new SlashCommandBuilder()
    .setName('squad')
    .setDescription('Shows the current users squad')

export const execute = async (interaction: CommandInteraction) => {
    try {
        const userName = interaction.user.username
        const userId = interaction.user.id

        const squad = await getSquadForUser(userId)

        if (squad == null) {
            await interaction.reply({ content: `You do not own a squad. Type \`/create-squad\` to create one.`, ephemeral: true })

            return
        }

        let summoners = []

        for (const summonerId of squad.summonerIds) {
            const summoner = await getSummonerById(summonerId)

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
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
    )
}
