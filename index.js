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
      if (message.member.voiceChannel) {
      message.member.voiceChannel.leave();
      client.user.setActivity("Type: !Help");
    };
    }

    if(command === "radio"){
      if (args.length === 0)
return message.channel.send("I Need A Stream URL!");

  const streamURL = args.slice(0, args.length).join(" ");

    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => {
          connection.playArbitraryInput(`${streamURL}`);
        })
        client.user.setActivity('Radio', { type: 'LISTENING' });
        .catch(console.log);
    } else {
      message.reply('You are not in a voice channel!');
    }
    }

    if(command === "help"){
      message.channel.send("```Prefix: ! \nCommands:\n-Ping \n-Clear \n-Radio \n-Stop \n-Play(comming soon)```");
    }

});

client.login(process.env.token);
