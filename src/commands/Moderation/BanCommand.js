const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class BanCommand extends BaseCommand {
  constructor() {
    super('ban', 'Moderation', []);
  }

  run(client, message, args) {
   var Userban = message.mentions.users.first();
   if(Userban){
     var member = message.guild.member(Userban)
     if(member) {
       member.ban({
         reason: "BANNED!"
       })
     }
   }
  }
}