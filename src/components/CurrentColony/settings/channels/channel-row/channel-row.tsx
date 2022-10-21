import React, { useEffect, useState } from "react";
import { Channel } from "../../../../../models/Channel";
import InputText from "../../../../ui-components/InputText";
import "./channel-row.css"

export default function ChannelRow({
  channel,
  index,
  onChangeName,
  handleRemove,
  placeholder
}: {
  channel: Channel;
  index:number;
  onChangeName:any;
  handleRemove:any;
  placeholder?:string;
  }) {

  // const [channels, setChannels] = useState<any>(initialChannelsState);

  useEffect(() => {
  }, []);

  return (
    <>
      <div className="flex mt-2 align-center" key={channel['id']}>
        <i className="fa-solid fa-grip-lines fa-lg mr-2 text-secondary-dark"></i>
        <InputText
          placeholderColor="var(--text-primary-light)"
          parentWidth={"43rem"}
          height={40}
          width="60%"
          bgColor="var(--bg-secondary-dark)"
          glass={false}
          placeholder={"# " + channel['name']}
          onChange={(e: any) => onChangeName(e, index, placeholder ? true : false)}
          radius="10px"
        />
        <i onClick={undefined} className="fa-solid fa-eye fa-xl display-icon mr-4 cursor-pointer"></i>
        <i onClick={(e) => handleRemove(index, placeholder ? true : false)} className="fa-solid fa-circle-minus fa-xl remove-icon text-red cursor-pointer"></i>
      </div>
    </>
  );
}
