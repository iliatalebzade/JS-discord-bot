require("dotenv").config();

const { Client, Intents, WebhookClient } = require("discord.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["USER", "REACTION", "MESSAGE"],
});

const data = {
  id: process.env.WEBHOOK_ID,
  token: process.env.WEBHOOK_TOKEN,
};

const webhookClient = new WebhookClient(data);

const PREFIX = "$";

client.on("ready", () => {
  console.log(`${client.user.tag} has logged in.`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);

    if (CMD_NAME === "kick") {
      if (!message.member.permissions.has("KICK_MEMBERS"))
        return message.reply("You do not have permissions to use that command");
      if (args.length === 0)
        return message.reply(`${message.author}, Please provide an ID`);
      const member = message.guild.members.cache.get(args[0]);
      if (member) {
        member
          .kick()
          .then((member) => message.channel.send(`${member} was kicked.`))
          .catch(() => message.channel.send("I'm not powerful enough :("));
      } else {
        message.channel.send("That member was not found");
      }
    } else if (CMD_NAME === "ban") {
      if (!message.member.permissions.has("BAN_MEMBERS"))
        return message.reply("You do not have permissions to use that command");
      if (args.length === 0)
        return message.reply(`${message.author}, Please provide an ID`);

      try {
        const user = await message.guild.members.ban(args[0]);
        message.channel.send("User was banned successfully");
      } catch (err) {
        message.channel.send(
          "An error occured. Either I do not have permissions or the user was not found"
        );
      }
    } else if (CMD_NAME === "announce") {
      const msg = args.join(" ");
      webhookClient.send(msg);
    }
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === "982362094328496250") {
    switch (name) {
      case "🍎":
        member.roles.add(["982364338708967474"]);
        break;
      case "🍌":
        member.roles.add(["982364446318018583"]);
        break;
      case "🍇":
        member.roles.add(["982364406333718578"]);
        break;
      case "🍑":
        member.roles.add(["982364518921437224"]);
        break;
    }
  }
});

client.on("messageReactionRemove", (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === "982362094328496250") {
    switch (name) {
      case "🍎":
        member.roles.remove(["982364338708967474"]);
        break;
      case "🍌":
        member.roles.remove(["982364446318018583"]);
        break;
      case "🍇":
        member.roles.remove(["982364406333718578"]);
        break;
      case "🍑":
        member.roles.remove(["982364518921437224"]);
        break;
    }
  }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
