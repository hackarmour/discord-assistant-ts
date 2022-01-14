import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, Permissions } from "discord.js";
import { client } from "../..";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick A user")
    .addUserOption((user) => {
      return user
        .setName("user")
        .setDescription("Mention a user to kick")
        .setRequired(true);
    })
    .addStringOption((reason) => {
      return reason
        .setName("reason")
        .setDescription("Reason behind this action")
        .setRequired(false);
    }),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const user = interaction.options.getMember("user");
    const userDetails = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    if (userDetails === client.user) {
      await interaction.editReply({
        content: "Unable to kick",
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
        .kick(reason ? reason : "")
        .then(async () => {
          await interaction.editReply({
            content: `Kicked ${userDetails.username} from the guild`,
          });
        })
        .catch(async (err) => {
          console.log(err);
          await interaction.editReply({ content: err.message });
        });
    } else {
      await interaction.editReply({
        content: "You don't have enough permission to kick a user!",
      });
    }
  },
};
