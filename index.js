const Discord = require("discord.js");
const client = new Discord.Client();
const translate = require("google-translate-api");

const config = require("./config.json");

client.login(process.env.token);

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setStatus("online") //online, away, dnd, invisible
    client.user.setActivity("Anime", { type: "WATCHING" }) //WATCHING, LISTENING, PLAYING
});

client.on("guildCreate", (guild) => {
  //send message with request to put role on top
  //message.channel.send("Please move `Mystic` role above others to unlock full potential")
});

client.on("guildMemberAdd", function (member) {
    let role = member.guild.roles.find("name", "Member");
    member.addRole(role).catch(console.error);
});

client.on("message", async message => {

    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const author = message.author;

//commands
    if (command === "todo" || command === "soon") {
      message.channel.send("-mute\n-unmute\n-mention\n-help\n-tempban")
    }
    else if (command === "info" || command === "about") {
      let avatar = client.user.displayAvatarURL;
      let servers = client.guilds.size; // Server Count
      let users = 0; // Start of user count
      let channels = client.channels.size;
      client.guilds.map(g => users += g.memberCount);

      let embed = new Discord.RichEmbed()
      .setAuthor("About Bot", avatar)
      .setColor(message.guild.member(client.user).displayHexColor)
      //.setTitle('Community Channels')
      .setThumbnail(avatar)
      .addField('Servers', servers, true)
      .addField('Users', users, true)
      //.addField('Channels', channels, true)
      .addField("Prefix", config.prefix)
      .addField("Owner", "McCartner#4119");

      message.channel.send(embed);
    }
    else if (command === "help" || command === "commands") {
      //if(args[0] == "help"){
        //message.reply("Usage: ");
        //return;
      //}

      let avatar = client.user.displayAvatarURL;
      let embed = new Discord.RichEmbed()
      .setAuthor("Commands", avatar)
      .setColor(message.guild.member(client.user).displayHexColor)
      .setThumbnail(avatar)
      .addField("Translate", `${config.prefix}` + "translate from:<leng> to:<leng> <text>")
      .addField("Mute", `${config.prefix}` + "mute <@user> <time>")
      .addField("Unmute", `${config.prefix}` + "unmute <@user>")
      .addField("clear", `${config.prefix}` + "clear")
      .addField("Ping", `${config.prefix}` + "ping")
      .addField("About", `${config.prefix}` + "about")
      .addField("Suppport Server", "https://discord.gg/n6ubaAD")
      .addField("Owner", "McCartner#4119")
      .setFooter("Requested By: " + message.author.username, message.author.avatarURL);

      message.channel.send(embed);
      }
    else if (command === "mute" || command === "tempmute") {
      if(message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("MANAGE_MESSAGES" || author.id !== config.owner)) {

        }
        //check if person has more administrator than bot
        //remove all permissions in every channel

      }

    else if (command === "unmute") {
      if(message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("MANAGE_MESSAGES" || author.id !== config.owner)) {
        //remove permission limit in every channel for that person


      }
    }

//fully done
    else if (command === "ping") {
      message.channel.send("The fuck you want me to say? pong um no go fuck yourself");
    }

    else if(command === "clear" || command === "purge") {
      if(message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("MANAGE_MESSAGES" || author.id !== config.owner)) {
        message.delete();
        if(!args[0]) return message.channel.send("Please provide a number.")
        message.channel.bulkDelete(args[0]).then(() => {
          message.channel.send(`Cleared ${args[0]} messages.`).then(message => message.delete(5000));
        });
      }}

    else if (command === "translate") {
    if (args[0]) {
        let from_language = "auto"
        let to_language = "en"
        let tobe_translated = message.content.slice(prefix.length + command.length + 1)
        if (args[0].startsWith("from:")) {
            from_language = args[0].slice(5)
            tobe_translated = tobe_translated.slice(args[0].length + 1)
            if (args[1].startsWith("to:")) {
                to_language = args[1].slice(3)
                tobe_translated = tobe_translated.slice(args[1].length + 1)
            }
        } else if (args[0].startsWith("to:")) {
            to_language = args[0].slice(3)
            tobe_translated = tobe_translated.slice(args[0].length + 1)
            if (args[1].startsWith("from:")) {
                from_language = args[1].slice(5)
                tobe_translated = tobe_translated.slice(args[1].length + 1)
            }
        }
        translate(tobe_translated, {
            from: from_language,
            to: to_language
        }).then(res => {
            final_text = res.text
            from_language = res.from.language.iso
            if (res.from.text.value) tobe_translated = res.from.text.value
            let embed = new Discord.RichEmbed()
                .setTitle("Translate")
                .setColor(message.guild.member(client.user).displayHexColor)
                .addField("`from: " + from_language + "`", "```" + tobe_translated + "```")
                .addField("`to: " + to_language + "`", "```" + final_text + "```")
                .setThumbnail("https://cdn.dribbble.com/users/1341307/screenshots/3641494/google_translate.gif")
            message.channel.send(embed)
        }).ca0tch(err => {
            message.channel.send("```example:\n" + prefix +"Translate from:fr to:en Bonjour, comment ça va?```")
        });
    }
    else {
      message.channel.send("```example:\n" + prefix +"Translate from:fr to:en Bonjour, comment ça va?```")
    }
}

//owner things
//reboot
    else if (command === "reboot" || command === "restart" || command === "reload") {
      if(author.id !== config.owner) return;
      client.destroy()
      client.login(config.token)
    }
//activity
    else if (command === "game" || command === "play" || command === "playing") {
      if(author.id !== config.owner) return;
      const game = args.join(" ")
      client.user.setActivity(game, { type: "PLAYING" })
    }
    else if (command === "watch" || command === "watching") {
      if(author.id !== config.owner) return;
      const game = args.join(" ")
      client.user.setActivity(game, { type: "WATCHING" })
    }
    else if (command === "listen" || command === "listening") {
      if(author.id !== config.owner) return;
      const game = args.join(" ")
      client.user.setActivity(game, { type: "LISTENING" })
    }
    else if (command === "stream" || command === "streaming") {
      if(author.id !== config.owner) return;
      if (args.length === 0) client.user.setActivity("some games", {type: "streaming", url: "https://www.twitch.tv/McCartnerOfficial"})
      else {
        const game = args.join(" ")
        client.user.setActivity(game, {type: "streaming", url: "https://www.twitch.tv/McCartnerOfficial"})
      }
    }

//status
    else if (command === "online") {
      if(author.id !== config.owner) return;
      client.user.setStatus("online")
    }
    else if (command === "idle" || command === "away") {
      if(author.id !== config.owner) return;
      client.user.setStatus("idle")
    }
    else if (command === "dnd" || command === "donotdisturb") {
      if(author.id !== config.owner) return;
      client.user.setStatus("dnd")
    }
    else if (command === "offline" || command === "invisible") {
      if(author.id !== config.owner) return;
      client.user.setStatus("invisible")
    }

//end
  });
