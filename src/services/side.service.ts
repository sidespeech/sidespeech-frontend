import superagent from "superagent";
import { BASE_URL } from "../constants/constants";
import { Side } from "../models/Side";
import alchemyService from "./alchemy.service";

export class sideAPI {
  // get side by Id
  static async getSideById(id: string): Promise<Side> {
    const res = await superagent.get(`${BASE_URL}/side/${id}`);
    return dtoToSide(res.body);
  }
  
  // get all sides without channels
  static async getAllSides(): Promise<Side[]> {
    const res = await superagent.get(`${BASE_URL}/side`);
    const sidesListWithoutCollections = dtoToSideList(res.body);
    const sidesList: Side[] = await Promise.all(sidesListWithoutCollections.map(async (side) => {
      const conditions = Object.keys(side.conditions);
      const count = conditions.length;
      const firstCollectionAddress = conditions[0]
      let firstCollection;
      if (firstCollectionAddress) firstCollection = await alchemyService.getContractMetadata(firstCollectionAddress);
      const parsedSide = {
        ...side,
        firstCollection,
        collectionsCount: count
      }
      return parsedSide;
    }))
    return sidesList;
  }
  
  // get all sides by search string
  static async getSidesBySearchValue(searchValue: string, collections?: string): Promise<Side[]> {
    const res = await superagent.get(
      `${BASE_URL}/side/search?searchValue=${searchValue}&collections=${collections && collections !== 'all' ? collections : ''}`
    );
    const sidesListWithoutCollections = dtoToSideList(res.body);
    const sidesList: Side[] = await Promise.all(sidesListWithoutCollections.map(async (side) => {
      const conditions = Object.keys(side.conditions);
      const count = conditions.length;
      const firstCollectionAddress = conditions[0]
      let firstCollection;
      if (firstCollectionAddress) firstCollection = await alchemyService.getContractMetadata(firstCollectionAddress);
      const parsedSide = {
        ...side,
        firstCollection,
        collectionsCount: count
      }
      return parsedSide;
    }))
    return sidesList;
  }

  // get all featured sides
  static async getAllFeaturedSides(): Promise<Side[]> {
    const res = await superagent.get(`${BASE_URL}/side/featured`);
    const sidesListWithoutCollections = dtoToSideList(res.body);
    const sidesList: Side[] = await Promise.all(sidesListWithoutCollections.map(async (side) => {
      const conditions = Object.keys(JSON.parse(side.conditions));
      const count = conditions.length;
      const firstCollectionAddress = conditions[0]
      let firstCollection;
      if (firstCollectionAddress) firstCollection = await alchemyService.getContractMetadata(firstCollectionAddress);
      const parsedSide = {
        ...side,
        firstCollection,
        collectionsCount: count
      }
      return parsedSide;
    }))
    return sidesList;
  }

  // get all sides for an array of collections
  static async getSidesByCollections(collections: string[]): Promise<{contracts: string, count: number}> {
    const res = await superagent.get(`${BASE_URL}/side/collection/sidescount?contracts=${collections?.join(',')}`);
    return res.body;
  }
}
  

function dtoToSide(s: any): Side {
  return new Side(s);
}

function dtoToSideList(sides: any[]): Side[] {
  return sides.map((s: any) => dtoToSide(s));
}
