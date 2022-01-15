import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, Message } from 'discord.js'

import { SquadService } from '../services/squad'

export const YES_REPLIES = ['yes', 'y']

// prettier-ignore
export const data = new SlashCommandBuilder()
    .setName('delete-squad')
    .setDescription('Deletes the current users squad')

export const execute = async (interaction: CommandInteraction) => {
    const userId = interaction.user.id

    const squad = await SquadService.getSquadForUser(userId)

    if (squad == null) {
        await interaction.reply({ content: `You do not own a squad. Type \`/create-squad\` to create one`, ephemeral: true })

        return
    }

    // check to make sure they want to continue with this action
    let shouldDelete = false

    await interaction.reply({
        content: `Are you sure you want to delete your squad **${squad.name}**? This is permanent and can't be undone. Type ${YES_REPLIES.join(' or ')} to continue.`,
        ephemeral: true,
    })

    if (interaction && interaction.channel) {
        const filter = (message: Message) => interaction.user.id === message.author.id
        const time = 60000
        const max = 1
        const errors = ['time']

        try {
            const messages = await interaction.channel.awaitMessages({ filter, time, max, errors })

            const firstReply = messages.first()
            const firstReplyContent = firstReply?.content

            if (firstReplyContent != null && YES_REPLIES.includes(firstReplyContent.toLowerCase())) {
                shouldDelete = true

                firstReply?.delete()
            }
        } catch (error: any) {
            if (error.message) {
                await interaction.editReply({ content: `An error ocurred while deleting your squad: ${error.message}` })

                return
            }

            await interaction.editReply({ content: 'You did not confirm the deletion. Aborting.' })

            return
        }
    }

    if (shouldDelete) {
        // delete the squad
        await SquadService.deleteSquad(squad.id)

        // tell the user
        await interaction.editReply({ content: `Deleted the squad **${squad.name}**` })
    } else {
        // tell the user the squad was not deleted
        await interaction.editReply({ content: `Squad was not deleted.` })
    }
}
