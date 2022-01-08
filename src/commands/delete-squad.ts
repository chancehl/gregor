import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, Message } from 'discord.js'

import { deleteSquad, getSquadForUser } from '../db/squad'

// prettier-ignore
export const data = new SlashCommandBuilder()
    .setName('delete-squad')
    .setDescription('Deletes the current users squad')

export const execute = async (interaction: CommandInteraction) => {
    const userId = interaction.user.id

    const squad = await getSquadForUser(userId)

    if (squad == null) {
        await interaction.reply({ content: `You do not own a squad. Type \`/create-squad\` to create one`, ephemeral: true })

        return
    }

    // check to make sure they want to continue with this action
    const yesReplies = ['yes', 'y']
    let shouldDelete = false

    await interaction.reply({
        content: `Are you sure you want to delete your squad **${squad.name}**? This is permanent and can't be undone. Type ${yesReplies.join(' or ')} to continue.`,
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

            if (firstReplyContent != null && yesReplies.includes(firstReplyContent.toLowerCase())) {
                shouldDelete = true
            }
        } catch (error: any) {
            await interaction.followUp({ content: 'You did not confirm the deletion. Aborting.', ephemeral: true })

            return
        }
    }

    if (shouldDelete) {
        await deleteSquad(squad.id)

        await interaction.followUp({ content: `Deleted the squad **${squad.name}**`, ephemeral: true })
    } else {
        await interaction.followUp({ content: `Squad was not deleted.`, ephemeral: true })
    }
}
