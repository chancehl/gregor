import 'dotenv/config'

import fs from 'fs'
import path from 'path'

import { Client as DiscordClient, Intents, Collection } from 'discord.js'

const commandFiles = fs.readdirSync(path.join(__dirname, './commands')).filter((file) => file.includes('.ts'))

const client = new DiscordClient({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

const commands = new Collection<string, any>()

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)

    commands.set(command.data.name, command)
}

client.on('ready', () => {
    console.log(`Logged in as ${client?.user?.tag}!`)
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return

    const command = commands.get(interaction.commandName)

    if (command == null) {
        return
    }

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)

        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
})

client.login(process.env.DISCORD_BOT_TOKEN)
