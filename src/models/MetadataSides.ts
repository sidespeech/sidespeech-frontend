import { Metadata } from "./Metadata";
import { Side } from "./Side";


export class MetadataSides {
  metadata:Metadata;
  metadataId: string;
  sideId: string;
  side: Side;

  constructor(_data: any) {
    this.metadata = _data.metadata;
    this.metadataId = _data.metadataId;
    this.sideId = _data.sideId;
    this.side = _data.side;
  }
}
