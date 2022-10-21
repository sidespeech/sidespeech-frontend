export interface NFT {
    name: string,
    metadata: string;
    token_address: string;
    token_id: string;
    token_uri: string;
    owner_of: string;
    amount: number;
    token_hash: string;
    block_number_minted: string;
    contract_type: string;
    block_number: string;
    symbol: string;
    last_token_uri_sync: string;
    last_metadata_sync: string;
    minter_address: string;
}