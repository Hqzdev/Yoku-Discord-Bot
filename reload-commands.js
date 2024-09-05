const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const foldersPath = path.join(__dirname, 'commands'); 

const commandFolders = ['Administrative', 'Economy', 'Main', 'Moderation', 'Music', 'Settings'];

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder); 
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] Команда в ${filePath} не содержит обязательные свойства "data" или "execute".`);
		}
	}
}


const rest = new REST().setToken(token);



(async () => {
	try {
		console.log(`🌀 | Started refreshing ${commands.length} application (/) commands.`);


		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`✅ | Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();