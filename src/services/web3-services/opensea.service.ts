let instance: OpenseaService;
class OpenseaService {
  private constructor() {}

  static getInstance() {
    if (!instance) instance = new OpenseaService();
    return instance;
  }

  async getContractData(address: string): Promise<any> {
    const res = await fetch(
      `https://api.opensea.io/api/v1/asset_contract/${address}`
    );
    const body = await res.json();
    return body;
  }
  async getCollectionData(slug: string): Promise<any> {
    const res = await fetch(`https://api.opensea.io/api/v1/collection/${slug}`);
    const body = await res.json();
    return body;
  }
}
export default OpenseaService.getInstance();
