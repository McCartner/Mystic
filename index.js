const Discord = require("discord.js");
const ffmpeg = require("ffmpeg-binaries");
const opusscript = require("opusscript");
const client = new Discord.Client();
const fs = require("fs");
const translate = require("google-translate-api");

const config = require("./config.json");

client.login(process.env.token);

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setStatus("online") //online, away, dnd, invisible
    client.user.setActivity("Anime", { type: "WATCHING" }) //WATCHING, LISTENING, PLAYING
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

    if (command === "ping") {
      if (!args.length === 0) return;
      var m = await message.channel.send("Ping?");
      m.edit("Ping is `" + `${m.createdTimestamp - message.createdTimestamp}` + "` ms.");
  }

    else if(command === "clear" || command === "purge") {
      if(message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("MANAGE_MESSAGES" || author.id !== config.owner)) {
        message.delete();
        if(!args[0]) return message.channel.send("Please provide a number.")
        message.channel.bulkDelete(args[0]).then(() => {
          message.channel.send(`Cleared ${args[0]} messages.`).then(message => message.delete(5000));
        });
      }}

    else if(command === "stop"){
      if (!args.length === 0) return;
      if (message.member.voiceChannel) {
      message.member.voiceChannel.leave();
      client.user.setActivity("Anime", { type: "WATCHING" });
    };
    }

    else if(command === "radio"){
      if (args.length === 0)
return message.channel.send("```Radio Stations:\n1. I Love Radio \n2. I ❤ 2 Dance \n3. I ❤ Top 100 Charts \n4. I ❤ To Battle \n5. I ❤# Driest \n6. Balkan DJ Radio```");

  var number = args.join(" ");

  if(number == 1){
    var streamURL = "http://stream01.iloveradio.de/iloveradio1.mp3"
    client.user.setActivity('I Love Radio', { type: 'LISTENING' })

  }
    else if (number == 2) {
      var streamURL = "http://stream01.iloveradio.de/iloveradio2.mp3"
      client.user.setActivity('I ❤ 2 Dance', { type: 'LISTENING' })

    }
    else if (number == 3) {
      var streamURL = "http://stream01.iloveradio.de/iloveradio9.mp3"
      client.user.setActivity('I ❤ Top 100 Charts', { type: 'LISTENING' })

    }
    else if (number == 4) {
      var streamURL = "http://stream01.iloveradio.de/iloveradio3.mp3"
      client.user.setActivity('I ❤ To Battle', { type: 'LISTENING' })

    }
    else if (number == 5) {
      var streamURL = "http://stream01.iloveradio.de/iloveradio6.mp3"
      client.user.setActivity('I ❤# Driest', { type: 'LISTENING' })

    }
    else if (number == 6) {
      var streamURL = "http://balkan.dj.topstream.net:8070/;*.mp3"
      client.user.setActivity('Balkan DJ Radio', { type: 'LISTENING' })

    }
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
      .then(connection => {
          connection.playArbitraryInput(streamURL, { volume: "0.05" });
        })
        .catch(console.log);
    } else {
      message.reply('You are not in a voice channel!');
    }
    }

    else if(command === "help"){
      if (!args.length === 0) return;
      message.channel.send("```Prefix: ! \nCommands:\n    -Ping \n    -Clear \n    -Radio \n    -Stop \n    -Play```");
    }

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
});
