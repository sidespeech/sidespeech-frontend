import superagent from "superagent";
import { BASE_URL } from "../constants/constants";

export async function getProfileById(id: string): Promise<any> {
  const res = await superagent.get(`${BASE_URL}/profile`).query({ id });
  return res.body;
}
