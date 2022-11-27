import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./eligibility.css";
import styled from "styled-components";
import { RootState } from "../../../../redux/store/app.store";
import { checkUserEligibility, fixURL } from "../../../../helpers/utilities";
import { OpenSeaRequestStatus } from "../../../../models/interfaces/collection";
import check from "../../../../assets/check.svg";
import { Side } from "../../../../models/Side";

const ConditionsContainer = styled.div`
  width: 100%;
  border-radius: 10px;
  background-color: #00000033;
  padding: 23px 28px 10px 30px;
`;

const ConfitionItem = styled.div`
  width: 100%;
  padding: 19px 0px 23px 0px;
  display: flex;
`;

const ErrorNft = styled.div`
  background: var(--disable);
  border: 1px dashed var(--inactive);
  border-radius: 7px;
  height: 62px;
  width: 62px;
  left: 72px;
`;

const NftImage = styled.img`
  min-height: 62px;
  min-width: 62px;
  height: 62px;
  width: 62px;
  border-radius: 7px;
  object-fit: cover;
`;
const Chip = styled.span`
  width: fit-content;
  border-radius: 5px;
  background-color: var(--disable);
  padding: 1px 8px;
`;

export default function Eligibility({ side }: { side: Side }) {
  const { userCollectionsData, user } = useSelector(
    (state: RootState) => state.user
  );

  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [details, setDetails] = useState<any>([]);

  useEffect(() => {
    if (userCollectionsData && side) {
      const [res, isEligible] = checkUserEligibility(userCollectionsData, side);
      setIsEligible(isEligible);
      setDetails(res);
    }
  }, [userCollectionsData, side]);

  if (!userCollectionsData) return <></>;

  return (
    <ConditionsContainer>
      <div className="fw-700 mb-4">Conditions</div>
      <div
        className="w-100"
        style={{
          maxHeight: "30vh",
          overflow: "auto",
          paddingRight: 10,
          paddingTop: 10,
        }}
      >
        {Object.values(details).map((d: any) => {
          const isError = d.find((item: any) => item.type.includes("error"));
          return d.map((v: any) => {
            if (v.type.includes("number") && d.length > 1) return;
            const nft = v.usefulNfts ? v.usefulNfts[0] : null;
            const num = v.usefulNfts?.length - 1;
            const collection = (side.collectionSides.find((c) => c.collectionId === v.id))!['collection'];
            // const isError = v.type.includes("error");
            return (
              <>
                <div className="f-column">
                  <div
                    className="flex justify-between align-center"
                    style={{
                      borderBottom: "1px solid var(--disable)",
                      paddingBottom: 10,
                    }}
                  >
                    <div className="flex align-center">
                      {" "}
                      <span className="mr-2">-</span>
                      {collection?.opensea?.collectionName || collection?.name } {" "}
                      {collection?.opensea?.safelistRequestStatus ===
                        OpenSeaRequestStatus.verified && (
                        <img
                          alt="check"
                          width={18}
                          className="ml-2"
                          src={check}
                        />
                      )}
                    </div>
                    {isError ? (
                      <i className="fa-solid fa-circle-xmark text-red size-18"></i>
                    ) : (
                      <i className="fa-solid fa-circle-check text-green size-18"></i>
                    )}
                  </div>
                  <ConfitionItem>
                    {v.type.includes("error") && <ErrorNft />}
                    {v.type.includes("success") && (
                      <NftImage
                        src={fixURL(nft.metadata.image)}
                        alt="nft visual"
                      />
                    )}

                    <div className="f-column justify-evenly ml-3">
                      {v.type.includes("success") && (
                        <div>
                          <span>
                            {collection.name} #{nft.token_id}{" "}
                            {num > 0 && <Chip> +{num}</Chip>}
                          </span>
                        </div>
                      )}
                      <div>
                        <span
                          className={`${
                            isError ? "text-red" : "text-green"
                          } mr-5`}
                        >
                          {isError ? (
                            <i className="fa-solid fa-xmark mr-1"></i>
                          ) : (
                            <i className="fa-solid fa-check mr-1"></i>
                          )}
                          1{" - "}
                          {v.property}
                        </span>
                        <span>{v.value}</span>
                      </div>
                    </div>
                  </ConfitionItem>
                </div>
              </>
            );
          });
        })}
      </div>
    </ConditionsContainer>
  );
}
