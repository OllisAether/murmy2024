import path from "path";
import storage from "node-persist";
import { JsonMap } from "../../shared/json";
import fs from "fs/promises";
import moment from "moment";
import { Bg, colorize, Fg } from "../console";

export class Database {
  collections: Record<string, JsonMap> = {};

  private constructor (
    public readonly directory: string
  ) {}

  async loadCollections () {
    await storage.init({
      dir: this.directory,
      stringify: (data) => JSON.stringify(data, null, 2),
      parse: (data) => {
        try {
          return JSON.parse(data);
        } catch (e) {
          console.error(colorize('[Database]', Fg.Yellow, Bg.Gray), 'Error parsing data', e);
          return {};
        }
      },
      forgiveParseErrors: true,
    });

    await storage.forEach((datum) => {
      console.log(colorize('[Database]', Fg.Yellow, Bg.Gray), 'Loading collection', datum.key);
      this.collections[datum.key] = datum.value;
    });
  }

  getCollection (name: string) {
    return this.collections[name];
  }

  async saveCollections () {
    console.log(colorize('[Database]', Fg.Yellow, Bg.Gray), 'Saving all collections');
    for (const [name, collection] of Object.entries(this.collections)) {
      if (!collection) {
        continue;
      }

      await this.saveCollection(name, collection, false);
    }
  }

  async saveCollection (name: string, collection: JsonMap, writeChanges = true) {
    // console.log(colorize('[Database]', Fg.Yellow, Bg.Gray), 'Saving collection', name);
    if (writeChanges) {
      this.collections[name] = collection;
    }

    await storage.setItem(name, collection)
      .catch((e) => {
        console.error(colorize('[Database]', Fg.Yellow, Bg.Gray), 'Error saving collection', name, e);
      });
  }

  public createBackups: boolean = true;
  lastBackup: number = 0;
  backupInterval: number = 1000 * 60; // 1 minute
  async createBackup (reason: string, force = false) {
    if (!force && Date.now() - this.lastBackup < this.backupInterval) {
      return;
    }

    if (!this.createBackups) {
      console.log(colorize('[Database]', Fg.Yellow, Bg.Gray), 'Skipping backup creation for', reason);
      return;
    }

    console.log(colorize('[Database]', Fg.Yellow, Bg.Gray), 'Creating backup for', reason);

    const backupDir = path.resolve(this.directory, '../backup');

    const backupDirFiles = path.resolve(backupDir, moment().format('HH-mm-ss_DD-MM-YYYY') + `_${reason.replace(/[^a-zA-Z0-9]/gi, '_')}`);
    await fs.mkdir(backupDirFiles, { recursive: true });

    for (const file of await fs.readdir(this.directory)) {
      await fs.copyFile(path.resolve(this.directory, file), path.resolve(backupDirFiles, file))
        .catch((e) => {
          console.error(colorize('[Database]', Fg.Yellow, Bg.Gray), 'Error copying file', file, e);
        });
    }

    this.lastBackup = Date.now();
  }

  // #region Singleton
  private static instance: Database;
  public static get(createBackups?: boolean) {
    if (!Database.instance) {
      Database.instance = new Database(path.resolve(__dirname, '../saved'));
    }

    if (createBackups !== undefined) {
      Database.instance.createBackups = createBackups;
    }

    return Database.instance;
  }
  // #endregion
}