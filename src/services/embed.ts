import { Record, RecordType, Squad, Summoner } from '@prisma/client'
import { MessageEmbed } from 'discord.js'

export class EmbedService {
    static generateSquadEmbed = (userName: string, squad: Squad & { summoners: Summoner[]; records: Record[] }) => {
        // inside a command, event listener, etc.
        const embed = new MessageEmbed()

        return embed
            .setColor('#0099ff')
            .setTitle(squad.name.toUpperCase())
            .setDescription(`${userName}'s squad`)
            .setThumbnail(`https://static.wikia.nocookie.net/leagueoflegends/images/5/5f/Gregor_Shopkeeper_Render.png/revision/latest?cb=20200601034901`)
            .addFields(
                { name: 'Squad members', value: squad.summoners.map((summoner) => summoner.name).join(', ') },
                // TODO: map these out from the records saved in db
                ...Object.keys(RecordType).map((key) => this.generateRecordObject(key as RecordType, squad)),
            )
    }

    private static generateRecordObject = (recordType: RecordType, squad: Squad & { summoners: Summoner[]; records: Record[] }) => {
        const record = squad.records.find((record) => record.type === recordType)
        const owner = squad.summoners.find((summoner) => summoner.puuid === record?.owner)

        if (record == null || owner == null) {
            return {
                name: recordType.replaceAll('_', ' ').toLowerCase(),
                value: 'todo',
                inline: true,
            }
        }

        return {
            name: recordType.replaceAll('_', ' ').toLowerCase(),
            value: `_${record.value}_\n${owner.name}`,
            inline: true,
        }
    }
}
