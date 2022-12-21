

export enum Type {
  onChain, 
  offChain
}

export class CategoryProposal {
  public id?: string;
  public name: string;
  public type: Type;

  constructor(_data: any) {
    this.id = _data.id;
    this.name = _data.name;
    this.type = _data.type;
  }
}
