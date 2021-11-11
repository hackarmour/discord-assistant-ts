const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban A user")
    .addUserOption((user) => {
      return user
        .setName("user")
        .setDescription("Mention a user to Ban")
        .setRequired(true);
    }),
  async execute(interaction, client) {
    const user = await interaction.options.getMember("user");
    const userDetails = await interaction.options.getUser("user");
    if (userDetails === client.user) {
      await interaction.reply({
        content: "Unable to ban",
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
        .ban(userDetails)
        .then(async () => {
          await interaction.reply({
            content: `Banned ${userDetails.username} from the guild`,
          });
        })
        .catch(async (err) => {
          console.log(err);
          await interaction.reply({ content: err.message });
        });
    } else {
      await interaction.reply({
        content: "You don't have enough permission to ban a user!",
      });
    }
  },
};
