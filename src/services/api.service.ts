import superagent from "superagent";
import { BASE_URL } from "../constants/constants";

// Create an API Service class
class apiService {
    
    
    // Method that will manage sending the wallet connection.
    static async walletConnection(accounts : any): Promise<any>  {

        const createUser = await superagent
            .post(`${BASE_URL}/user`)
            .send({ Accounts: accounts[0], PublicNfts: "TBD" })
            .set('accept', 'json')
            .end((err, res) => {
                //console.log(res);
            });
    }
    
    static async getProfileById(id: string): Promise<any> {
      const res = await superagent.get(`${BASE_URL}/profile`).query({ id });
      return res.body;
    }
}

export {
    apiService
}
