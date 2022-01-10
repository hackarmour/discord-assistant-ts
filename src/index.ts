import { Assistant } from "./classes/index";
import { config } from "dotenv";
import { join } from "path";
import { getJSFiles, registerSlashCommands } from "./construct";
import { CommandInteraction } from "discord.js";
import { Command } from "types";
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
  } catch {}
});

client.login(process.env.TOKEN as string);
