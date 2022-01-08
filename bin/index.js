"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_rpc_1 = __importDefault(require("discord-rpc"));
const config_1 = require("./config");
const clientId = '817629597700849725';
async function start() {
    const config = new config_1.Config();
    await config.load();
    const client = new discord_rpc_1.default.Client({ transport: 'ipc' });
    function updateRichPresence() {
        client.setActivity({
            ...config.values,
            instance: true,
        });
    }
    client.on('ready', () => {
        setInterval(() => updateRichPresence, 3000);
        updateRichPresence();
        console.log('Start custom rich presence!');
    });
    await client.login({ clientId });
}
start().catch((err) => {
    console.error(err);
    process.exit(1);
});
