import { RecordType, Squad, Summoner } from '@prisma/client'
import { MessageEmbed } from 'discord.js'

export class EmbedService {
    static generateSquadEmbed = (userName: string, squad: Squad, summoners: Summoner[]) => {
        // inside a command, event listener, etc.
        const embed = new MessageEmbed()

        const dummyRecords = [
            ...Object.keys(RecordType).map((key) => ({
                name: key.replaceAll('_', ' ').toLowerCase(),
                value: 'todo',
                inline: true,
            })),
        ]

        return embed
            .setColor('#0099ff')
            .setTitle(squad.name.toUpperCase())
            .setDescription(`${userName}'s squad`)
            .setThumbnail(`https://static.wikia.nocookie.net/leagueoflegends/images/5/5f/Gregor_Shopkeeper_Render.png/revision/latest?cb=20200601034901`)
            .addFields(
                { name: 'Squad members', value: summoners.map((summoner) => summoner.name).join(', ') },
                // TODO: map these out from the records saved in db
                ...dummyRecords,
            )
    }
}
