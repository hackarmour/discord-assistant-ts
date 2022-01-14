import { Assistant } from "./classes/index";
import { config } from "dotenv";
import { join } from "path";
import { getJSFiles, registerSlashCommands } from "./construct";
import { CommandInteraction } from "discord.js";
import { Command } from "types";
import { connect } from "mongoose";
import { messageUpdateHandler, singleMessageDelete } from "./events";
config();

const client = new Assistant();
const commands = [];
const commandFiles = getJSFiles(join(__dirname, "commands"));
commandFiles.forEach((file) => {
  const command = require(file);
  commands.push(command.command);
  client.commands.set(command.command.name, command);
});

registerSlashCommands(commands, false);

client.on("ready", async () => {
  await connect(process.env.mongodbUrl as string);
  console.log(`Logged in as ${client.user.tag}! at ${new Date()} `);
});

client.on("interactionCreate", async (interaction: CommandInteraction) => {
  if (!interaction.guild)
    return await interaction.reply({
      content: "You can't Use These Commands in Dm's",
    });
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await (command as Command).run(interaction);
  } catch (e) {
    console.log(e);
  }
});

client.on("messageDelete", async (message) => {
  await singleMessageDelete(message);
});
client.on("messageUpdate", async (oldMessage, newMessage) => {
  await messageUpdateHandler(oldMessage, newMessage);
});

client.login(process.env.TOKEN as string);

export { client };
