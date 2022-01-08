"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const js_yaml_1 = __importDefault(require("js-yaml"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    details: joi_1.default.string().optional(),
    state: joi_1.default.string().optional(),
    startTimestamp: joi_1.default.number().optional(),
    endTimestamp: joi_1.default.number().optional(),
    largeImageKey: joi_1.default.string().optional(),
    largeImageText: joi_1.default.string().optional(),
    smallImageKey: joi_1.default.string().optional(),
    smallImageText: joi_1.default.string().optional(),
    partySize: joi_1.default.number().optional(),
    partyMax: joi_1.default.number().optional(),
    buttons: joi_1.default
        .array()
        .items(joi_1.default.object({
        label: joi_1.default.string().required(),
        url: joi_1.default.string().required(),
    }))
        .max(2)
        .optional(),
});
class Config {
    constructor() {
        this.path = path_1.default.resolve(process.cwd(), 'config.yml');
    }
    static get DEFAULT() {
        return {
            details: 'Sample Details',
            state: 'Sample State',
            startTimestamp: 0,
            endTimestamp: 0,
            largeImageKey: 'my_large_image_key',
            largeImageText: 'Sample large image text',
            smallImageKey: 'my_small_image_key',
            smallImageText: 'Sample small image text',
            partySize: 1,
            partyMax: 1,
            buttons: [
                { label: 'First button', url: 'https://sample-url-on-here.tld' },
                { label: 'Second button', url: 'https://sample-url-on-here.tld' },
            ],
        };
    }
    get values() {
        return this.validValues;
    }
    async load() {
        let configText;
        try {
            configText = await fs_1.default.promises.readFile(this.path, 'utf8');
        }
        catch {
            configText = js_yaml_1.default.dump(Config.DEFAULT);
            await fs_1.default.promises.writeFile(this.path, configText);
        }
        this.validValues = await schema.validateAsync(js_yaml_1.default.load(configText));
    }
}
exports.Config = Config;
