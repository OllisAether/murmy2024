import { accessSync, mkdirSync, writeFileSync } from "fs";
import { readFile, readdir } from "fs/promises";
import path from "path";
import storage from "node-persist";
import { JsonMap } from "../../shared/json";

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
          console.error('Error parsing data', e);
          return {};
        }
      },
      forgiveParseErrors: true,
    });

    await storage.forEach((datum) => {
      console.log('Loading collection', datum.key);
      this.collections[datum.key] = datum.value;
    });
  }

  getCollection (name: string) {
    return this.collections[name] ?? {};
  }

  async saveCollections () {
    for (const [name, collection] of Object.entries(this.collections)) {
      await this.saveCollection(name, collection);
    }
  }

  async saveCollection (name: string, collection: JsonMap) {
    await storage.setItem(name, collection);
  }

  // #region Singleton
  private static instance: Database;
  public static get() {
    if (!Database.instance) {
      Database.instance = new Database(path.resolve(__dirname, '../saved'));
    }

    return Database.instance;
  }
  // #endregion
}