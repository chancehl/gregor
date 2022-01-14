import 'dotenv/config'

import { DiscordClient } from './discord-client'
import { GregorLogger } from './logger'

const client = new DiscordClient({ commandsDir: './commands' })

const logger = GregorLogger.getInstance()

client.on('ready', () => {
    // report that we're ready
    logger.debug(`Logged in as ${client?.user?.tag}`)
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }

    const command = client.commands.get(interaction.commandName)

    logger.debug(`User ${interaction.user.username} (id: ${interaction.user.id}) is attempting to execute command: /${interaction.commandName}`)

    if (command == null) {
        logger.warn(`Command ${interaction.commandName} was not found`)

        return
    }

    try {
        await command.execute(interaction)
    } catch (error) {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
})

client.login(process.env.DISCORD_BOT_TOKEN)
