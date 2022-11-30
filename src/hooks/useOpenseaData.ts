import { useEffect, useState } from "react";
import { Trait } from "../models/interfaces/collection";
import collectionService from "../services/api-services/collection.service";
import openseaService from "../services/web3-services/opensea.service";

export default function useOpenseaCollection() {
  useEffect(() => {
    async function getData() {
      // get all collection from database
      const allCollections = await collectionService.getAllCollections();
      // call opensea api every 3 second 5 requests by 5 requests to get contract data
      const slugs = await getSlug(allCollections.map((c) => c.address));
      await getTraitsFromOpensea(slugs);
    }
    getData();
  }, []);

  return true;
}
async function sleep(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function getSlug(collectionsAddress: string[]) {
  let index = 0;
  // getting their address
  let foo: any = [];
  do {
    collectionsAddress.slice(index, index + 5).forEach(async (c) => {
      const body = await openseaService.getContractData(c);
      // get the slug from the response (id of a collection in opensea)
      const slug = body.collection.slug;
      console.log(slug);
      foo = [...foo, slug];
    });
    index += 5;
    await sleep(3000);
  } while (index < collectionsAddress.length);
  const res = await Promise.all(foo);
  return res;
}

async function getTraitsFromOpensea(slugs: string[]) {
  let i = 0;
  let a: any[] = [];
  let foo2: any = [];
  // for each slug, getting all collection data from opensea
  do {
    slugs.slice(i, i + 5).forEach(async (c) => {
      const body = await openseaService.getCollectionData(c);
      const traits = body.collection.traits;
      const address = body.collection.primary_asset_contracts[0].address;
      const mappedTraits: Trait[] = [];
      // get traits from the response
      Object.entries<any>(traits).map(([key, value]) => {
        const trait: Trait = {
          type: key,
          values: Object.keys(value),
        };
        mappedTraits.push(trait);
      });
      console.log(mappedTraits);
      // update our collection with traits
      await collectionService.updateCollectionTraits(
        JSON.stringify(mappedTraits),
        address
      );
    });
    i += 5;
    await sleep(3000);
  } while (i < slugs.length);
}
