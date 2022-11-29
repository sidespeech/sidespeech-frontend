import _ from "lodash";
import { BASE_URL } from "../../constants/constants";
import { Collection } from "../../models/interfaces/collection";
import { BaseApiService } from "./base-api.service";

// Create an API Service class
let instance: CollectionService;
class CollectionService extends BaseApiService {

  static getInstance() {
    if (!instance) instance = new CollectionService();
    return instance;
  }

  async savedCollections(collections: Collection[]) {
    const copy = _.cloneDeep(collections);

    const data = copy.map((c: any) => {
      c.opensea = JSON.stringify(c.opensea);
      return c;
    });
    const res = await this.post(`${BASE_URL}/collection/many`).send({
      collections: data,
    });
    return res;
  }

  async getAllCollections(): Promise<Collection[]> {
    const res = await this.get(`${BASE_URL}/collection`);
    return res.body;
  }

  async getCollectionByAddress(address: string): Promise<Collection> {
    const res = await this.get(`${BASE_URL}/collection/${address}`);
    return new Collection(res.body);
  }
  async getManyCollectionsByAddress(
    addresses: string[]
  ): Promise<Collection[]> {
    const res = await this.get(`${BASE_URL}/collection/getMany`).query({
      addresses,
    });
    return res.body.map((b: any) => new Collection(b));
  }
}

export default CollectionService.getInstance();
