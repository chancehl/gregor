import { SlashCommandBuilder } from '@discordjs/builders'
import { Region } from '@prisma/client'
import { CommandInteraction } from 'discord.js'

import { getSummonerByName } from '../api/riot'
import { GregorLogger } from '../logger'
import { SquadService } from '../services/squad'

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
    const logger = GregorLogger.getInstance()

    const userId = interaction.user.id
    const guildId = interaction.guildId

    // Validate inputs
    const nameInput = interaction.options.getString('name') ?? DEFAULT_SQUAD_NAME
    const summonersInput = interaction.options.getString('summoners') ?? null
    const regionInput = interaction.options.getString('region') ?? DEFAULT_REGION

    // Parse player names
    const summonerNames = summonersInput == null ? [] : summonersInput.split(',').map((summoner) => summoner.replace(',', ''))

    let summoners = []

    for (const summonerName of summonerNames) {
        const summoner = await getSummonerByName(summonerName)

        if (summoner == null) {
            logger.error(`${userId} attempted to create a squad with the summoners: ${summonerNames.join(', ')} but the summoner ${summonerName} doesn't exist`)

            await interaction.reply({
                content: `Hmm... I couldn't find the summoner **${summonerName}**. Are you sure that is the correct summoner name?`,
                ephemeral: true,
            })

            return
        } else {
            summoners.push(summoner)
        }
    }

    // check to see if this player already has a squad
    const existingSquad = await SquadService.getSquadForUser(userId)

    if (existingSquad != null) {
        logger.error(
            `${interaction.user.username} (id: ${interaction.user.id}) tried to create a squad, but already had one (name: ${existingSquad.name}, id: ${existingSquad.id})`,
        )

        await interaction.reply({
            content: `It looks like you already own a squad called **${existingSquad.name}**. Please delete that one before creating another. Type \`/delete-squad\` to delete your existing squad permanently.`,
            ephemeral: true,
        })

        return
    }

    // create team
    await SquadService.createSquad({
        name: nameInput,
        ownerId: userId,
        region: regionInput as Region,
        refreshedOn: new Date().toISOString(),
        summoners,
    })

    // inform invoker
    const formattedMembers = summoners.length ? summonerNames.join(', ') : null

    let content = `Created a squad with name **${nameInput}**.`

    if (formattedMembers == null) {
        content = `${content} To add summoners to your squad, run the \`/add-summoner\` command.`
    }

    await interaction.reply({ content, ephemeral: true })
}

export default execute
