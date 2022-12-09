import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '../../../ui-components/Button';
import InputText from '../../../ui-components/InputText';
import UserLine from '../../../ui-components/UserLine';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ChannelRow from './ChannelRow';
import { Channel, ChannelType } from '../../../../models/Channel';
import { Side } from '../../../../models/Side';
import _ from 'lodash';
import { breakpoints, size } from '../../../../helpers/breakpoints';
import channelService from '../../../../services/api-services/channel.service';

const ChannelsStyled = styled.div`
	width: 100%;
	.add-channel-btn {
		max-width: 500px;
	}
	.save-btn {
		margin-top: 2rem;
		max-width: 500px;
		${breakpoints(
			size.lg,
			`{
      max-width: 150px;
    }`
		)}
	}
`;

export interface InitialChannelsState {
	currents: Channel[];
	removed: string[];
	added: Channel[];
}

const initialChannelsState = {
	currents: [],
	removed: [],
	added: []
};

export default function Channels({
	currentSide,
	channelsNewSide,
	handleRemoveChannel,
	handleAddNewChannel,
	onChangeNameChannel,
	onChangeTypeChannel,
	onChangeAuthorizeCommentsChannel,
	onChangeIsVisibleChannel
}: {
	currentSide: Side;
	channelsNewSide?: any;
	handleRemoveChannel?: any;
	handleAddNewChannel?: any;
	onChangeNameChannel?: any;
	onChangeTypeChannel?: any;
	onChangeAuthorizeCommentsChannel?: any;
	onChangeIsVisibleChannel?: any;
}) {
	const dispatch = useDispatch();
	const [channels, setChannels] = useState<any>(initialChannelsState);

	useEffect(() => {
		setChannels({
			...channels,
			currents: currentSide['channels'] ? currentSide['channels'] : []
		});
	}, []);

	const handleRemove = (index: number, current = true) => {
		if (channelsNewSide) {
			handleRemoveChannel(index, current);
		} else {
			// Remove existing channel
			if (current) {
				let current_removed: Channel[] = [];
				let current_channels: Channel[] = [];
				if (channels['removed'].length) {
					current_removed = [...channels['removed']];
				}
				if (channels['currents'].length) {
					current_channels = [...channels['currents']];
				}
				if (!current_removed.includes(channels['currents'][index]['id'])) {
					current_removed.push(channels['currents'][index]['id']);
				}
				current_channels.splice(index, 1);
				setChannels({
					...channels,
					removed: current_removed,
					currents: current_channels
				});
			}
			// Remove new channel
			else {
				let current_added: Channel[] = [];
				if (channels['added'].length) {
					current_added = [...channels['added']];
				}
				current_added.splice(index, 1);
				setChannels({ ...channels, added: current_added });
			}
		}
	};

	const handleAddChannel = () => {
		if (channelsNewSide) {
			handleAddNewChannel();
		} else {
			let current_added: Partial<Channel>[] = [];
			if (channels['added'].length) {
				current_added = [...channels['added']];
			}
			current_added.push({
				name: '',
				isVisible: true,
				type: ChannelType.Announcement,
				side: currentSide
			});
			setChannels({ ...channels, added: current_added });
		}
	};

	const onChangeName = (event: any, index: number, current = true) => {
		if (channelsNewSide) {
			onChangeNameChannel(event, index, current);
		} else {
			// Change name on existing channel
			if (current) {
				let current_channels = channels['currents'];
				current_channels[index]['name'] = event.target.value;
				setChannels({ ...channels, currents: current_channels });
			}
			// Change name on new channel
			else {
				let added_channels = channels['added'];
				added_channels[index]['name'] = event.target.value;
				setChannels({ ...channels, added: added_channels });
			}
		}
	};
	const onChangeType = (value: any, index: number, current = true) => {
		if (channelsNewSide) {
			onChangeTypeChannel(value, index, current);
		} else {
			// Change name on existing channel
			if (current) {
				let current_channels = channels['currents'];
				current_channels[index]['type'] = value;
				setChannels({ ...channels, currents: current_channels });
			}
			// Change name on new channel
			else {
				let added_channels = channels['added'];
				added_channels[index]['type'] = value;
				setChannels({ ...channels, added: added_channels });
			}
		}
	};
	const onChangeAuthorizeComments = (event: any, index: number, current = true) => {
		if (channelsNewSide) {
			onChangeAuthorizeCommentsChannel(event, index, current);
		} else {
			// Change name on existing channel
			if (current) {
				let current_channels = _.cloneDeep(channels['currents']);
				current_channels[index]['authorizeComments'] = event.target.checked;
				setChannels({ ...channels, currents: current_channels });
			}
			// Change name on new channel
			else {
				let added_channels = channels['added'];
				added_channels[index]['authorizeComments'] = event.target.checked;
				setChannels({ ...channels, added: added_channels });
			}
		}
	};
	const onChangeIsVisible = (value: any, index: number, current = true) => {
		if (channelsNewSide) {
			onChangeIsVisibleChannel(value, index, current);
		} else {
			// Change name on existing channel
			if (current) {
				let current_channels = channels['currents'];
				current_channels[index]['isVisible'] = value;
				setChannels({ ...channels, currents: current_channels });
			}
			// Change name on new channel
			else {
				let added_channels = channels['added'];
				added_channels[index]['isVisible'] = value;
				setChannels({ ...channels, added: added_channels });
			}
		}
	};

	const onSubmit = async () => {
		try {
			if (channels['added'].length) {
				const addedChannels = await channelService.createManyChannels(channels['added']);
			}
			if (channels['removed'].length) {
				const removedChannels = await channelService.removeChannels(channels['removed']);
			}
			if (channels['currents'].length) {
				const updatedChannels = await channelService.updateManyChannels(channels['currents']);
			}
			toast.success(`Saved`, {
				toastId: 4
			});
		} catch (error) {
			console.log(error);
			toast.error('Error when added.', { toastId: 3 });
		}
	};

	return (
		<ChannelsStyled className="fade-in">
			<div className="text-primary-light mb-3 text fw-600">Channels</div>
			<div className="f-column channels-container">
				{/* Existing channels */}
				{channelsNewSide
					? channelsNewSide['currents'].map((channel: any, index: number) => (
							<ChannelRow
								channel={channel}
								index={index}
								onChangeName={onChangeName}
								handleRemove={handleRemove}
								placeholder={channel['name']}
								onChangeType={onChangeType}
								onChangeAuthorizeComments={onChangeAuthorizeComments}
								onChangeIsVisible={onChangeIsVisible}
								channelsNewSide={channelsNewSide}
							/>
					  ))
					: channels['currents'].map((channel: any, index: number) => (
							<ChannelRow
								channel={channel}
								index={index}
								onChangeName={onChangeName}
								handleRemove={handleRemove}
								placeholder={channel['name']}
								onChangeType={onChangeType}
								onChangeAuthorizeComments={onChangeAuthorizeComments}
								onChangeIsVisible={onChangeIsVisible}
								channelsNewSide={channelsNewSide}
							/>
					  ))}

				{/* new channels created now */}
				{channelsNewSide
					? channelsNewSide['added'].map((channel: any, index: number) => (
							<ChannelRow
								channel={channel}
								index={index}
								onChangeName={onChangeName}
								handleRemove={handleRemove}
								onChangeAuthorizeComments={onChangeAuthorizeComments}
								onChangeType={onChangeType}
								onChangeIsVisible={onChangeIsVisible}
								channelsNewSide={channelsNewSide}
							/>
					  ))
					: channels['added'].map((channel: any, index: number) => (
							<ChannelRow
								channel={channel}
								index={index}
								onChangeName={onChangeName}
								handleRemove={handleRemove}
								onChangeType={onChangeType}
								onChangeAuthorizeComments={onChangeAuthorizeComments}
								onChangeIsVisible={onChangeIsVisible}
								channelsNewSide={channelsNewSide}
							/>
					  ))}
			</div>

			{/* Add new channel Section*/}
			<div style={{ paddingLeft: 25 }}>
				<Button
					classes="add-channel-btn mt-4 fw-700"
					width={'100%'}
					height={40}
					onClick={handleAddChannel}
					radius={10}
					background={'var(--disable)'}
					color={'var(--white)'}
				>
					<svg
						className="mr-2"
						width="17"
						height="18"
						viewBox="0 0 17 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M7.66699 13.1666H9.33366V9.83329H12.667V8.16663H9.33366V4.83329H7.66699V8.16663H4.33366V9.83329H7.66699V13.1666ZM8.50033 17.3333C7.34755 17.3333 6.26421 17.1144 5.25033 16.6766C4.23644 16.2394 3.35449 15.6458 2.60449 14.8958C1.85449 14.1458 1.26088 13.2638 0.823659 12.25C0.385881 11.2361 0.166992 10.1527 0.166992 8.99996C0.166992 7.84718 0.385881 6.76385 0.823659 5.74996C1.26088 4.73607 1.85449 3.85413 2.60449 3.10413C3.35449 2.35413 4.23644 1.76024 5.25033 1.32246C6.26421 0.885237 7.34755 0.666626 8.50033 0.666626C9.6531 0.666626 10.7364 0.885237 11.7503 1.32246C12.7642 1.76024 13.6462 2.35413 14.3962 3.10413C15.1462 3.85413 15.7398 4.73607 16.177 5.74996C16.6148 6.76385 16.8337 7.84718 16.8337 8.99996C16.8337 10.1527 16.6148 11.2361 16.177 12.25C15.7398 13.2638 15.1462 14.1458 14.3962 14.8958C13.6462 15.6458 12.7642 16.2394 11.7503 16.6766C10.7364 17.1144 9.6531 17.3333 8.50033 17.3333Z"
							fill="white"
						/>
					</svg>
					Create a channel
				</Button>

				{/* Submit Button */}
				{!channelsNewSide ? (
					<Button
						width={'100%'}
						classes="save-btn"
						height={46}
						onClick={onSubmit}
						radius={10}
						color={'var(--text)'}
					>
						Save{' '}
					</Button>
				) : null}
			</div>
		</ChannelsStyled>
	);
}
