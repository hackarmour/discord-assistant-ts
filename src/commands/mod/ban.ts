import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, Permissions } from "discord.js";
import { client } from "../..";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban A user")
    .addUserOption((user) => {
      return user
        .setName("user")
        .setDescription("Mention a user to Ban")
        .setRequired(true);
    })
    .addStringOption((reason) => {
      return reason
        .setName("reason")
        .setDescription("Reason to ban the user")
        .setRequired(true);
    })
    .addIntegerOption((days) => {
      return days
        .setName("days")
        .setDescription("Days To Ban The User")
        .setRequired(false);
    }),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const user = interaction.options.getMember("user");
    const userDetails = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const days = interaction.options.getInteger("days");
    const banDetails = {
      reason,
      days,
    };
    if (userDetails === client.user) {
      await interaction.editReply({
        content: "Unable to ban",
      });
      return;
    }
    if (
      (interaction.member as GuildMember).permissions.has([
        Permissions.FLAGS.KICK_MEMBERS,
        Permissions.FLAGS.BAN_MEMBERS,
      ])
    ) {
      (user as GuildMember)
        .ban(banDetails)
        .then(async () => {
          await interaction.editReply({
            content: `Banned ${userDetails.username} from the guild`,
          });
        })
        .catch(async (err) => {
          console.log(err);
          await interaction.editReply({ content: err.message });
        });
    } else {
      await interaction.editReply({
        content: "You don't have enough permission to ban a user!",
      });
    }
  },
};
