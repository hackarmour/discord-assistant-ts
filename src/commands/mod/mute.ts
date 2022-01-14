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
    .setName("mute")
    .setDescription("Mute A User")
    .addUserOption((user) => {
      return user
        .setName("user")
        .setDescription("Mention A User")
        .setRequired(true);
    })
    .addRoleOption((mutedrole) => {
      return mutedrole
        .setName("role")
        .setDescription("Role to Give to the user")
        .setRequired(true);
    })
    .addStringOption((reason) => {
      return reason
        .setName("reason")
        .setDescription("Reason To Mute This User")
        .setRequired(false);
    }),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const user = interaction.options.getMember("user");
    const dmUser = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const mutedrole = interaction.options.getRole("role");
    //check for permissions
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
    //check if user is already muted
    if ((user as GuildMember).roles.cache.has(mutedrole.id)) {
      return await interaction.editReply({
        content: "User is already muted!",
      });
    }
    if (interaction.guild.me.permissions.has(["MANAGE_ROLES"])) {
      (user as GuildMember).roles.remove(mutedrole as RoleResolvable);
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
              `You Have Been Muted in ${interaction.guild.name}\n Reason:${
                reason ? reason : "No Reason Specified"
              }`
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
          .setDescription(
            `**Muted ${dmUser.tag}**\nReason:${
              reason ? reason : "No Reason Specified"
            }`
          ),
      ],
    });
  },
};
