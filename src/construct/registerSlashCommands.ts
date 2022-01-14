const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();
const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

export const registerSlashCommands = async (
    commands: any[],
    isGlobal: Boolean
) => {
    try {
        if (isGlobal == true) {
            await rest.put(Routes.applicationCommands(process.env.CLIENTID), {
                body: commands,
            });
        } else {
            await rest.put(
                Routes.applicationGuildCommands(
                    process.env.CLIENTID,
                    process.env.GUILDID
                ),
                {
                    body: commands,
                }
            );
        }
    } catch (error) {
        console.error(error);
    }
};