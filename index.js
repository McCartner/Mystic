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

    if(command === "status"){
    if(!message.member.roles.some(r=>["Owner", "Admin", "Mystic"].includes(r.name)) ) return;
      message.channel.send("```Status: \n1. Online \n2. Idle \n3. Do Not Disturb \n4. Invisible```")
        .then(function (message) {
          message.react("1⃣");
          setTimeout(function(){
            message.react("2⃣");
          }, 500);
          setTimeout(function(){
            message.react("3⃣");
          }, 1000);
          setTimeout(function(){
            message.react("4⃣");
          }, 1500);
    			});
    }

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
      //client.user.setActivity(type: ("listening"), `${song}`)
      if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .catch(console.log);
    } else {
      message.reply('You are not in a voice channel!');
    }
    }

    if(command === "stop"){
      if (message.member.voiceChannel) {
      message.member.voiceChannel.leave();
    };
    }

    if(command === "radio"){
      //client.user.setActivity(type: ("listening"), `${song}`)
      if (args.length === 0)
return message.channel.send("I Need A Stream URL!");

  const streamURL = args.slice(0, args.length).join(" ");

    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => {
          connection.playArbitraryInput(`${streamURL}`);
        })
        .catch(console.log);
    } else {
      message.reply('You are not in a voice channel!');
    }
    }

    if(command === "help"){
      message.channel.send("```Prefix: ! \nCommands:\n-Ping \n-Clear \n-Status(comming soon) \n-Play(comming soon) \n-Stop(comming soon) \n-Radio(comming soon)```");
    }

});

client.login(process.env.token);
