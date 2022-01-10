import { Message, MessageEmbed, PartialMessage } from "discord.js";
import { client } from "..";
import { logs } from "../models/logs.model";

export const messageHandler = async (
  message: Message<boolean> | PartialMessage
) => {
  const embed = new MessageEmbed().setColor("RANDOM");
  const config = await logs.findOne({
    guildId: message.guildId,
  });
  const enabled = config ? config.enabled : false;
  const channel = config
    ? client.channels.cache.get(`${config.channelId}`)
    : undefined;
  return { embed, enabled, channel };
};
