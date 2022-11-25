import superagent from "superagent";
import { BASE_URL } from "../constants/constants";
import { checkUserEligibility } from "../helpers/utilities";
import { Side } from "../models/Side";
import alchemyService from "./alchemy.service";
import _ from "lodash";
import { InitialStateUpdateSide } from "../components/CurrentColony/settings/informations/Informations";

import { InitialStateSide } from "../components/NewSide/NewSide";


const post = (url: string) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return superagent.post(url);
  return superagent.post(url).auth(token, { type: "bearer" });
};
export class sideAPI {
  // get side by Id
  static async getSideById(id: string): Promise<Side> {
    const res = await superagent.get(`${BASE_URL}/side/${id}`);
    return dtoToSide(res.body);
  }

  // get side by name
  static async getSideByName(name: string): Promise<Side> {
    const res = await superagent.get(`${BASE_URL}/side/byname/${name}`);
    return dtoToSide(res.body);
  }

  // get all sides without channels
  static async getAllSides(
    userCollectionsData?: any,
    userSides?: Side[]
  ): Promise<Side[]> {
    const res = await superagent.get(`${BASE_URL}/side`);
    const sidesList = await getSidesMetadata(
      res.body,
      userCollectionsData,
      userSides
    );
    return sidesList;
  }

  // get all sides by search string
  static async getSidesBySearchValue(
    searchValue: string,
    collections?: string,
    userCollectionsData?: any,
    userSides?: Side[]
  ): Promise<Side[]> {
    const res = await superagent.get(
      `${BASE_URL}/side/search?searchValue=${searchValue}&collections=${
        collections && collections !== "all" ? collections : ""
      }`
    );
    const sidesList = await getSidesMetadata(
      res.body,
      userCollectionsData,
      userSides
    );
    return sidesList;
  }

  // get all sides by search string
  static async getSidesByOwner(
    address: string,
    userCollectionsData?: any,
    userSides?: Side[]
  ): Promise<Side[]> {
    const res = await superagent.get(
      `${BASE_URL}/side/owner?address=${address}`
    );
    const sidesList = await getSidesMetadata(
      res.body,
      userCollectionsData,
      userSides
    );
    return sidesList;
  }

  // get all featured sides
  static async getAllFeaturedSides(
    userCollectionsData?: any,
    userSides?: Side[]
  ): Promise<Side[]> {
    const res = await superagent.get(`${BASE_URL}/side/featured`);
    const sidesList = await getSidesMetadata(
      res.body,
      userCollectionsData,
      userSides
    );
    return sidesList;
  }

  // get all sides for an array of collections
  static async getSidesByCollections(
    collections: string[]
  ): Promise<{ contracts: string; sides: any[] }> {
    const res = await superagent.get(
      `${BASE_URL}/side/collection/sidescount?contracts=${collections?.join(
        ","
      )}`    
    );
    return res.body;
  }

  static async isSideNameExist(name: string): Promise<boolean> {
    const res = await superagent
      .get(`${BASE_URL}/side/name/exist`)
      .query({ name: name });
    return res.body.exist;
  }
  static async createSide(side: InitialStateSide): Promise<Side> {
    const res = await post(`${BASE_URL}/side`).send(side);
    return new Side(res["body"]);
  }

  static async updateSide(
    side: InitialStateUpdateSide,
    id: string
  ): Promise<Side> {
    const res = await superagent.patch(`${BASE_URL}/side/${id}`).send(side);
    return res["body"]["side"];
  }
}

export async function getSidesMetadata(
  sides: any[],
  userCollectionsData?: any,
  userSides?: Side[]
): Promise<Side[]> {
  const sidesListWithoutCollections = dtoToSideList(sides);
  const sidesList: Side[] = await Promise.all(
    sidesListWithoutCollections.map(async (side) => {
      const conditions = Object.keys(side.conditions);
      const count = conditions.length;
      const firstCollectionAddress = conditions[0];
      let firstCollection;
      if (firstCollectionAddress)
        firstCollection = await alchemyService.getContractMetadata(
          firstCollectionAddress
        );
      let parsedSide = {
        ...side,
        firstCollection,
        collectionsCount: count,
      };
      if (!_.isEmpty(userCollectionsData)) {
        const [_, eligible] = checkUserEligibility(
          userCollectionsData,
          parsedSide
        );
        parsedSide = {
          ...parsedSide,
          eligible,
        };
      }
      if (userSides) {
        parsedSide = {
          ...parsedSide,
          joined: !!userSides?.filter((side) => side.id === parsedSide.id)?.[0],
        };
      }
      return parsedSide;
    })
  );
  return sidesList;
}

function dtoToSide(s: any): Side {
  return new Side(s);
}

function dtoToSideList(sides: any[]): Side[] {
  return sides.map((s: any) => dtoToSide(s));
}
