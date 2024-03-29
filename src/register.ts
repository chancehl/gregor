import 'dotenv/config'

import fs from 'fs'
import path from 'path'

import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

const commands = []

const unfilteredCommandFiles = fs.readdirSync(path.join(__dirname, 'commands'))

const commandFiles = unfilteredCommandFiles.filter((file) => {
    if (file.includes('.ts') || file.includes('.js')) {
        return true
    }

    return false
})

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)

    commands.push(command.data.toJSON())
}

const token = process.env.DISCORD_BOT_TOKEN as string
const clientId = process.env.DISCORD_BOT_CLIENT_ID as string
const guildId = process.env.DISCORD_BOT_TEST_GUILD_ID as string

const rest = new REST({ version: '9' }).setToken(token)

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered the following application commands:', commandFiles.map((file) => file.replace(/.(t|j)s/, '')).join(', ')))
    .catch(console.error)
