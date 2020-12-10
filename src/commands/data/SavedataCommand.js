const Discord = require("discord.js")
const datastore = require("nedb");
const database = new datastore("./Databases/savedmessages.db");
database.loadDatabase();
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class SavedataCommand extends BaseCommand {
  constructor() {
    super('savedata', 'data', []);
  }

  run(client, message, args) {
    



    const filter = m => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector(filter, {
      time: 15000
    });

    collector.on("collect", m => {
      database.insert({ _id: message.id, content: m.content, user: m.author.tag });
      console.log(`Collected ${m.content}`);      
      var embed = new Discord.MessageEmbed()
        .setTitle("Message Id Getter")
        .setColor("FFFF00")
        .addField("Your message id is: ", message.id);
      message.channel.send(embed);
    });






  }
}