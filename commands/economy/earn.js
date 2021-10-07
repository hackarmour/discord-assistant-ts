const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder, bold } = require("@discordjs/builders");
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
    .setDescription("Wanna earn some money?"),

  async execute(interaction) {
    let isEmojiAddedToList = false;
    const otherEmojis = [];
    await interaction.deferReply();

    knex
      .select("*")
      .from("users")
      .where("userId", `${interaction.user.id}`)
      .then(async (user) => {
        // Verify if the user has an account
        if (!user[0]) {
          await interaction.editReply({
            content:
              "Your account does not exist. Please open one using the `createaccount` slash command",
          });
          return;
        }

        // Executes if it has been over 1hr since the user worked
        if (new Date().getTime() - user[0].lastWorked > 360) {
          const index = Math.floor(Math.random() * emojisList.length);
          const randomEmoji = emojisList[index];
          await interaction.editReply({
            content: `Please take a look at this emoji!\n${randomEmoji}`,
          });

          await wait(3000);
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
            content: "Click the button with the correct emoji",
            components: [row, row2],
          });
          const collector = interaction.channel.createMessageComponentCollector(
            { time: 15000 }
          );
          collector.on("collect", async (collected) => {
            if (collected.user.id !== interaction.user.id) {
              try {
                await collected.reply({
                  content: "This menu is not for you",
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
                    .then(async () => {
                      const successEmd = new MessageEmbed()
                        .setTitle(`Great Job`)
                        .setDescription(
                          bold("You earned 18000 for an hour of work")
                        )
                        .setColor("#4bb543")
                        .setTimestamp();

                      await collected.update({
                        components: [],
                        embeds: [successEmd],
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
                  "You pressed the wrong button. You got no money, better luck next time!",
                components: [row, row2],
              });
            }
          });
        } else {
          const cooldownEmd = new MessageEmbed()
            .setTitle("Command on cooldown")
            .setDescription(
              "This command is on cooldown. Please comeback later!"
            )
            .setColor("#f32013")
            .setTimestamp();

          await interaction.editReply({ embeds: [cooldownEmd] });
        }
      });
  },
};
