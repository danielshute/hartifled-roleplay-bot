const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(' Bot Online ');
		client.user.setActivity('connect.hartfieldroleplay.uk', { type: ActivityType.Playing });
	},
};