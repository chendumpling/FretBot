const ids = require(`../ids.json`);
var tools = require(`../tools/functions.js`);

/**
 * Creates a thread using the original message author's username
 * @param {Message} msg - the original command message
 */
async function createThread(msg){
    
    let threadTitle = msg.author.username + " - Discussion";
    const thread = await msg.startThread({
        name: threadTitle,
        autoArchiveDuration: 60
    });
    thread.send(`Show ${msg.author.username} some support!`);
}

/**
 * Sends embed message on how to use the command properly
 * @param {Message} msg - the original command message
 */
function incorrectUsage(msg){
    let time = 10;
    if(msg.content.includes('discord.gg')){
        msg.delete()
        msg.channel.send(`**${msg.member}**` + ", discord invite links are not allowed in promotion.")
        .then(sentMsg => {
            tools.deleteMsg(sentMsg, time);
        }).catch();
    }
    else {
        let time = 15;
        msg.channel.send(`**${msg.member}**` + `, discussions in <#${ids.promoChannel}> are only allowed in threads. If you're promoting your work, include a link. Your message will be deleted in ${time} seconds. `)
        .then(sentMsg => {
            tools.deleteMsg(sentMsg, time);
            tools.deleteMsg(msg, time);
        }).catch();
    }
}

module.exports = {
    name: 'promo',
    description: "this command is passively invoked whenever a user sends a message into the promotion channel.",
    execute (msg){

        // Makes sure this command only runs outside of threads
        if (!(msg.channel.type == 'GUILD_PUBLIC_THREAD')
            && !(msg.channel.type == 'GUILD_PRIVATE_THREAD')){

            let hasLink = msg.content.includes('https://' || 'http://');

            // message contains valid link
            if (hasLink) {
                createThread(msg);
            }

            // When the message does not contain a  link
            else {
                incorrectUsage(msg);
            }
        }
    }
}