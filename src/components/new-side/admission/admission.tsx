import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./admission.css";
import CustomSelect from "../../ui-components/CustomSelect";
import check from "../../../assets/check.svg";
import Button from "../../ui-components/Button";
import Switch from "../../ui-components/Switch";
import styled from "styled-components";
import Dropdown from "../../ui-components/Dropdown";
import {
  Collection,
  OpenSeaRequestStatus,
} from "../../../models/interfaces/collection";
import { fixURL } from "../../../helpers/utilities";
import CustomInputNumber from "../../ui-components/InputNumber";
import { filter, unionBy } from "lodash";

interface IAdmissionProps {
  divCollections: any[];
  collections: Collection[];
  setSideTokenAddress: any;
  setSidePropertyCondition: any;
  setSideValueCondition: any;
  addDivCollection: any;
  removeDivCollection: any;
  addConditionToDivCollection: any;
  onlyOneRequired: boolean;
  setOnlyOneRequired: any;
  setNumberOfNftNeededToDivCollection: any;
}
interface IRequirementsRadioButtonContainerProps {
  selected: boolean;
}

const Chip = styled.span`
  width: fit-content;
  border-radius: 50px;
  background-color: var(--disable);
  padding: 1px 8px;
`;
const Thumbnail = styled.img`
  border-radius: 15px;
`;
const RequirementsRadioButtonContainer = styled.div<IRequirementsRadioButtonContainerProps>`
  height: 44px;
  background-color: ${(props) =>
    props.selected ? "var(--primary)" : "var(--input)"};
  border-radius: 50px;
  flex: 1 0 0;
  align-items: center;
  color: ${(props) => (props.selected ? "var(--white)" : "var(--inactive)")};
  display: flex;
  cursor: pointer;

  & > div:first-child {
    border: 1px solid
      ${(props) => (props.selected ? "var(--white)" : "var(--inactive)")};
    width: 20px;
    height: 20px;
    border-radius: 10px;
    margin-right: 13px;
    margin-left: 13px;
    display: flex;
    justify-content: center;
    align-items: center;
    & div {
      background-color: var(--white);
      width: 12px;
      height: 12px;
      border-radius: 8px;
    }
  }
`;

