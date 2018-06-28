const Discord = require("discord.js");
const ffmpeg = require("ffmpeg-binaries");
const opusscript = require("opusscript");
const ytdl = require("ytdl-core");
const client = new Discord.Client();
const fs = require("fs");

const prefix = "!";

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setStatus("Online")
    client.user.setActivity("Type: !Help")
});

client.on("guildMemberAdd", function (member) {
    let role = member.guild.roles.find("name", "Member");
    member.addRole(role).catch(console.error);
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "ping") {
      if (!args.length === 0) return;
      var m = await message.channel.send("Ping?");
      m.edit("Ping is `" + `${m.createdTimestamp - message.createdTimestamp}` + "` ms.");
  }

    if(command === "clear") {
      if(!message.member.roles.some(r=>["Owner", "Admin", "Mystic"].includes(r.name)) ) return;
    const deleteCount = parseInt(args[0], 10);
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
        return message.channel.send("I Need Freaking Number Of Messages To Delete Them! `(2~100)`");
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
        .catch(error => message.reply(`I Just Got An Error: ${error}`));
    }

    if(command === "play"){
      if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        //message.channel.send("player")
        //message.react("buttons")
        //if(reactions = 2) do something..
        //client.user.setActivity('YouTube', { type: 'LISTENING' })
    } else {
      message.reply('You are not in a voice channel!');
    }
    }

    if(command === "stop"){
      if (!args.length === 0) return;
      if (message.member.voiceChannel) {
      message.member.voiceChannel.leave();
      client.user.setActivity("Type: !Help");
    };
    }

    if(command === "radio"){
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

    if(command === "help"){
      if (!args.length === 0) return;
      message.channel.send("```Prefix: ! \nCommands:\n-Ping \n-Clear \n-Radio \n-Stop \n-Play(comming soon)```");
    }

});

client.login(process.env.token);
