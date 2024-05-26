import { accessSync, createWriteStream, existsSync, mkdir, mkdirSync, writeFileSync } from "fs";
import { readFile, readdir } from "fs/promises";
import path from "path";

export type JsonContent = null | boolean | number | string | JsonArray | JsonMap;

export interface JsonArray extends Array<JsonContent> {}
export interface JsonMap extends Record<string, JsonContent> {}

export class Database {
  collections: Record<string, JsonMap> = {};

  constructor (
    public readonly directory: string
  ) {}

  async loadCollections () {
    const files: false | string[] = await readdir(this.directory)
      .then((files) => files.filter((file) => file.endsWith('.json')))
      .catch(() => false)

    if (!files) {
      return;
    }

    for (const file of files) {
      const content = await readFile(path.resolve(this.directory, file), 'utf8');
      try {
        const json = JSON.parse(content);
        const collectionName = file.replace('.json', '');
        
        this.collections[collectionName] = json;
      } catch {
        console.error('Failed to parse JSON', file);
      }
    }
  }

  getCollection (name: string) {
    return this.collections[name];
  }

  async saveCollections () {
    for (const [name, collection] of Object.entries(this.collections)) {
      await this.saveCollection(name, collection);
    }
  }

  writeStreams = new Map<string, NodeJS.WritableStream>();
  saveCollection (name: string, collection: JsonMap) {
    const content = JSON.stringify(collection, null, 2);

    const filepath = path.resolve(this.directory, name + '.json')

    try {
      accessSync(filepath);
    } catch {
      mkdirSync(this.directory, {
        recursive: true
      });
    }

    writeFileSync(filepath, content, {
      encoding: 'utf8'
    });

    // if (!this.writeStreams.has(name)) {
    //   this.writeStreams.set(name, createWriteStream(filepath));
    // }

    // this.writeStreams.get(name)?.write(content);
    // this.writeStreams.get(name)?.write(content);
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