import React, { useEffect, useState } from "react";
import { Channel } from "../../../models/Channel";
import { Colony } from "../../../models/Colony";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./admission.css";
import { apiService } from "../../../services/api.service";
import CustomSelect from "../../ui-components/CustomSelect";
import Button from "../../ui-components/Button";
import Switch from "../../ui-components/Switch";

export default function Admission({
  divCollections,
  collections,
  setSideTokenAddress,
  setSidePropertyCondition,
  setSideValueCondition,
  addDivCollection,
  removeDivCollection,
  addConditionToDivCollection
}: {
  divCollections: any;
  collections: string[];
  setSideTokenAddress: any;
  setSidePropertyCondition: any;
  setSideValueCondition: any;
  addDivCollection: any;
  removeDivCollection: any;
  addConditionToDivCollection:any;
}) {

  const dispatch = useDispatch();
  const [value, setValue] = useState(false);

  useEffect(() => {
  }, []);

  return (
    <>
      <div className="f-column mb-4">
        <label htmlFor="name" className="size-14 fw-400 mb-4 text-left">
        Admission conditions ({divCollections.length})
        </label>
        {divCollections.map((current: any, i: number) => {
          return (
            <div className="collection-item mb-3" key={i}>

              <div className="flex justify-between">
                <label className="size-14">
                  Collection
                </label>

                <label className="size-14 text-red cursor-pointer" onClick={() => removeDivCollection(i)}>
                  <i className="fa-regular fa-trash-can mr-2"></i>Remove
                </label>
              </div>

              <div className="f-row collection-name">
                <div className="f-column mt-3 mb-3">
                  <CustomSelect
                    width={"500px"}
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
                {
                  ('trait_selected' in current) ?
                    (
                      <div className='d-flex'>
                        <div className='featureBox mr-auto'>
                          <div className='flex hdBox justify-between mb-3'>
                            <label>Feature</label>

                            <label className="">
                              Required <Switch onClick={() => setValue(!value)} />
                            </label>
                          </div>

                          <div className='d-flex justify-space-between'>
                            <CustomSelect
                              width={"400px"}
                              height={"40px"}
                              radius={"10px"}
                              classes={"mr-3"}
                              valueToSet={(current['trait_selected'].length) ? current['trait_selected'] : ""}
                              fontSize={12}
                              fontWeight={700}
                              arrowPosition={{ top: 12, right: 15 }}
                              values={(current['traits_values'].length) ? ["", ...(current['traits_values'].map((item: any) => item['property']['value']))] : [""]}
                              options={(current['traits_values'].length) ? ["Select trait", ...(current['traits_values'].map((item: any) => item['property']['label']))] : ["Traits"]}
                              onChange={(event: any) => setSidePropertyCondition(event, i)}
                            />
                            <CustomSelect
                              width={"400px"}
                              height={"40px"}
                              radius={"10px"}
                              valueToSet={(current['value_selected'].length) ? current['value_selected'] : ""}
                              fontSize={12}
                              fontWeight={700}
                              arrowPosition={{ top: 12, right: 15 }}
                              values={(current['traits_values'].length) ? ["", ...((current['traits_values'].find((item: any) => item['property']['value'] === current['trait_selected']) || { values: [] })['values']).map((item: any) => item['value'])] : [""]}
                              options={(current['traits_values'].length) ? ["Select value of trait", ...((current['traits_values'].find((item: any) => item['property']['value'] === current['trait_selected']) || { values: [] })['values']).map((item: any) => item['label'])] : ["Values"]}
                              onChange={(event: any) => setSideValueCondition(event, i)}
                            />
                          </div>
                        </div>
                        <div className='featureBtn f-column align-items-center'>
                          <button className="mt-2 text-red"><i className='fa-solid fa-minus'></i></button>
                          <button className="mt-3"><i className='fa-regular fa-copy'></i></button>
                        </div>
                      </div>
                    ) :
                    (
                      <div className='addFeature' onClick={() => addConditionToDivCollection(i)}>
                        <button><i className="fa fa-plus-circle" aria-hidden="true"></i>  Add a Feature</button>
                      </div>
                    )
                }
              </div>
            </div>
          )
        })}
        <Button width={559} height={46} radius={10} background={'var(--bg-secondary-light)'} color={'var(--text-primary-light)'} onClick={() => addDivCollection()}>
          <i className='fa-solid fa-circle-plus mr-2'></i> Add a collection
        </Button>
      </div>
    </>
  );
}
