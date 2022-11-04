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
    const sidesList: Side[] = [];
    sidesListWithoutCollections.forEach(async (side) => {
      const conditions = Object.keys(side.conditions)
      const count = conditions.length;
      const firstCollectionAddress = conditions[0]
      let firstCollection;
      if (firstCollectionAddress) firstCollection = await alchemyService.getContractMetadata(firstCollectionAddress);
      const parsedSide = {
        ...side,
        firstCollection: firstCollection.collectionName,
        collectionsCount: count
      }
      sidesList.push(parsedSide);
    })
    return sidesList;
  }
  // get all featured sides
  static async getAllFeaturedSides(): Promise<Side[]> {
    const res = await superagent.get(`${BASE_URL}/side/featured`);
    const sidesListWithoutCollections = dtoToSideList(res.body);
    const sidesList: Side[] = [];
    sidesListWithoutCollections.forEach(async (side) => {
      const conditions = Object.keys(side.conditions)
      const count = conditions.length;
      const firstCollectionAddress = conditions[0]
      let firstCollection;
      if (firstCollectionAddress) firstCollection = await alchemyService.getContractMetadata(firstCollectionAddress);
      const parsedSide = {
        ...side,
        firstCollection: firstCollection.collectionName,
        collectionsCount: count
      }
      sidesList.push(parsedSide);
    })
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
