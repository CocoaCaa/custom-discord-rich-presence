import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import joi from 'joi';

export interface ConfigValues {
  clientId: string;
  details?: string;
  state?: string;
  startTimestamp?: number;
  endTimestamp?: number;
  largeImageKey?: string;
  largeImageText?: string;
  smallImageKey?: string;
  smallImageText?: string;
  partySize?: number;
  partyMax?: number;
  buttons?: [{ label: string; url: string }, { label: string; url: string }];
}

const schema = joi.object<ConfigValues>({
  clientId: joi.string().required(),
  details: joi.string().optional(),
  state: joi.string().optional(),
  startTimestamp: joi.number().optional(),
  endTimestamp: joi.number().optional(),
  largeImageKey: joi.string().optional(),
  largeImageText: joi.string().optional(),
  smallImageKey: joi.string().optional(),
  smallImageText: joi.string().optional(),
  partySize: joi.number().optional(),
  partyMax: joi.number().optional(),
  buttons: joi
    .array()
    .items(
      joi.object({
        label: joi.string().required(),
        url: joi.string().required(),
      })
    )
    .max(2)
    .optional(),
});

export class Config {
  static get DEFAULT(): ConfigValues {
    return {
      clientId: '<Insert you client ID from https://discord.com/developers/applications>',
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

  private path: string;
  private validValues?: ConfigValues;

  public get values() {
    return this.validValues;
  }

  constructor() {
    this.path = path.resolve(process.cwd(), 'config.yml');
  }

  public async load() {
    let configText: string;
    try {
      configText = await fs.promises.readFile(this.path, 'utf8');
    } catch {
      configText = yaml.dump(Config.DEFAULT);
      await fs.promises.writeFile(this.path, configText);
    }

    this.validValues = await schema.validateAsync(yaml.load(configText));
  }
}
