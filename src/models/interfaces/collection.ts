import { NFT } from "./nft";

export class Collection {
  public address: string;
  public name: string;
  public symbol: string;
  public tokenType: string;
  public totalSupply: string;
  public openseaData: OpenSeaData;
  public nfts: NFT[] = [];
  constructor(_data: any) {
    this.address = _data.address;
    this.name = _data.contractMetadata.name;
    this.symbol = _data.contractMetadata.symbol;
    this.tokenType = _data.contractMetadata.tokenType;
    this.totalSupply = _data.contractMetadata.totalSupply;
    this.openseaData = _data.contractMetadata.openSea;
  }

  getCollectionProperties() {
    return this.nfts.reduce(function (filtered: any, current) {
      const metadata = current["metadata"];
      console.log(metadata, filtered);
      if (metadata["attributes"]) {
        const attributes = metadata["attributes"];
        if (Array.isArray(attributes)) {
          for (let attribute of attributes) {
            let property_exists =
              filtered.filter(function (o: any) {
                return o["property"]["value"] == attribute["trait_type"];
              }).length > 0;
              console.log(property_exists,"property_exist")
            if (property_exists) {
              for (let element of filtered) {
                if (element["property"]["value"] == attribute["trait_type"]) {
                  let value_exists =
                    element["values"].filter(function (o: any) {
                      return o["value"] == attribute["value"];
                    }).length > 0;
                  if (!value_exists)
                    element["values"].push({
                      label: attribute["value"],
                      value: attribute["value"],
                    });
                }
              }
            } else {
              filtered.push({
                property: {
                  label: attribute["trait_type"],
                  value: attribute["trait_type"],
                },
                values: [
                  { label: attribute["value"], value: attribute["value"] },
                ],
              });
            }
          }
        }
      }
      return filtered;
    }, []);
  }
}

interface OpenSeaData {
  floorPrice: number;
  collectionName: string;
  safelistRequestStatus: OpenSeaRequestStatus;
  imageUrl: string;
  description: string;
  externalUrl: string;
  twitterUsername: string;
  discordUrl: string;
  lastIngestedAt: string;
}

enum OpenSeaRequestStatus {
  verified = "verified",
  approved = "approved",
  requested = "requested",
  not_requested = "not_requested",
}
