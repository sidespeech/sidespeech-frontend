import { useState, useEffect } from "react";
import styled from "styled-components";
import { fixURL } from "../../helpers/utilities";
import { Collection, OpenSeaRequestStatus } from "../../models/interfaces/collection";
import { NFT } from "../../models/interfaces/nft";
import defaultPP from "../../assets/default-pp.webp";
import check from "../../assets/check.svg";

export const NftItem = ({ nft, collection }: { nft: NFT; collection: Collection }) => {
    const [url, setUrl] = useState<string>(defaultPP);
  
    useEffect(() => {
      if (nft && nft.metadata && nft.metadata.image) {
        setUrl(fixURL(nft.metadata.image));
      }
    }, [nft]);
  
    return (
      <NftItemContainer className="f-column">
        <img width={251} height={251} src={url} style={{ objectFit: "cover" }} />
        <NftData>
          <div >#{nft.token_id}</div>
          {collection && (
            <div >
              {collection.name}
              {collection.opensea?.safelistRequestStatus ===
                OpenSeaRequestStatus.verified && <img src={check} />}
            </div>
          )}
        </NftData>
      </NftItemContainer>
    );
  };
  
  
  
  export const NftData = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 12px;
    color: var(--text)
  
  `;
  export const NftItemContainer = styled.div`
    background: var(--input);
    border-radius: 10px;
    overflow: hidden;
  `;