import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  GuildMember,
  MessageEmbed,
  Permissions,
  RoleResolvable,
} from "discord.js";

module.exports = {
  command: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmute A User")
    .addUserOption((user) => {
      return user
        .setName("user")
        .setDescription("Mention a User")
        .setRequired(true);
    })
    .addRoleOption((role) => {
      return role
        .setName("role")
        .setDescription("Role To Remove")
        .setRequired(true);
    }),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const user = interaction.options.getMember("user");
    const role = interaction.options.getRole("role");
    const dmUser = interaction.options.getUser("user");
    if (
      !(interaction.member as GuildMember).permissions.has([
        Permissions.FLAGS.KICK_MEMBERS,
        Permissions.FLAGS.BAN_MEMBERS,
      ])
    ) {
      return await interaction.editReply({
        content: "You don't have enough permission to mute a user!",
      });
    }
    //check if user is already unmuted
    if (!(user as GuildMember).roles.cache.has(role.id)) {
      return await interaction.editReply({
        content: "User is already Unmuted!",
      });
    }
    if (interaction.guild.me.permissions.has(["MANAGE_ROLES"])) {
      (user as GuildMember).roles.remove(role as RoleResolvable);
    }
    try {
      (await dmUser.createDM()).send({
        embeds: [
          new MessageEmbed()
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(
              `**You have been unmuted in ${interaction.guild.name}**`
            )
            .setColor("RANDOM")
            .setTimestamp(),
        ],
      });
    } catch {}
    await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setColor("GREYPLE")
          .setTimestamp()
          .setDescription(`**${dmUser.tag} has been unmuted**`),
      ],
    });
  },
};
