const Discord = require("discord.js");
const ffmpeg = require("ffmpeg-binaries");
const opusscript = require("opusscript");
const ytdl = require("ytdl-core");
const client = new Discord.Client();
const fs = require("fs");
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.youtube);
const queue = new Map();


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
    
    var searchString = args.slice(1).join(' ');
    var url = args ? args.replace(/<(.+)>/g, '$1') : '';
    var serverQueue = queue.get(message.guild.id);
    var voiceChannel = message.member.voiceChannel;


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
      if (voiceChannel) {
      if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			var playlist = await youtube.getPlaylist(url);
			var videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				var video2 = await youtube.getVideoByID(video.id);
				await handleVideo(video2, message, voiceChannel, true);
			}
			return message.channel.send(`Playlist: **${playlist.title}**`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 5);
					var index = 0;
					message.channel.send(`__**Song selection:**__ \n${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}Please provide a value to select one of the search results ranging from 1-10.
					`);
					try {
						var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
							maxMatches: 1,
							time: 20000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.delete(1000);
					}
					var videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return message.channel.send('No results.');					
				}
			}
			return handleVideo(video, message, voiceChannel);
		}
    } else {
      message.reply('You are not in a voice channel!');
    }
    }
	
    if(command === "volume"){
      if (!voiceChannel) return message.channel.send('You are not in a voice channel!');
      		if (!serverQueue) return message.channel.send('There is nothing playing.');
      		if (!args) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
      		serverQueue.volume = args;
      		serverQueue.connection.dispatcher.setVolumeLogarithmic(args / 10);
      		return message.channel.send(`I set the volume to: **${args}**`);
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
      message.channel.send("```Prefix: ! \nCommands:\n    -Ping \n    -Clear \n    -Radio \n    -Stop \n    -Play \n    -Volume```");
    }

  async function handleVideo(video, message, voiceChannel, playlist = false) {
  	var serverQueue = queue.get(message.guild.id);
  	console.log(video);
  	var song = {
  		id: video.id,
  		title: video.title,
  		url: `https://www.youtube.com/watch?v=${video.id}`
  	};
  	if (!serverQueue) {
  		var queueConstruct = {
  			textChannel: message.channel,
  			voiceChannel: voiceChannel,
  			connection: null,
  			songs: [],
  			volume: 5,
  			playing: true
  		};
  		queue.set(message.guild.id, queueConstruct);

  		queueConstruct.songs.push(song);

  		try {
  			var connection = await voiceChannel.join();
  			queueConstruct.connection = connection;
  			play(message.guild, queueConstruct.songs[0]);
  		} catch (error) {
  			console.error(`I could not join the voice channel: ${error}`);
  			queue.delete(message.guild.id);
  			return message.channel.send(`I could not join the voice channel: ${error}`);
  		}
  	} else {
  		serverQueue.songs.push(song);
  		console.log(serverQueue.songs);
  		if (playlist) return undefined;
  		else return message.channel.send(`**${song.title}** has been added to the queue!`);
  	}
  	return undefined;
  }
    function play(guild, song) {
  	var serverQueue = queue.get(guild.id);

  	if (!song) {
  		serverQueue.voiceChannel.leave();
      client.user.setActivity("Type: !Help");
  		queue.delete(guild.id);
  		return;
  	}
  	console.log(serverQueue.songs);

  	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
  		.on('end', reason => {
        message.channel.send('``The queue of song is end.``');
  			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
  			else console.log(reason);
  			serverQueue.songs.shift();
  			play(guild, serverQueue.songs[0]);
  		})
  		.on('error', error => console.error(error));
  	dispatcher.setVolumeLogarithmic(serverQueue.volume / 10);

  	serverQueue.textChannel.send(`Playing: **${song.title}**`);
    client.user.setActivity(`${song.title}`, { type: 'LISTENING' });
  }

});

client.login(process.env.token);
