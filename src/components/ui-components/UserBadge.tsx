import React, { useRef, useState } from "react";
import {
  reduceWalletAddress,
  reduceWalletAddressForColor,
} from "../../helpers/utilities";
import checkImg from "../../assets/check.svg";
import styled from "styled-components";
import connectionDot from "../../assets/connection.svg";
import Avatar, { ProfilePictureData } from "../GeneralSettings/Account/Avatar";
import defaultPP from "../../assets/default-pp.webp";
import copyAll from "../../assets/copy_all.svg";
import hexagon from "../../assets/hexagon.svg";
import check from "../../assets/check.svg";
import ReactTooltip from "react-tooltip";
import Button from "./Button";
interface IWalletAddressProps {
  weight: number;
  fontSize: number;
  color?: string;
}

const WalletAddress = styled.span<IWalletAddressProps>`
  font-weight: ${(props) => props.weight};
  font-size: ${(props) => props.fontSize}px;
  margin-left: 0.25rem;
  color: ${(props) =>
    props.color ? props.color : "var(--text-primary-light)"};
`;

export default function UserBadge({
  address,
  weight,
  fontSize,
  color,
  check,
  connect,
  username,
  avatar,
}: {
  address?: string;
  weight: number;
  fontSize: number;
  color?: string;
  check?: boolean;
  connect?: boolean;
  username?: string;
  avatar?: string | undefined;
}) {
  return (
    <div className="flex align-center">
      <img
        className="profile-round-small mr-1"
        title={address}
        src={avatar || defaultPP}
      >
        {/* {check && <img alt="verified" src={checkImg} />} */}
        {connect && (
          <img
            style={{ bottom: 0, right: 0 }}
            alt="verified"
            src={connectionDot}
          />
        )}
      </img>

      <WalletAddress color={color} weight={weight} fontSize={fontSize}>
        {address ? reduceWalletAddress(address) : username}
      </WalletAddress>
    </div>
  );
}
