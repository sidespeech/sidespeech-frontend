import React from "react";
import {
  reduceWalletAddress,
  reduceWalletAddressForColor,
} from "../../helpers/utilities";
import checkImg from "../../assets/check.svg";
import styled from "styled-components";
import connectionDot from "../../assets/connection.svg";

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
  username
}: {
  address?: string;
  weight: number;
  fontSize: number;
  color?: string;
  check?: boolean;
  connect?: boolean;
  username?: string;
}) {
  return (
    <div className="flex align-center">
      <span
        className="profile-round-small mr-1"
        style={{ background: reduceWalletAddressForColor(address || "") }}
      >
        {/* {check && <img alt="verified" src={checkImg} />} */}
        {connect && (
          <img
            style={{ bottom: 0, right: 0 }}
            alt="verified"
            src={connectionDot}
          />
        )}
      </span>

      <WalletAddress color={color} weight={weight} fontSize={fontSize}>
        {address ? reduceWalletAddress(address) : username }
      </WalletAddress>
    </div>
  );
}
