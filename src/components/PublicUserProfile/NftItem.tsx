import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fixURL } from '../../helpers/utilities';
import { Collection, OpenSeaRequestStatus } from '../../models/interfaces/collection';
import { NFT } from '../../models/interfaces/nft';
import defaultPP from '../../assets/default-pp.png';
import check from '../../assets/check_circle.svg';
import { breakpoints, size } from '../../helpers/breakpoints';

export const NftItem = ({ nft, collection }: { nft: NFT; collection: Collection }) => {
    const [url, setUrl] = useState<string>(defaultPP);

    useEffect(() => {
        if (nft && nft.metadata && nft.metadata.image) {
            setUrl(fixURL(nft.metadata.image));
        }
    }, [nft]);

    return (
        <NftItemContainer>
            <img className="nft-img" src={url} />
            <NftData>
                <div>#{nft.token_id}</div>
                {collection && (
                    <div>
                        {collection.getName()}
                        {collection.safelistRequestStatus === OpenSeaRequestStatus.verified && (
                            <img src={check} />
                        )}
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
    padding: 1rem;
    color: var(--text);
`;
export const NftItemContainer = styled.div`
    display: flex;
    flex-direction: column;
    background: var(--black-transparency-20);
    border-radius: 10px;
    overflow: hidden;
    width: 100%;
    max-width: 200px;
    ${breakpoints(
        size.md,
        `{
        width: 50%;
    }`
    )}
    ${breakpoints(
        size.lg,
        `{
        max-width: 251px;
    }`
    )}
    & .nft-img {
        width: 100%;
        height: auto;
        min-height: 150px;
        max-height: 250px;
        object-fit: cover;
        ${breakpoints(
            size.lg,
            `{
            height: 251px;
        }`
        )}
    }
`;
