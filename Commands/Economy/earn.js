const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const knex = require("../../knex");
const wait = require("util").promisify(setTimeout);
const emojisList = [
  "😂",
  "😎",
  "🤓",
  "🤣",
  "🥲",
  "😠",
  "😡",
  "😵‍💫",
  "🤑",
  "😱",
];
module.exports = {
  data: new SlashCommandBuilder()
    .setName(`job`)
    .setDescription("Wanna Earn Some Money?"),
  async execute(interaction) {
    let isEmojiAddedToList = false;
    const otherEmojis = [];
    await interaction.deferReply();
    knex
      .select("*")
      .from("users")
      .where("userId", `${interaction.user.id}`)
      .then(async (user) => {
        if (!user[0]) {
          await interaction.editReply({
            content:
              "Your account do not exist. Please Open One using createaccount slash Command",
          });
          return;
        }
        if (new Date().getTime() - user[0].lastWorked > 3200000) {
          const index = Math.floor(Math.random() * emojisList.length);
          const randomEmoji = emojisList[index];
          await interaction.editReply({
            content: `Please Take a look at this emoji!\n${randomEmoji}`,
          });
          await wait(4000);
          for (let i = 0; i <= emojisList.length; i++) {
            if (isEmojiAddedToList && emojisList.length === 6) {
              break;
            }
            if (emojisList.length === 6) {
              break;
            }
            if (!isEmojiAddedToList && otherEmojis.length < 6) {
              otherEmojis.push(
                emojisList[Math.floor(Math.random() * emojisList.length)]
              );
              if (emojisList.includes(randomEmoji)) {
                isEmojiAddedToList = true;
              }
            }
          }
          const row = new MessageActionRow();
          const row2 = new MessageActionRow();
          emojisList.forEach(async (emoji, index) => {
            if (row.components.length == 5) {
              row2.addComponents(
                new MessageButton()
                  .setEmoji(`${emoji}`)
                  .setCustomId(`${index}`)
                  .setStyle("SECONDARY")
              );
            } else {
              row.addComponents(
                new MessageButton()
                  .setEmoji(`${emoji}`)
                  .setCustomId(`${index}`)
                  .setStyle("SECONDARY")
              );
            }
          });
          await interaction.editReply({
            content: "Click The Button With the Correct Emoji",
            components: [row, row2],
          });
          const collector = interaction.channel.createMessageComponentCollector(
            { time: 15000 }
          );
          collector.on("collect", async (collected) => {
            if (collected.user.id !== interaction.user.id) {
              try {
                await collected.reply({
                  content: "You are not allowed to press these buttons",
                  ephemeral: true,
                });
                return;
              } catch (e) {}
            }
            if (collected.customId == index) {
              knex
                .select("*")
                .from("users")
                .where("userId", `${interaction.user.id}`)
                .then(async (res) => {
                  const newBalance = parseFloat(res[0].wallet) + 18000;
                  knex("users")
                    .where("userId", `${interaction.user.id}`)
                    .update({
                      wallet: newBalance.toString(),
                      lastWorked: `${new Date().getTime()}`,
                    })
                    .then(async (res) => {
                      const emb = new MessageEmbed()
                        .setTimestamp()
                        .setTitle(`Great Work`)
                        .setDescription(
                          `** You earned 18000 for an hour of work **`
                        )
                        .setColor("RANDOM");
                      await collected.update({
                        components: [],
                        embeds: [emb],
                        content: " ",
                      });
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                })
                .catch((error) => {
                  console.log(error.message);
                });
            } else {
              row.components.forEach((comp) => {
                if (comp.customId === collected.customId) {
                  comp.setStyle("DANGER");
                }
                if (comp.customId == index) {
                  comp.setStyle("SUCCESS");
                }
                comp.setDisabled(true);
              });
              row2.components.forEach((comp) => {
                if (comp.customId === collected.customId) {
                  comp.setStyle("DANGER");
                }
                if (comp.customId == index) {
                  comp.setStyle("SUCCESS");
                }
                comp.setDisabled(true);
              });
              await collected.update({
                content:
                  "You Pressed The Wrong Button. Hence You got no money. Better Luck next time!",
                components: [row, row2],
              });
            }
          });
        } else {
          const emb = new MessageEmbed()
            .setTimestamp()
            .setDescription(
              "This Command is on cooldown. Please Comeback later!"
            )
            .setTitle("Command On Cooldown")
            .setColor("RANDOM");
          await interaction.editReply({ embeds: [emb] });
        }
      });
  },
};
