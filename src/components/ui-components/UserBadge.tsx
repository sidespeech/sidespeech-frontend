// import React, { useRef, useState } from "react";
import {
	reduceWalletAddress
	// reduceWalletAddressForColor,
} from '../../helpers/utilities';
// import checkImg from "../../assets/check.svg";
import styled from 'styled-components';
import connectionDot from '../../assets/connection.svg';
// import Avatar, { ProfilePictureData } from "../GeneralSettings/Account/Avatar";
import defaultPP from '../../assets/default-pp.png';
// import copyAll from "../../assets/copy_all.svg";
// import hexagon from "../../assets/hexagon.svg";
// import check from "../../assets/check.svg";
// import ReactTooltip from "react-tooltip";
// import Button from "./Button";
interface IWalletAddressProps {
	weight: number;
	fontSize: number;
	color?: string;
}

const WalletAddress = styled.span<IWalletAddressProps>`
	font-weight: ${props => props.weight};
	font-size: ${props => props.fontSize}px;
	margin-left: 0.25rem;
	color: ${props => (props.color ? props.color : 'var(--text)')};
`;

const PictureRoundedContainer = styled.img<any>`
	width: ${props => (props.width ? props.width : 20)}px;
	height: ${props => (props.width ? props.width : 20)}px;
	border-radius: ${props => (props.width ? props.width / 2 : 10)}px;
	position: relative;
	& > img {
		position: absolute;
		bottom: -2px;
		right: -2px;
		width: 8px;
	}
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
	width,
	onClickPicture,
	onClickName
}: {
	address?: string;
	weight: number;
	fontSize: number;
	color?: string;
	check?: boolean;
	connect?: boolean;
	username?: string;
	avatar?: string | undefined;
	width?: number;
	onClickPicture?: () => void;
	onClickName?: any;
}) {
	const handleClickName = (e: any) => {
		e.stopPropagation();
		if (onClickName) {
			onClickName();
		}
	};
	const handleClickPicture = (e: any) => {
		e.stopPropagation();
		console.log(typeof onClickPicture);
		if (typeof onClickPicture === 'function') {
			console.log('picture');
			onClickPicture();
		}
	};

	return (
		<div className="flex align-center">
			<PictureRoundedContainer
				onClick={handleClickPicture}
				width={width}
				className="mr-1"
				title={address}
				src={avatar || defaultPP}
			/>
			{/* {check && <img alt="verified" src={checkImg} />} */}
			{connect && (
				<span className="user-status">
					<img src={connectionDot} />
				</span>
			)}
			<WalletAddress color={color} weight={weight} fontSize={fontSize}>
				{address ? reduceWalletAddress(address) : username}
			</WalletAddress>
		</div>
	);
}
