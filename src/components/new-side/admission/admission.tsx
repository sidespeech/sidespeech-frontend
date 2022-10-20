import React, { useEffect, useState } from "react";
import { Channel } from "../../../models/Channel";
import { Colony } from "../../../models/Colony";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./admission.css";
import { apiService } from "../../../services/api.service";
import CustomSelect from "../../ui-components/CustomSelect";
import Button from "../../ui-components/Button";

export default function Admission({
  currentSide,
  divCollections,
  collections,
  setSideTokenAddress,
  tokenProperties,
  setSidePropertyCondition,
  setSideValueCondition,
  addDivCollection,
  propertySelected
}: {
  currentSide: Colony;
  divCollections: any;
  collections: string[];
  setSideTokenAddress: any;
  tokenProperties: any;
  setSidePropertyCondition: any;
  setSideValueCondition: any;
  addDivCollection: any;
  propertySelected: any;
}) {

  const dispatch = useDispatch();


  useEffect(() => {
  }, []);

  return (
    <>
      <div className="f-column mb-4">
        <label htmlFor="name" className="size-14 fw-400 mb-1 text-left">
          Collections
        </label>
        {divCollections.map((current: any, i: number) => {
          return (
            <div className="collection-item text-center" key={i}>
              <div>
                <div className="f-column mt-4 mb-3">
                  <CustomSelect
                    width={"400px"}
                    bgColor={"var(--bg-secondary-light)"}
                    radius={"10px"}
                    valueToSet={(current['collection'].length) ? current['collection'] : ""}
                    height={"40px"}
                    fontSize={12}
                    fontWeight={700}
                    arrowPosition={{ top: 12, right: 15 }}
                    values={(collections.length) ? ['', ...collections] : [""]}
                    options={(collections.length) ? ['Choose NFT collection', ...collections] : ["You don't hold any nfts"]}
                    onChange={(event: any) => setSideTokenAddress(event, i)}
                  />
                </div>

                <div className="f-column mb-3">
                  <label htmlFor="name" className="size-14 fw-400 mb-1 text-left">
                    Features
                  </label>

                  <div
                    className="flex justify-between w-100"
                    style={{ maxWidth: 400 }}
                  >
                    <CustomSelect
                      width={"400px"}
                      height={"40px"}
                      valueToSet={(current['trait_selected'].length) ? current['trait_selected'] : ""}
                      fontSize={12}
                      fontWeight={700}
                      arrowPosition={{ top: 12, right: 15 }}
                      values={(current['traits_values'].length) ? ["", ...(current['traits_values'].map((item: any) => item['property']['value']))] : [""]}
                      options={(current['traits_values'].length) ? ["Select trait", ...(current['traits_values'].map((item: any) => item['property']['label']))] : ["Select NFT Collection"]}
                      onChange={(event: any) => setSidePropertyCondition(event, i)}
                    />
                    <CustomSelect
                      width={"400px"}
                      height={"40px"}
                      valueToSet={(current['value_selected'].length) ? current['value_selected'] : ""}
                      fontSize={12}
                      fontWeight={700}
                      arrowPosition={{ top: 12, right: 15 }}
                      values={(current['traits_values'].length) ? ["", ...((current['traits_values'].find((item: any) => item['property']['value'] === current['trait_selected']) || { values: [] })['values']).map((item: any) => item['value'])] : [""]}
                      options={(current['traits_values'].length) ? ["Select value of trait", ...((current['traits_values'].find((item: any) => item['property']['value'] === current['trait_selected']) || { values: [] })['values']).map((item: any) => item['label'])] : ["Select NFT Collection"]}
                      onChange={(event: any) => setSideValueCondition(event, i)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <Button width={130} height={35} onClick={() => addDivCollection()}>
          + Add a collection
        </Button>
      </div>
    </>
  );
}
