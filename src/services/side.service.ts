import superagent from "superagent";
import { BASE_URL } from "../constants/constants";
import { checkUserEligibility } from "../helpers/utilities";
import { Side } from "../models/Side";
import alchemyService from "./alchemy.service";
import _ from 'lodash'

export class sideAPI {
  // get side by Id
  static async getSideById(id: string): Promise<Side> {
    const res = await superagent.get(`${BASE_URL}/side/${id}`);
    return dtoToSide(res.body);
  }
  
  // get all sides without channels
  static async getAllSides(userCollectionsData?: any, userSides?: Side[]): Promise<Side[]> {
    const res = await superagent.get(`${BASE_URL}/side`);
    const sidesList = await getSidesMetadata(res.body, userCollectionsData, userSides);
    return sidesList;
  }
  
  // get all sides by search string
  static async getSidesBySearchValue(searchValue: string, collections?: string, userCollectionsData?: any, userSides?: Side[]): Promise<Side[]> {
    const res = await superagent.get(
      `${BASE_URL}/side/search?searchValue=${searchValue}&collections=${collections && collections !== 'all' ? collections : ''}`
    );
    const sidesList = await getSidesMetadata(res.body, userCollectionsData, userSides);
    return sidesList;
  }

  // get all sides by search string
  static async getSidesByOwner(address: string, userCollectionsData?: any, userSides?: Side[]): Promise<Side[]> {
    const res = await superagent.get(
      `${BASE_URL}/side/owner?address=${address}`
    );
    const sidesList = await getSidesMetadata(res.body, userCollectionsData, userSides);
    return sidesList;
  }

  // get all featured sides
  static async getAllFeaturedSides(userCollectionsData?: any, userSides?: Side[]): Promise<Side[]> {
    const res = await superagent.get(`${BASE_URL}/side/featured`);
    const sidesList = await getSidesMetadata(res.body, userCollectionsData, userSides);
    return sidesList;
  }

  // get all sides for an array of collections
  static async getSidesByCollections(collections: string[]): Promise<{contracts: string, count: number}> {
    const res = await superagent.get(`${BASE_URL}/side/collection/sidescount?contracts=${collections?.join(',')}`);
    return res.body;
  }
}

export async function getSidesMetadata(sides: any[], userCollectionsData?: any, userSides?: Side[]): Promise<Side[]> {
  const sidesListWithoutCollections = dtoToSideList(sides);
  const sidesList: Side[] = await Promise.all(sidesListWithoutCollections.map(async (side) => {
    const conditions = Object.keys(side.conditions);
    const count = conditions.length;
    const firstCollectionAddress = conditions[0]
    let firstCollection;
    if (firstCollectionAddress) firstCollection = await alchemyService.getContractMetadata(firstCollectionAddress);
    let parsedSide = {
      ...side,
      firstCollection,
      collectionsCount: count
    }
    if (!_.isEmpty(userCollectionsData)) {
      console.log(userCollectionsData)
      const [_, eligible] = checkUserEligibility(userCollectionsData, parsedSide);
      parsedSide = {
        ...parsedSide,
        eligible
      }
    }
    if (userSides) {
      parsedSide = {
        ...parsedSide,
        joined: !!userSides?.filter(side => side.id === parsedSide.id)?.[0]
      }
    }
    return parsedSide;
  }))
  return sidesList;
}
  

function dtoToSide(s: any): Side {
  return new Side(s);
}

function dtoToSideList(sides: any[]): Side[] {
  return sides.map((s: any) => dtoToSide(s));
}
