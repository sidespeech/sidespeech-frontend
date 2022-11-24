import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Channel, ChannelType } from "../../../../../models/Channel";
import CustomCheckbox from "../../../../ui-components/CustomCheckbox";
import CustomSelect from "../../../../ui-components/CustomSelect";
import Dropdown from "../../../../ui-components/Dropdown";
import InputText from "../../../../ui-components/InputText";
import "./channel-row.css";

const InputTextWithDropdown = styled.div`
  height: 44px;
  width: 100%;
  max-width: 408px;
  background-color: var(--input);
  display: flex;
  align-items: center;
  padding-left: 4px;
  border-radius: 7px;
`;

export default function ChannelRow({
  channel,
  index,
  onChangeName,
  handleRemove,
  placeholder,
  onChangeType,
  onChangeAuthorizeComments,
  onChangeIsVisible,
}: {
  channel: Channel;
  index: number;
  onChangeName: any;
  handleRemove: any;
  onChangeType: any;
  placeholder?: string;
  onChangeAuthorizeComments: any;
  onChangeIsVisible: any;
}) {
  // const [channels, setChannels] = useState<any>(initialChannelsState);

  useEffect(() => {}, []);

  return (
    <>
      <div className="flex mt-2 align-center text-main" key={channel["id"]}>
        <i className="fa-solid fa-grip-lines fa-lg mr-2 text-secondary-dark"></i>
        <InputTextWithDropdown>
          <CustomSelect
            bgColor="var(--disable)"
            radius="7px"
            height="36px"
            width={"35%"}
            onChange={(e: any) =>
              onChangeType(e, index, placeholder ? true : false)
            }
            valueToSet={channel["type"]}
            values={[
              ChannelType.Announcement,
              ChannelType.Poll,
              ChannelType.Textual,
            ]}
            options={["Announcement", "DAO", "Group chat"]}
          />
          <InputText
            placeholderColor="var(--text-primary-light)"
            height={40}
            parentWidth={"65%"}
            width="100%"
            bgColor="var(--bg-secondary-dark)"
            glass={false}
            value={channel["name"]}
            onChange={(e: any) =>
              onChangeName(e, index, placeholder ? true : false)
            }
            radius="10px"
          />
        </InputTextWithDropdown>
        {channel["isVisible"] ? (
          <i
            onClick={(e) => {
              onChangeIsVisible(false, index, placeholder ? true : false);
            }}
            className="fa-solid fa-eye fa-xl pointer mx-4"
          ></i>
        ) : (
          <i
            onClick={(e) => {
              onChangeIsVisible(true, index, placeholder ? true : false);
            }}
            className="fa-solid fa-eye-slash fa-xl mx-4 pointer"
          ></i>
        )}
        <i
          onClick={(e) => handleRemove(index, placeholder ? true : false)}
          className="fa-solid fa-circle-minus fa-xl remove-icon mr-4 text-red cursor-pointer"
        ></i>
        {channel["type"] !== ChannelType.Textual && (
          <div className="flex">
            <CustomCheckbox
              isChecked={channel["authorizeComments"]}
              onClick={(e: any) => {
                onChangeAuthorizeComments(e, index, placeholder ? true : false);
              }}
            />{" "}
            <span className="ml-2">Authorize comments</span>
          </div>
        )}
      </div>
    </>
  );
}
