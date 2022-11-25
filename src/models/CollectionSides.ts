import { Collection } from "./interfaces/collection";
import { Side } from "./Side";


export class collectionSides {
  collection:Collection;
  collectionId: string;
  sideId: string;
  numberNeeded: number;
  side: Side;

  constructor(_data: any) {
    this.collection = _data.collection;
    this.collectionId = _data.collectionId;
    this.sideId = _data.sideId;
    this.numberNeeded = _data.numberNeeded;
    this.side = _data.side;
  }
}
