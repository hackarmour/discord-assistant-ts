const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban A user")
    .addStringOption((user) => {
      return user
        .setName("user")
        .setDescription("Enter Id of user to Unban")
        .setRequired(true);
    }),
  async execute(interaction, client) {
    const user = await interaction.options.getString("user");
    if (user == client.user.id) {
      await interaction.reply({
        content: "I am already unbanned bruh!",
      });
      return;
    }
    if (
      interaction.member.permissions.has([
        Permissions.FLAGS.KICK_MEMBERS,
        Permissions.FLAGS.BAN_MEMBERS,
      ])
    ) {
      interaction.guild.members
        .unban(user)
        .then(async () => {
          await interaction.reply({
            content: `Successfully Unbanned a user!`,
          });
        })
        .catch(async (err) => {
          await interaction.reply({ content: err.message });
        });
    } else {
      await interaction.reply({
        content: "You don't have enough permission to unban a user!",
      });
    }
  },
};
