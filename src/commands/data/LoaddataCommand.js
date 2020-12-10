const Discord = require("discord.js")
const datastore = require("nedb");
const database = new datastore("./Databases/savedmessages.db");
database.loadDatabase();
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class LoaddataCommand extends BaseCommand {
  constructor() {
    super('loaddata', 'data', []);
  }

  async run(client, message, args) {
 
    


    
    const filter = m => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector(filter, {
      time: 15000
    });

    collector.on("collect", async m => {
      let messagenow = await findOne(m.content, "_id");
      if (messagenow)
        var embed = new Discord.MessageEmbed()
          .setTitle("MessageData")
          .setColor("FFFF00")
          .addField("The user: ", messagenow.user)
          .addField("Said", messagenow.content);
      message.channel.send(embed);
    });











  }
}
async function findOne(val, type = "user") {
  let user;
  let response = new Promise((resolve, reject) => {
    database.findOne({ [type]: val }, (err, doc) => {
      let create;
      if (doc) {
        resolve(doc);
      } else {
        resolve(undefined);
      }
    });
  });
  return await response;
}

function addToDatabase(data) {
  database.insert(data);
}

function updateDatabase(data, id) {
  database.update({ ["_id"]: id }, data, { multi: false });
}

function deleteData(val, type = "user") {
  database.remove({ [type]: val }, { multi: true });
}

async function deleteAll() {
  let res = new Promise((res, rej) => {
    database.remove({}, { multi: true }, function(err, numRemoved) {
      //console.log("Removed: ", numRemoved);
      res(numRemoved);
    });
  });
  return await res;
}
async function objToString(obj) {
  var str = "";
  let props = Object.keys(obj);
  for (let i = 0; i < props.length; i++) {
    if (obj.hasOwnProperty(props[i])) {
      str += `${props[i]}: ${await convertToText(obj[props[i]])}`;
      if (i !== props.length - 1) str += `, `;
    }
  }
  return `{${str}}`;
}

async function arrToString(arr) {
  let newArray = [];
  for (let i = 0; i < arr.length; i++) {
    newArray[i] = await convertToText(arr[i]);
  }
  return `[\n  ${newArray.join(", \n  ")}\n]`;
}

async function convertToText(data) {
  data = await data;
  let result = "ERR: CAN'T CONVERT TO TEXT";
  let type = typeof data;
  if (data === null) result = "null";
  else if (data instanceof Array) result = await arrToString(data);
  else if (type === "object") result = await objToString(data);
  else if (type === "undefined") result = "undefined";
  else result = data.toString();
  return result;
}