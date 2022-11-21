import { useEffect, useState } from "react";
import styled from "styled-components";
import { fixURL } from "../../helpers/utilities";

import defaultPP from "../../assets/default-pp.webp";
import hexagon from "../../assets/hexagon.svg";
import { SpanElipsis } from "../GeneralSettings/Account/Avatar";

const UserAvatarContainer = styled.div`
  background: var(--input);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const UserAvatar = ({ nft, name }: any) => {
  const [url, setUrl] = useState<string>(defaultPP);

  useEffect(() => {
    if (nft && nft.metadata && nft.metadata.image) {
      setUrl(fixURL(nft.metadata.image));
    } else {
      setUrl(defaultPP);
    }
  }, [nft]);

  return (
    <UserAvatarContainer>
      <img width={313} height={313} src={url} style={{ objectFit: "cover" }} />
      <div
        className="flex align-center justify-center py-3"
        style={{ margin: "auto" }}
      >
        <img src={hexagon} className="mr-3" />
        {name && nft ? (
          <>
            <SpanElipsis title={nft.token_id} className="mr-2 size-12">#{nft.token_id}</SpanElipsis>
            <span className="size-12">{name}</span>
          </>
        ) : (
          <span>No avatar selected</span>
        )}
      </div>
    </UserAvatarContainer>
  );
};
