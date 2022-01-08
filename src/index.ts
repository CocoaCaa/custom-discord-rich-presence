import RPC from 'discord-rpc';
import { Config } from './config';
import { askQuestion } from './utils';

async function start() {
  const config = new Config();
  await config.load();
  if (config.values?.clientId.startsWith('<')) {
    console.log('Please setting up config.yml clientId, you could get the value from https://discord.com/developers/applications');
    await askQuestion('Press any key to continue...');
    return;
  }

  const client = new RPC.Client({ transport: 'ipc' });

  function updateRichPresence() {
    client.setActivity({
      details: config.values?.details,
      state: config.values?.state,
      startTimestamp: 1, // Need hardcoded for overriding other application
      endTimestamp: new Date().getTime() + 1, // Need hardcoded for overriding other application
      largeImageKey: config.values?.largeImageKey,
      largeImageText: config.values?.largeImageText,
      smallImageKey: config.values?.smallImageKey,
      smallImageText: config.values?.smallImageText,
      partySize: config.values?.partySize,
      partyMax: config.values?.partyMax,
      buttons: config.values?.buttons,
    });
  }

  client.on('ready', () => {
    setInterval(() => updateRichPresence(), 2000);
    updateRichPresence();
    console.log('Start custom rich presence!');
    console.log('By CocoaCaa');
  });
  await client.login({ clientId: config.values!.clientId });
}

start().catch(async (err) => {
  console.error(err.message ?? err);
  await askQuestion('Press any key to continue...');
  process.exit(1);
});
