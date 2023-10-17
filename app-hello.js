
const env = require('dotenv').config();
const nodeEnv=process.env.NODE_ENV;
const { App } = require('@slack/bolt');
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN
});

app.message('hello', async ({ message, say }) => {
    if (nodeEnv == 'development') console.log(message);
    await say(`Hello, <@${message.user}>!`);
  });

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);
    console.log('Bolt app started!');
})();

app.command('/hello', async({ack, respond, command})=>{ // ①)
    // Reply in advance.
    await ack(); // ②
    // Check the contents of command
    if (nodeEnv == 'development') console.log(command); // ③
    // Reply to command
    await respond(`Hello <@${command.user_id}>! `); // (4)
    });