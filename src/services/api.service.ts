import superagent from "superagent";
import { BASE_URL } from "../constants/constants";

// Create an API Service class
class apiService {
    
    
    // Method that will manage sending the wallet connection.
    static walletConnection(accounts : any) {
        
        console.log(accounts)
        
        superagent
        .post('/user')
        .send({ address: accounts[0], }) // sends a JSON post body
        .set('accept', 'json')
        .end((err, res) => {
            // Calling the end function will send the request
            
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
