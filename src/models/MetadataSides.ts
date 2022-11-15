import { Metadata } from "./Metadata";
import { Side } from "./Side";


export class MetadataSides {
  metadata:Metadata;
  metadataId: string;
  sideId: string;
  numberNeeded: number;
  required: boolean;
  side: Side;

  constructor(_data: any) {
    this.metadata = _data.id;
    this.metadataId = _data.address;
    this.sideId = _data.traitProperty;
    this.numberNeeded = _data.numberNeeded;
    this.required = _data.required;
    this.side = _data.side;
  }
}
