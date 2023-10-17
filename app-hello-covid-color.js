const env = require('dotenv').config();
const axios = require('axios');
const nodeEnv = process.env.NODE_ENV;
const { App } = require('@slack/bolt');
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN
});

app.message('hello', async ({ message, say }) => {
    if (nodeEnv == 'development') console.log(message);
    await say({
        text: `Hello, <@${message.user}>! 😃`,
        attachments: [
            {
                color: '#36a64f', // Green color
                text: 'Welcome to our Slack channel! 🎉',
                footer: 'Slack Bot',
            },
        ],
    });
});

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);
    console.log('Bolt app started!');
})();

app.command('/hello', async ({ ack, respond, command }) => {
    // Reply in advance.
    await ack();
    // Check the contents of the command
    if (nodeEnv == 'development') console.log(command);
    // Reply to command with a fun emoji
    await respond({
        text: '```' + `Hello <@${command.user_id}>! 😎` + '```',
        attachments: [
            {
                color: '#007acc', // Blue color
                text: 'This is a custom command response in a code block. Enjoy your day! 🌞',
                footer: 'Slack Bot',
            },
        ],
    });
});

// Define a Slash Command handler
app.command('/covid-19', async ({ command, ack, say }) => {
    await ack();

    // Extract the country name from the command text
    const country = command.text.trim().toLowerCase();

    try {
        let covidData;
        if (country === 'global') {
            covidData = await fetchCovidData('all');
        } else {
            covidData = await fetchCovidData(`countries/${country}`);
        }

        // Capitalize the first letter of the country name
        const capitalizedCountry =
            country.charAt(0).toUpperCase() + country.slice(1);

        // Respond to the Slash Command with the COVID-19 data in a code block
        await say({
            text: '```' +
                `COVID-19 Data for ${capitalizedCountry === 'Global' ? 'Global' : capitalizedCountry}:\n${covidData}` +
                '```',
            attachments: [
                {
                    color: '#ff5733', // Red color
                    text: 'This is COVID-19 data in a code block. Stay safe! 😷',
                    footer: 'COVID-19 Bot',
                },
            ],
        });
    } catch (error) {
        console.error('Error fetching COVID-19 data:', error.message);
        await say('Unable to fetch COVID-19 data at the moment. 😔');
    }
});

async function fetchCovidData(endpoint) {
    try {
        const response = await axios.get(`https://disease.sh/v3/covid-19/${endpoint}`);
        const data = response.data;

        if (endpoint === 'all') {
            return `Total Cases: ${data.cases}\nTotal Deaths: ${data.deaths}\nTotal Recovered: ${data.recovered}`;
        } else {
            return `Cases: ${data.cases}\nDeaths: ${data.deaths}\nRecovered: ${data.recovered}`;
        }
    } catch (error) {
        console.error('Error fetching COVID-19 data:', error.message);
        return 'Unable to fetch COVID-19 data at the moment. 😔';
    }
}
