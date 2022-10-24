export interface NFT {
  name: string;
  metadata: RawMetadata;
  token_address: string;
  token_id: string;
  token_uri: string;
  description: string;
  amount: number;
  contract_type: string;
  symbol: string;
}

interface RawMetadata {
  attributes: { value: string; trait_type: string }[];
  dna: string;
  date: number;
  edition: number;
  image: string;
  name: string;
  description: string;
  compiler: string;
}
