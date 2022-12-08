import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Channel, ChannelType } from '../../../../models/Channel';
import CustomCheckbox from '../../../ui-components/CustomCheckbox';
import CustomSelect from '../../../ui-components/CustomSelect';
import Dropdown from '../../../ui-components/Dropdown';
import InputText from '../../../ui-components/InputText';
import { breakpoints, size } from '../../../../helpers/breakpoints';
import _ from 'lodash';

const ChannelRowStyled = styled.div<any>`
	display: flex;
	width: 100%;
	flex-direction: column;
	margin: 0.5rem 0;
	gap: 1rem;
	${breakpoints(
		size.md,
		`{
    flex-direction: row;
    align-items: center;
  }`
	)}
	.input-wrapper {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-shrink: 0;
	}
	.channel-actions {
		display: flex;
		gap: 1rem;
		align-items: center;
		padding-left: 2rem;
		${breakpoints(
			size.md,
			`{
      padding-left: 0;
    }`
		)}
		.action-btn {
			background-color: transparent;
			border: none;
			outline: none;
			box-shadow: none;
			width: 34px;
			height: 34px;
			border-radius: 34px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			&.visibility-btn {
				background-color: var(--disable);
			}
			&.remove-btn {
				background-color: rgba(220, 73, 100, 0.15);
			}
			&:focus {
				outline: 1px solid var(--primary);
			}
		}
	}
`;

