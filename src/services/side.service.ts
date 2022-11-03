import superagent from "superagent";
import { BASE_URL } from "../constants/constants";
import { Side } from "../models/Side";

export class sideAPI {
  // get side by Id
  static async getSideById(id: string): Promise<Side> {
    const res = await superagent.get(`${BASE_URL}/side/${id}`);
    return dtoToSide(res.body);
  }
  // get all sides without channels
  static async getAllSides(): Promise<Side[]> {
    const res = await superagent.get(`${BASE_URL}/side`);
    return dtoToSideList(res.body);
  }
  // get all featured sides
  static async getAllFeaturedSides(): Promise<Side[]> {
    const res = await superagent.get(`${BASE_URL}/side/featured`);
    return dtoToSideList(res.body);
  }
}
  

function dtoToSide(s: any): Side {
  return new Side(s);
}

function dtoToSideList(sides: any[]): Side[] {
  return sides.map((s: any) => dtoToSide(s));
}
