

export class Metadata {
  id?:string;
  address: string;
  traitProperty: string;
  traitValue: string;

  constructor(_data: any) {
    this.id = _data.id;
    this.address = _data.address;
    this.traitProperty = _data.traitProperty;
    this.traitValue = _data.traitValue;
  }
}
