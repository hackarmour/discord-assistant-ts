import { Client, Collection, Intents } from "discord.js";

export class Assistant extends Client {
  public commands = new Collection();
  constructor() {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MEMBERS,
      ],
    });
  }
}