const InputTextWithDropdown = styled.div`
	height: 44px;
	width: 100%;
	background-color: var(--input);
	display: flex;
	align-items: center;
	padding-left: 4px;
	border-radius: 7px;
	${breakpoints(
		size.md,
		`{
    width: 408px;
  }`
	)}
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
	channelsNewSide
}: {
	channel: Channel;
	index: number;
	onChangeName: any;
	handleRemove: any;
	onChangeType: any;
	placeholder?: string;
	onChangeAuthorizeComments: any;
	onChangeIsVisible: any;
	channelsNewSide: any;
}) {
	// const [channels, setChannels] = useState<any>(initialChannelsState);
	const [childIndex, setChildIndex] = useState<any>({ index: 0, count: 0 });
	const first = useRef<HTMLDivElement>();

	useEffect(() => {
		if (first.current) {
            // get parent div of this row
			const parent = first.current.parentNode;
            // get index of this row in parent children
			const index = _.indexOf(parent?.children, first.current);
            // save children count and index to use in z-index style
			setChildIndex({ index, count: parent?.children.length });
		}
	}, [channelsNewSide]);

	return (
		<ChannelRowStyled ref={first} key={channel['id']}>
			<div className="input-wrapper">
				<i className="fa-solid fa-grip-lines fa-lg text-secondary-dark"></i>
				<InputTextWithDropdown>
					<Dropdown
						onChange={(value: any) => onChangeType(value, index, placeholder ? true : false)}
						options={['Announcement', 'DAO', 'Group chat']}
						values={[ChannelType.Announcement, ChannelType.Poll, ChannelType.Textual]}
						disable={
							(channelsNewSide && !placeholder && index === 0) ||
							(!channelsNewSide && placeholder !== undefined && index === 0)
						}
						style={{
							radius: '7px',
							height: '36px',
							width: '35%',
							zIndex: childIndex.count - childIndex.index
						}}
						backgroundColor="var(--disable)"
					/>
					<InputText
						placeholderColor="var(--text)"
						height={40}
						parentWidth={'65%'}
						width="100%"
						bgColor="var(--input)"
						glass={false}
						value={channel['name']}
						onChange={(e: any) => onChangeName(e, index, placeholder ? true : false)}
						radius="10px"
					/>
				</InputTextWithDropdown>
			</div>

			<div className="channel-actions">
				{channel['isVisible'] ? (
					<button
						onClick={e => {
							onChangeIsVisible(false, index, placeholder ? true : false);
						}}
						className="action-btn visibility-btn"
					>
						<svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M9 9C9.9375 9 10.7345 8.672 11.391 8.016C12.047 7.3595 12.375 6.5625 12.375 5.625C12.375 4.6875 12.047 3.8905 11.391 3.234C10.7345 2.578 9.9375 2.25 9 2.25C8.0625 2.25 7.2655 2.578 6.609 3.234C5.953 3.8905 5.625 4.6875 5.625 5.625C5.625 6.5625 5.953 7.3595 6.609 8.016C7.2655 8.672 8.0625 9 9 9ZM9 7.65C8.4375 7.65 7.9595 7.453 7.566 7.059C7.172 6.6655 6.975 6.1875 6.975 5.625C6.975 5.0625 7.172 4.58425 7.566 4.19025C7.9595 3.79675 8.4375 3.6 9 3.6C9.5625 3.6 10.0408 3.79675 10.4347 4.19025C10.8282 4.58425 11.025 5.0625 11.025 5.625C11.025 6.1875 10.8282 6.6655 10.4347 7.059C10.0408 7.453 9.5625 7.65 9 7.65ZM9 11.25C7.175 11.25 5.5125 10.7405 4.0125 9.7215C2.5125 8.703 1.425 7.3375 0.75 5.625C1.425 3.9125 2.5125 2.54675 4.0125 1.52775C5.5125 0.50925 7.175 0 9 0C10.825 0 12.4875 0.50925 13.9875 1.52775C15.4875 2.54675 16.575 3.9125 17.25 5.625C16.575 7.3375 15.4875 8.703 13.9875 9.7215C12.4875 10.7405 10.825 11.25 9 11.25ZM9 9.75C10.4125 9.75 11.7095 9.378 12.891 8.634C14.072 7.8905 14.975 6.8875 15.6 5.625C14.975 4.3625 14.072 3.35925 12.891 2.61525C11.7095 1.87175 10.4125 1.5 9 1.5C7.5875 1.5 6.2905 1.87175 5.109 2.61525C3.928 3.35925 3.025 4.3625 2.4 5.625C3.025 6.8875 3.928 7.8905 5.109 8.634C6.2905 9.378 7.5875 9.75 9 9.75Z"
								fill="white"
							/>
						</svg>
					</button>
				) : (
					<button
						onClick={e => {
							onChangeIsVisible(true, index, placeholder ? true : false);
						}}
						className="action-btn visibility-btn"
					>
						<svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M12.075 7.97498L10.9875 6.88748C11.1 6.29998 10.9313 5.74998 10.4813 5.23748C10.0312 4.72498 9.45 4.52498 8.7375 4.63748L7.65 3.54998C7.8625 3.44998 8.078 3.37498 8.2965 3.32498C8.5155 3.27498 8.75 3.24998 9 3.24998C9.9375 3.24998 10.7345 3.57798 11.391 4.23398C12.047 4.89048 12.375 5.68748 12.375 6.62498C12.375 6.87498 12.35 7.10948 12.3 7.32847C12.25 7.54698 12.175 7.76248 12.075 7.97498ZM14.475 10.3375L13.3875 9.28748C13.8625 8.92498 14.2845 8.52798 14.6535 8.09648C15.022 7.66548 15.3375 7.17498 15.6 6.62498C14.975 5.36248 14.078 4.35923 12.909 3.61523C11.7405 2.87173 10.4375 2.49998 9 2.49998C8.6375 2.49998 8.28125 2.52498 7.93125 2.57498C7.58125 2.62498 7.2375 2.69998 6.9 2.79998L5.7375 1.63748C6.25 1.42498 6.775 1.26548 7.3125 1.15898C7.85 1.05298 8.4125 0.999976 9 0.999976C10.8875 0.999976 12.5688 1.52173 14.0438 2.56523C15.5188 3.60923 16.5875 4.96248 17.25 6.62498C16.9625 7.36248 16.5845 8.04698 16.116 8.67848C15.647 9.30947 15.1 9.86248 14.475 10.3375ZM14.85 14.95L11.7 11.8375C11.2625 11.975 10.822 12.0782 10.3785 12.1472C9.9345 12.2157 9.475 12.25 9 12.25C7.1125 12.25 5.43125 11.7282 3.95625 10.6847C2.48125 9.64073 1.4125 8.28748 0.75 6.62498C1.0125 5.96248 1.34375 5.34673 1.74375 4.77773C2.14375 4.20923 2.6 3.69998 3.1125 3.24998L1.05 1.14998L2.1 0.0999756L15.9 13.9L14.85 14.95ZM4.1625 4.29998C3.8 4.62498 3.46875 4.98123 3.16875 5.36873C2.86875 5.75623 2.6125 6.17498 2.4 6.62498C3.025 7.88748 3.92175 8.89048 5.09025 9.63398C6.25925 10.378 7.5625 10.75 9 10.75C9.25 10.75 9.49375 10.7345 9.73125 10.7035C9.96875 10.672 10.2125 10.6375 10.4625 10.6L9.7875 9.88748C9.65 9.92498 9.51875 9.95298 9.39375 9.97148C9.26875 9.99048 9.1375 9.99998 9 9.99998C8.0625 9.99998 7.2655 9.67198 6.609 9.01597C5.953 8.35948 5.625 7.56248 5.625 6.62498C5.625 6.48748 5.63425 6.35623 5.65275 6.23123C5.67175 6.10623 5.7 5.97498 5.7375 5.83748L4.1625 4.29998Z"
								fill="#B4C1D2"
								fillOpacity="0.4"
							/>
						</svg>
					</button>
				)}
				<button
					onClick={e => handleRemove(index, placeholder ? true : false)}
					className="action-btn remove-btn"
				>
					<svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M0.75 1.75V0.25H11.25V1.75H0.75Z" fill="#DC4964" />
					</svg>
				</button>
				{channel['type'] !== ChannelType.Textual && (
					<div className="flex">
						<CustomCheckbox
							isChecked={channel['authorizeComments']}
							onClick={(e: any) => {
								onChangeAuthorizeComments(e, index, placeholder ? true : false);
							}}
						/>{' '}
						<span className="ml-2">Authorize comments</span>
					</div>
				)}
			</div>
		</ChannelRowStyled>
	);
}
