import superagent  from "superagent";

export class BaseApiService {

  protected post(url: string) {
    const token = localStorage.getItem("jwtToken");
    if (!token) return superagent.post(url);
    return superagent.post(url).auth(token, { type: "bearer" });
  }
  protected get(url: string) {
    const token = localStorage.getItem("jwtToken");
    if (!token) return superagent.get(url);
    return superagent.get(url).auth(token, { type: "bearer" });
  }
  protected patch(url: string) {
    const token = localStorage.getItem("jwtToken");
    if (!token) return superagent.patch(url);
    return superagent.patch(url).auth(token, { type: "bearer" });
  }
  protected delete(url: string) {
    const token = localStorage.getItem("jwtToken");
    if (!token) return superagent.delete(url);
    return superagent.delete(url).auth(token, { type: "bearer" });
  }
  protected put(url: string) {
    const token = localStorage.getItem("jwtToken");
    if (!token) return superagent.put(url);
    return superagent.put(url).auth(token, { type: "bearer" });
  }
}
