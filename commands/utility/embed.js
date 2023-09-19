const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Send an embed')
		.addStringOption(option => option.setName('embed').setDescription('The JSON embed you wish to send'))
		.addStringOption(option => option.setName('components').setDescription('The JSON compntents you wish to have')),
	async execute(interaction) {
		const embedJSON = {
				"title": "Welcome to Hartfield Roleplay",
				"description": "To verify your membership, first, read all of the rules and then click the button below and answer all the questions you are presented with.\n\n**ENSURE YOU HAVE READ THE SERVER RULES BEFORE VERIFYING**",
				"image": {
				  "url": "https://media.discordapp.net/attachments/1145014048048562176/1148357877367570532/image.png"
				}
			}
			
		embedJSON.color = 0x2B2D31

		const actionRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('verify')
					.setLabel("Verify")
					.setStyle(ButtonStyle.Secondary)
			)

		await interaction.reply({ content: "Sent", ephemeral: true })
		await interaction.channel.send({ embeds: [ embedJSON ], components: [ actionRow ] });
	},
};