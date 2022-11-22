import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { fixURL } from "../../../helpers/utilities";
import { NFT } from "../../../models/interfaces/nft";

import defaultPP from "../../../assets/default-pp.webp";
import hexagon from "../../../assets/hexagon.svg";

const ProfileLabel = styled.label`
  min-width: 70px;
  min-height: 70px;
  max-width: 70px;
  max-height: 70px;
  cursor: pointer;
  background: var(--bg-secondary-dark);
  border: 2px dashed var(--bg-primary-light);
  border-radius: 100px;
  text-align: center;
  color: var(--bg-primary-light);
  overflow: hidden;
`;

export const SpanElipsis = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 51px;
  overflow: hidden;
`;

export const ProfilePictureData = styled.div`
  min-height: 39px;
  width: 245px;
  border-radius: 7px;
  border: 1px solid rgba(125, 166, 220, 0.1);
  display: flex;
  align-items: center;
  padding: 8px 12px;
`;

export default function Avatar({
  nft,
  collectionName,
}: {
  nft: NFT | null;
  collectionName: string | undefined;
}) {
  const [url, setUrl] = useState<string>(defaultPP);

  useEffect(() => {
    if (nft && nft.metadata && nft.metadata.image) {
      setUrl(fixURL(nft.metadata.image));
    }
  }, [nft]);

  return (
    <div className="flex align-center">
      <ProfileLabel className="f-column align-center justify-center">
        <img
          style={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
          }}
          src={url}
          alt="file-form"
        />
      </ProfileLabel>
      <div className="f-column ml-3">
        <label className="text-primary-light fw-600 f-column align-center justify-center ">
          Choose an NFT from your wallet as your profile avatar
        </label>
        {collectionName && nft && (
          <ProfilePictureData className="mt-3">
            <img src={hexagon} className="mr-3" />
            <>
              <SpanElipsis className="mr-2 size-12">#{nft.token_id}</SpanElipsis>
              <span className="size-12">{collectionName}</span>
            </>
          </ProfilePictureData>
        )}
      </div>
    </div>
  );
}
