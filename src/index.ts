import RPC from 'discord-rpc';
import { Config } from './config';

async function start() {
  const config = new Config();
  await config.load();
  if (config.values?.clientId.startsWith('<')) {
    console.log('Please setting up config.yml clientId, you could get the value from https://discord.com/developers/applications');
    return;
  }

  const client = new RPC.Client({ transport: 'ipc' });

  function updateRichPresence() {
    client.setActivity({
      details: config.values?.details,
      state: config.values?.state,
      startTimestamp: config.values?.startTimestamp,
      endTimestamp: config.values?.endTimestamp,
      largeImageKey: config.values?.largeImageKey,
      largeImageText: config.values?.largeImageText,
      smallImageKey: config.values?.smallImageKey,
      smallImageText: config.values?.smallImageText,
      partySize: config.values?.partySize,
      partyMax: config.values?.partyMax,
      buttons: config.values?.buttons,
      instance: true,
    });
  }

  client.on('ready', () => {
    setInterval(() => updateRichPresence, 3000);
    updateRichPresence();
    console.log('Start custom rich presence!');
    console.log('By CocoaCaa');
  });
  await client.login({ clientId: config.values!.clientId });
}

start().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
