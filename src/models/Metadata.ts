import { Side } from "./Side";


export class Metadata {
  id?:string;
  address: string;
  traitProperty: string;
  traitValue: string;
  numberNeeded: number;
  required: boolean;
  side: Side;

  constructor(_data: any) {
    this.id = _data.id;
    this.address = _data.address;
    this.traitProperty = _data.traitProperty;
    this.traitValue = _data.traitValue;
    this.numberNeeded = _data.numberNeeded;
    this.required = _data.required;
    this.side = _data.side;
  }
}