export default function Admission({
  divCollections,
  collections,
  setSideTokenAddress,
  setSidePropertyCondition,
  setSideValueCondition,
  addDivCollection,
  removeDivCollection,
  addConditionToDivCollection,
  onlyOneRequired,
  setOnlyOneRequired,
  setNumberOfNftNeededToDivCollection,
}: IAdmissionProps) {
  const dispatch = useDispatch();
  const [value, setValue] = useState(false);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>(
    []
  );

  useEffect(() => {
    const selectedCollections: string[] = divCollections.map(
      (d: any) => d.collection
    );
    const filtered = collections.filter(
      (c) => !selectedCollections.includes(c.address)
    );
    setFilteredCollections(filtered);
  }, [divCollections]);

  return (
    <div className="flex  text-main">
      <div className="f-column mb-4 flex-1">
        <label htmlFor="name" className="size-14 fw-400 mb-4 text-left">
          Admission conditions ({divCollections.length})
        </label>
        <div>Collection requirements</div>
        <div className="flex gap-20 mt-2 mb-3" style={{ width: 547 }}>
          <RequirementsRadioButtonContainer
            onClick={() => setOnlyOneRequired(true)}
            selected={onlyOneRequired}
          >
            <div>{onlyOneRequired && <div></div>}</div>
            <div>1 collection from the list</div>
          </RequirementsRadioButtonContainer>
          <RequirementsRadioButtonContainer
            onClick={() => setOnlyOneRequired(false)}
            selected={!onlyOneRequired}
          >
            <div>{!onlyOneRequired && <div></div>}</div>
            <div>All collections are required</div>
          </RequirementsRadioButtonContainer>
        </div>

        <div
          className="f-column"
          style={{
            maxHeight: "50vh",
            overflow: "auto",
            width: "fit-content",
            paddingRight: 10,
          }}
        >
          {divCollections.map((current: any, i: number) => {
            return (
              <>
                <div className="collection-item mb-3" key={i}>
                  <div className="flex justify-between">
                    <label className="size-14">Collection</label>

                    <label
                      className="size-14 text-red cursor-pointer"
                      onClick={() => removeDivCollection(i)}
                    >
                      <i className="fa-regular fa-trash-can mr-2"></i>Remove
                    </label>
                  </div>

                  <div className="f-row collection-name">
                    <div className="f-column mt-3 mb-3">
                      <div className="flex">
                        <Dropdown
                          values={
                            filteredCollections.length
                              ? [
                                "",
                                ...filteredCollections.map((c) => c.address),
                              ]
                              : [current['collection']]
                          }
                          options={
                            filteredCollections.length
                              ? [
                                "Choose NFT collection",
                                ...filteredCollections.map((c, fi) => {
                                  return (
                                    <span className="flex align-center pl-3" key={fi}>
                                      {
                                        c.opensea?.imageUrl ?
                                          <Thumbnail
                                            width={27}
                                            height={27}
                                            src={c.opensea?.imageUrl}
                                            alt="thumbnail"
                                          /> :
                                          null
                                      }
                                      <span className="ml-2 mr-3">
                                        {c.name}
                                      </span>
                                      {c.opensea?.safelistRequestStatus ===
                                        OpenSeaRequestStatus.verified && (
                                          <img alt="check" src={check} />
                                        )}
                                    </span>
                                  );
                                }),
                              ]
                              :
                              (Object.keys(current['metadata']).length !== 0) ?
                                [
                                  <span className="flex align-center pl-3">
                                    {
                                      current['metadata'].opensea?.imageUrl ?
                                        <Thumbnail
                                          width={27}
                                          height={27}
                                          src={current['metadata'].opensea?.imageUrl}
                                          alt="thumbnail"
                                        /> :
                                        null
                                    }
                                    <span className="ml-2 mr-3">
                                      {current['metadata'].name}
                                    </span>
                                    {current['metadata'].opensea?.safelistRequestStatus ===
                                      OpenSeaRequestStatus.verified && (
                                        <img alt="check" src={check} />
                                      )}
                                  </span>
                                ] : ['Choose collection']

                          }
                          onChange={(address: string) =>
                            setSideTokenAddress(address, i, filteredCollections)
                          }
                        />
                        <div className="ml-4">
                          <CustomInputNumber
                            onChange={(value: number) =>
                              setNumberOfNftNeededToDivCollection(value, i)
                            }
                            defaultValue={1}
                          />
                        </div>
                      </div>
                    </div>
                    {current['features'].length ? (
                      // {/* {"trait_selected" in current ? ( */}
                      //   {/* <>
                      //     <div className="d-flex">
                      //       <div className="featureBox mr-auto">
                      //         <div className="flex hdBox justify-between mb-3">
                      //           <label>Feature</label>
                      //         </div>

                      //         <div className="d-flex justify-space-between">
                      //           <CustomSelect
                      //             width={"400px"}
                      //             height={"40px"}
                      //             radius={"10px"}
                      //             classes={"mr-3"}
                      //             valueToSet={
                      //               current["trait_selected"].length
                      //                 ? current["trait_selected"]
                      //                 : ""
                      //             }
                      //             fontSize={12}
                      //             fontWeight={700}
                      //             arrowPosition={{ top: 12, right: 15 }}
                      //             values={
                      //               current["traits_values"].length
                      //                 ? [
                      //                   "",
                      //                   ...current["traits_values"].map(
                      //                     (item: any) => item["property"]["value"]
                      //                   ),
                      //                 ]
                      //                 : [""]
                      //             }
                      //             options={
                      //               current["traits_values"].length
                      //                 ? [
                      //                   "Select trait",
                      //                   ...current["traits_values"].map(
                      //                     (item: any) => item["property"]["label"]
                      //                   ),
                      //                 ]
                      //                 : ["Traits"]
                      //             }
                      //             onChange={(event: any) =>
                      //               setSidePropertyCondition(event, i)
                      //             }
                      //           />
                      //           <CustomSelect
                      //             width={"400px"}
                      //             height={"40px"}
                      //             radius={"10px"}
                      //             valueToSet={
                      //               current["value_selected"].length
                      //                 ? current["value_selected"]
                      //                 : ""
                      //             }
                      //             fontSize={12}
                      //             fontWeight={700}
                      //             arrowPosition={{ top: 12, right: 15 }}
                      //             values={
                      //               current["traits_values"].length
                      //                 ? [
                      //                   "",
                      //                   ...(current["traits_values"].find(
                      //                     (item: any) =>
                      //                       item["property"]["value"] ===
                      //                       current["trait_selected"]
                      //                   ) || { values: [] })["values"].map(
                      //                     (item: any) => item["value"]
                      //                   ),
                      //                 ]
                      //                 : [""]
                      //             }
                      //             options={
                      //               current["traits_values"].length
                      //                 ? [
                      //                   "Select value of trait",
                      //                   ...(current["traits_values"].find(
                      //                     (item: any) =>
                      //                       item["property"]["value"] ===
                      //                       current["trait_selected"]
                      //                   ) || { values: [] })["values"].map(
                      //                     (item: any) => item["label"]
                      //                   ),
                      //                 ]
                      //                 : ["Values"]
                      //             }
                      //             onChange={(event: any) =>
                      //               setSideValueCondition(event, i)
                      //             }
                      //           />
                      //         </div>
                      //       </div>
                      //       <div className="featureBtn f-column justify-center">
                      //         <button className="mt-2 text-red">
                      //           <i className="fa-solid fa-minus"></i>
                      //         </button>
                      //       </div>
                      //     </div>
                      //     <div
                      //       className="addFeature mt-3"
                      //       onClick={() => addConditionToDivCollection(i)}
                      //     >
                      //       <button>
                      //         <i
                      //           className="fa fa-plus-circle"
                      //           aria-hidden="true"
                      //         ></i>{" "}
                      //         Add a Feature
                      //       </button>
                      //     </div>
                      //   </> */}
                      <>
                        {
                          current['features'].map((fcurrent: any, findex: number) => {
                            return (

                              <div className="d-flex mt-3" key={findex}>
                                <div className="featureBox mr-auto">
                                  <div className="flex hdBox justify-between mb-3">
                                    <label>Feature</label>
                                  </div>

                                  <div className="d-flex justify-space-between">
                                    <CustomSelect
                                      width={"400px"}
                                      height={"40px"}
                                      radius={"10px"}
                                      classes={"mr-3"}
                                      valueToSet={fcurrent["trait_selected"]}
                                      fontSize={12}
                                      fontWeight={700}
                                      arrowPosition={{ top: 12, right: 15 }}
                                      values={
                                        current["traits_values"].length
                                          ? [
                                            "",
                                            ...current["traits_values"].map(
                                              (item: any) => item["property"]["value"]
                                            ),
                                          ]
                                          : [""]
                                      }
                                      options={
                                        current["traits_values"].length
                                          ? [
                                            "Select trait",
                                            ...current["traits_values"].map(
                                              (item: any) => item["property"]["label"]
                                            ),
                                          ]
                                          : ["Traits"]
                                      }
                                      onChange={(event: any) =>
                                        setSidePropertyCondition(event, i, findex)
                                      }
                                    />
                                    <CustomSelect
                                      width={"400px"}
                                      height={"40px"}
                                      radius={"10px"}
                                      valueToSet={fcurrent["value_selected"]}
                                      fontSize={12}
                                      fontWeight={700}
                                      arrowPosition={{ top: 12, right: 15 }}
                                      values={
                                        current["traits_values"].length
                                          ? [
                                            "",
                                            ...(current["traits_values"].find(
                                              (item: any) =>
                                                item["property"]["value"] ===
                                                fcurrent["trait_selected"]
                                            ) || { values: [] })["values"].map(
                                              (item: any) => item["value"]
                                            ),
                                          ]
                                          : [""]
                                      }
                                      options={
                                        current["traits_values"].length
                                          ? [
                                            "Select value of trait",
                                            ...(current["traits_values"].find(
                                              (item: any) =>
                                                item["property"]["value"] ===
                                                fcurrent["trait_selected"]
                                            ) || { values: [] })["values"].map(
                                              (item: any) => item["label"]
                                            ),
                                          ]
                                          : ["Values"]
                                      }
                                      onChange={(event: any) =>
                                        setSideValueCondition(event, i, findex)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="featureBtn f-column justify-center">
                                  <button className="mt-2 text-red">
                                    <i className="fa-solid fa-minus"></i>
                                  </button>
                                </div>
                              </div>

                            )
                          })}
                        <div
                          className="addFeature mt-3"
                          onClick={() => addConditionToDivCollection(i)}
                        >
                          <button>
                            <i
                              className="fa fa-plus-circle"
                              aria-hidden="true"
                            ></i>{" "}
                            Add a Feature
                          </button>
                        </div>
                      </>

                    )
                      : (
                        <div
                          className="addFeature"
                          onClick={() => addConditionToDivCollection(i)}
                        >
                          <button>
                            <i
                              className="fa fa-plus-circle"
                              aria-hidden="true"
                            ></i>{" "}
                            Add a Feature
                          </button>
                        </div>
                      )}
                  </div>
                </div>{" "}
                {i < divCollections.length - 1 && (
                  <div className="flex align-center w-100 mb-3">
                    <hr className="separator"></hr>
                    <span className="mx-3">
                      {onlyOneRequired ? "OR" : "AND"}
                    </span>
                    <hr className="separator"></hr>
                  </div>
                )}
              </>
            );
          })}
        </div>
        <Button
          width={"547px"}
          height={46}
          radius={10}
          background={"var(--bg-secondary-light)"}
          color={"var(--text-primary-light)"}
          onClick={() => addDivCollection()}
        >
          <i className="fa-solid fa-circle-plus mr-2"></i> Add a collection
        </Button>
      </div>
      <div className="flex-1">
        <div>Summary</div>
        <div style={{ lineHeight: "26px" }}>
          To join this Side, you must have in your wallet : <br />
          {divCollections.map((d, index) => {
            if (!d["collection"]) return;
            return (
              <>
                <Chip>{d["numberNeeded"] || 1} NFT</Chip> From the{" "}
                <Chip>
                  {collections.find((c) => c.address === d["collection"])
                    ?.name || ""}
                </Chip>
                collection{" "}
                {d["trait_selected"] && d["value_selected"] && (
                  <>
                    {" "}
                    that has this trait : <br />
                    <Chip>
                      {d["trait_selected"]} - {d["value_selected"]}
                    </Chip>
                  </>
                )}
                <br />
                {index < divCollections.length - 1 && (
                  <>{onlyOneRequired ? "OR" : "AND"}</>
                )}
                <br />
              </>
            );
          })}
        </div>
      </div>
    </div >
  );
}
