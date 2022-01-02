import 'dotenv/config'

import { DiscordClient } from './discordClient'

const client = new DiscordClient({ commandsDir: './commands' })

client.on('ready', () => console.log(`Logged in as ${client?.user?.tag}!`))

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }

    const command = client.commands.get(interaction.commandName)

    if (command == null) {
        return
    }

    try {
        await command.execute(interaction)
    } catch (error) {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
})

client.login(process.env.DISCORD_BOT_TOKEN)
