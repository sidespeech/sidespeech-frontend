import superagent, { SuperAgentRequest } from "superagent";

export class BaseApiService {
  constructor() {}

  post(url: string) {
    const token = localStorage.getItem("jwtToken");
    if (!token) return superagent.post(url);
    return superagent.post(url).auth(token, { type: "bearer" });
  }
  get(url: string) {
    const token = localStorage.getItem("jwtToken");
    if (!token) return superagent.get(url);
    return superagent.get(url).auth(token, { type: "bearer" });
  }
  patch(url: string) {
    const token = localStorage.getItem("jwtToken");
    if (!token) return superagent.patch(url);
    return superagent.patch(url).auth(token, { type: "bearer" });
  }
  delete(url: string) {
    const token = localStorage.getItem("jwtToken");
    if (!token) return superagent.delete(url);
    return superagent.delete(url).auth(token, { type: "bearer" });
  }
  put(url: string) {
    const token = localStorage.getItem("jwtToken");
    if (!token) return superagent.put(url);
    return superagent.put(url).auth(token, { type: "bearer" });
  }
}
