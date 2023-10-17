
const env = require('dotenv').config();
const axios = require('axios');
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

    app.command('/covid-19', async ({ command, ack, say }) => {
        await ack();
      
        try {
          const covidData = await fetchCovidData();
      
          // Respond to the Slash Command with the COVID-19 data
          await say(`COVID-19 Data: \n${covidData}`);
        } catch (error) {
          console.error('Error fetching COVID-19 data:', error.message);
          await say('Unable to fetch COVID-19 data at the moment.');
        }
      });
      
      async function fetchCovidData() {
        try {
          const response = await axios.get('https://disease.sh/v3/covid-19/all');
          const data = response.data;
          return `Total Cases: ${data.cases}\nTotal Deaths: ${data.deaths}\nTotal Recovered: ${data.recovered}`;
        } catch (error) {
          console.error('Error fetching COVID-19 data:', error.message);
          return 'Unable to fetch COVID-19 data at the moment.';
        }
      }