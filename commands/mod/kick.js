const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
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
  async execute(interaction, client) {
    const user = await interaction.options.getMember("user");

    const userDetails = await interaction.options.getUser("user");
    const reason = await interaction.options.getString("reason");
    if (userDetails === client.user) {
      await interaction.reply({
        content: "Unable to kick",
      });
      return;
    }
    if (
      interaction.member.permissions.has([
        Permissions.FLAGS.KICK_MEMBERS,
        Permissions.FLAGS.BAN_MEMBERS,
      ])
    ) {
      user
        .kick(reason ? reason : "")
        .then(async () => {
          await interaction.reply({
            content: `Kicked ${userDetails.username} from the guild`,
          });
        })
        .catch(async (err) => {
          console.log(err);
          await interaction.reply({ content: err.message });
        });
    } else {
      await interaction.reply({
        content: "You don't have enough permission to kick a user!",
      });
    }
  },
};
