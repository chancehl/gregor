# Gregor

Gregor is a discord bot who will allow users to create squads and compete against their friends while getting records in League of Legends' "All Random, All Mid" (ARAM) game mode.

## Commands

### Create a squad

| Command         | Parameters | Example                                    | Notes                      |
| --------------- | ---------- | ------------------------------------------ | -------------------------- |
| `/create-squad` | none       | `/create-squad`                            |                            |
|                 | name       | `/create-squad name: The cool kids`        |                            |
|                 | summoners  | `/create-squad summoners: Jim, Bob, Jones` | Comma separated            |
|                 | region     | `/create-squad region: NA`                 | Must be one of: NA, KR, CN |

![/create-squad](./demo/gifs/create-squad.gif)

### Add a summoner to your squad

| Command         | Parameters | Example                       | Notes                                                                  |
| --------------- | ---------- | ----------------------------- | ---------------------------------------------------------------------- |
| `/add-summoner` | summoner   | `/add-summoner summoner: Bob` | Must be a valid summoner name in the region you created your squad in. |

![/add-summoner](./demo/gifs/add-summoner.gif)

### Remove a summoner from your squad

| Command            | Parameters | Example                       | Notes                                     |
| ------------------ | ---------- | ----------------------------- | ----------------------------------------- |
| `/remove-summoner` | summoner   | `/add-summoner summoner: Bob` | Must be a valid summoner from your squad. |

![/remove-summoner](./demo/gifs/remove-summoner.gif)

### Show your squad's records to the world

| Command  | Parameters | Example          | Notes                                           |
| -------- | ---------- | ---------------- | ----------------------------------------------- |
| `/squad` | none       | `/squad`         |                                                 |
|          | private    | `/squad private` | Only you will be able to see the records report |

![/squad](./demo/gifs/squad.gif)
