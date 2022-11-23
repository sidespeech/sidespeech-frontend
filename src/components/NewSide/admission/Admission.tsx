import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
import { breakpoints, size } from "../../../helpers/breakpoints";

interface IAdmissionProps {
  divCollections: any[];
  collections: Collection[];
  setSideTokenAddress: any;
  setSidePropertyCondition: any;
  setSideValueCondition: any;
  onRemoveFeature:any;
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
background-color: ${(props) =>
  props.selected ? "var(--primary)" : "var(--input)"};
  border-radius: 7px;
  padding: .5rem;
  ${breakpoints(size.lg, `{
    height: 44px;
    border-radius: 50px;
  }`)}
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
    flex-shrink: 0;
    border-radius: 10px;
    margin-right: 13px;
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

const AdmissionStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  ${breakpoints(size.lg, `{
    flex-direction: row;
    justify-content: space-between;
  }`)}
  .left-side {
    width: 100%;
    ${breakpoints(size.lg, `{
      width: 60%;
      max-width: 500px;
    }`)}

    .collection-item {
      padding: 1rem;
      border-radius: 7px;
      background-color: var(--bg-secondary-dark);
      width: 100%;
      max-width: 90vw;
      ${breakpoints(size.lg, `{
        max-width: 500px;
      }`)}
      .collection-name {
        justify-content: center;
        align-items: center;
        margin: auto;
        width: 100%;
      }
      .feature-box {
        display: flex;
        gap: 1rem;
        align-items: center;
        width: 100%;
        margin: 1rem 0;
        .feature-selects {
          width: 90%;
          background-color: var(--disable);
          padding: 12px 15px;
          border-radius: 8px;
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .feature-btn {
          width: 10%;
          text-align: center;
          & button {
            background-color: transparent;
            border: none;
            & i {
              background-color: var(--bg-secondary-light);
              opacity: 0.7;
              padding: 8px;
              border-radius: 50%;
              font-size: 16px;
              cursor: pointer;
            }
          }
        }
      }
      
      .add-feature button {
        width: 100%;
        padding: 8px 0px;
        text-align: center;
        cursor: pointer;
        font-size: 17px;
        color: var(--bg-primary-light);
        background-color: var(--bg-secondary-dark);
        border: 2px dashed var(--bg-secondary-light);
        border-radius: 7px;
      }
    }
    .separator {
      width: 100%;
      height: 1px;
      background: var(--disable);
      flex: 5 0 0;
    } 
  }
  .right-side {
    width: 100%;
    ${breakpoints(size.lg, `{
      width: 40%;
      max-width: 400px;
    }`)}
  } 
`;

export default function Admission({
  divCollections,
  collections,
  setSideTokenAddress,
  setSidePropertyCondition,
  setSideValueCondition,
  onRemoveFeature,
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
    <AdmissionStyled>
      <div className="left-side">
        <label htmlFor="name" className="size-14 fw-400 mb-4 text-left">
          Admission conditions ({divCollections.length})
        </label>
        <p className="text-secondary my-3">Collection requirements</p>
        <div className="flex gap-20 mt-2 mb-3 w-100">
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
          className="f-column align-center"
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
                    
                    <label>Holders of one of these traits</label>

                    {current['features'].length ? (
                      <>
                        {
                          current['features'].map((fcurrent: any, findex: number) => {
                            return (

                              <div className="feature-box" key={findex}>
                                <div className="feature-selects mr-auto">
                                    <CustomSelect
                                      width={"100%"}
                                      height={"40px"}
                                      radius={"7px"}
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
                                      width={"100%"}
                                      height={"40px"}
                                      radius={"7px"}
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
                                
                                <div className="feature-btn f-column justify-center">
                                  <button className="mt-2 text-red" onClick={() => onRemoveFeature(i, findex)}>
                                    <i className="fa-solid fa-minus"></i>
                                  </button>
                                </div>
                              </div>

                            )
                          })}
                        <div
                          className="add-feature mt-3"
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
                          className="add-feature mt-3"
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
          width={"100%"}
          height={46}
          radius={10}
          background={"var(--bg-secondary-light)"}
          color={"var(--text-primary-light)"}
          onClick={() => addDivCollection()}
        >
          <i className="fa-solid fa-circle-plus mr-2"></i> Add a collection
        </Button>
      </div>

      <div className="right-side">
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
    </AdmissionStyled >
  );
}
