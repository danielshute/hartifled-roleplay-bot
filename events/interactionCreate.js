const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const db = require('../db.js')
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) {
				await interaction.reply({ content: `No command found matching /${interaction.commandName}. Please report this to the ByDan Team, Thank you.`, ephemeral: true });
				return;
			}
			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: `An error occured when executing the /${interaction.commandName} command. Please report this to the ByDan Team, Thank you.`, ephemeral: true });
			}
		} else if (interaction.isButton()) {
			if (interaction.customId == 'verify') {
				const modal = new ModalBuilder()
					.setCustomId('verifyModal')
					.setTitle('Verify your membership');

				const characterName = new TextInputBuilder()
					.setCustomId('characterName')
					.setLabel("What would you like your nickname to be?")
					.setMaxLength(25)
					.setStyle(TextInputStyle.Short);

				const rulesQuestion = new TextInputBuilder()
					.setCustomId('rulesQuestion')
					.setLabel("What rule number does VDM and RDM come under?")
					.setMaxLength(2)
					.setStyle(TextInputStyle.Short);

				const characterNameRow = new ActionRowBuilder().addComponents(characterName);
				const rulesQuestionRow = new ActionRowBuilder().addComponents(rulesQuestion);

				modal.addComponents(characterNameRow, rulesQuestionRow);

				await interaction.showModal(modal);
			}

		} else if (interaction.isStringSelectMenu()) {

		} else if (interaction.isModalSubmit()) {
			if (interaction.customId == 'verifyModal') {
				const logChannel = interaction.guild.channels.cache.get('1148394757211557968');
				const errorChannel = interaction.guild.channels.cache.get('1148400626108211221');
				const characterName = interaction.fields.getTextInputValue('characterName');
				const rulesQuestion = interaction.fields.getTextInputValue('rulesQuestion');
				if(rulesQuestion != '4'){
					const logEmbed = new EmbedBuilder()
							.setTitle('🚫 User verification denied')
							.setColor(0x2B2D31)
							.addFields(
								{ name: 'Name', value: `${characterName}` },
								{ name: 'Answer', value: `${rulesQuestion}` },
								{ name: 'User', value: `<@!${interaction.user.id}>` },
							)
					logChannel.send({ embeds: [ logEmbed ] })
					interaction.reply({ content:'🚫 You answered a question incorrectly, please read the rules and try again.', ephemeral: true })
				}else{
					db.addUserIfNotExist(interaction.user.id).then(async (ret) => {
						console.log(ret)
						const memberRole = interaction.guild.roles.cache.get('1147969545768816712');
						try{
							await interaction.member.setNickname(`[W${ret.memberNo}] ${characterName}`)
						}catch(e){
							errorChannel.send(`Error setting nickname: ${e.rawError.message}`);
							console.error(e)
						}
						interaction.member.roles.add(memberRole)
						const welcomeEmbed = new EmbedBuilder()
							.setTitle(':wave: Welcome to Hartfield Roleplay')
							.setDescription('To ensure you and your fellow roleplayers have the best exsperince possible we ask you to read the following documents so you are fully aware on how things work here at Hartfield.\nOnce again thank you for joining, we hope you have a good time!')
							.setImage('https://cdn.discordapp.com/attachments/1145014048048562176/1148404340588027944/image.png')
							.setColor(0x2B2D31)
							.addFields(
								{ name: 'Getting Started Guide', value: 'https://hartfieldroleplay.uk/guide/getting-started' },
							)
						const logEmbed = new EmbedBuilder()
							.setTitle('✅ New user verified')
							.setColor(0x2B2D31)
							.addFields(
								{ name: 'Name', value: `${characterName}` },
								{ name: 'Member Number', value: `${ret.memberNo}` },
								{ name: 'User', value: `<@!${interaction.user.id}>` },
							)
						logChannel.send({ embeds: [ logEmbed ] })
						interaction.reply({ content:`✅ Welcome to Hartfield Roleplay **[W${ret.memberNo}] ${characterName}**!`, ephemeral: true })
						interaction.user.send({ embeds: [welcomeEmbed] })
					})
				}
			}
		}
	},
};