import { SlashCommandBuilder } from '@discordjs/builders'
import { Region } from '@prisma/client'
import { CommandInteraction } from 'discord.js'

import { getSummonerByName } from '../api/riot'
import { createSquad, getSquadForUser } from '../models/squad'

export const DEFAULT_SQUAD_NAME = 'the goon squad'
export const DEFAULT_REGION = 'NA'

// prettier-ignore
export const data = new SlashCommandBuilder()
    .setName('create-squad')
    .setDescription('Creates a squad with the given name')
    .addStringOption((option) => option
        .setName('name')
        .setDescription('The name of the squad')
        .setRequired(false))
    .addStringOption((option) => option
        .setName('summoners')
        .setDescription('A comma separated list of summoners for your team')
        .setRequired(false))
    .addStringOption(option =>
		option.setName('region')
			.setDescription('The Riot region for this team')
			.setRequired(false)
			.addChoice('NA', 'NA')
			.addChoice('EU', 'EU')
			.addChoice('KR', 'KR'))

export const execute = async (interaction: CommandInteraction) => {
    const userId = interaction.user.id
    const guildId = interaction.guildId

    // Validate inputs
    const nameInput = interaction.options.getString('name') ?? DEFAULT_SQUAD_NAME
    const summonersInput = interaction.options.getString('summoners') ?? null
    const regionInput = interaction.options.getString('region') ?? DEFAULT_REGION

    console.log({ userId, guildId, input: { name: nameInput, summoners: summonersInput, region: regionInput } })

    // Parse player names
    const summonerNames = summonersInput == null ? [] : summonersInput.split(',').map((summoner) => summoner.replace(',', ''))

    let summoners = []

    for (const summonerName of summonerNames) {
        const summoner = await getSummonerByName(summonerName)

        if (summoner == null) {
            await interaction.reply({
                content: `Hmm... I couldn't find the summoner **${summonerName}**. Are you sure that is the correct summoner name?`,
                ephemeral: true,
            })
        } else {
            summoners.push(summoner)
        }
    }

    // check to see if this player already has a squad
    const existingSquad = await getSquadForUser(userId)

    if (existingSquad != null) {
        await interaction.reply({
            content: `It looks like you already own a squad called **${existingSquad.name}**. Please delete that one before creating another. Type \`/delete-squad\` to delete your existing squad permanently.`,
            ephemeral: true,
        })

        return
    }

    // create team
    await createSquad({
        name: nameInput,
        ownerId: userId,
        region: regionInput as Region,
        summonerIds: summoners.map((summoner) => summoner.id),
        summonerPuuids: summoners.map((summoner) => summoner.puuid),
    })

    // inform invoker
    await interaction.reply({ content: `Created a squad with name **${nameInput}** and members **${summoners.length ? summonerNames.join(', ') : 'n/a'}**`, ephemeral: true })
}

export default execute
