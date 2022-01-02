import { Client as NativeDiscordClient, ClientOptions as NativeClientOptions, Collection, Intents } from 'discord.js'
import path from 'path'
import fs from 'fs'

type ClientOptions = Omit<NativeClientOptions, 'intents'> & { commands?: Collection<string, any>; commandsDir?: string; intents?: Intents[] }

const DEFAULT_INTENTS = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]

export class DiscordClient extends NativeDiscordClient {
    commands: Collection<string, any>

    constructor(options: ClientOptions) {
        super({ ...options, intents: DEFAULT_INTENTS })

        // Set commands
        if (options.commands) {
            this.commands = options.commands

            return
        }

        // Pull commands from command dir if that option was provided
        if (options.commandsDir) {
            const tempCollection = new Collection<string, any>()

            const allCommandDirectoryFiles = fs.readdirSync(path.join(__dirname, options.commandsDir))

            const commandFiles = allCommandDirectoryFiles.filter((file) => {
                if (file.includes('.ts') || file.includes('.js')) {
                    return file
                }
            })

            for (const file of commandFiles) {
                const command = require(`./commands/${file}`)

                tempCollection.set(command.data.name, command)
            }

            this.commands = tempCollection

            return
        }

        // Else just set commands to a new collection
        this.commands = new Collection()
    }
}
