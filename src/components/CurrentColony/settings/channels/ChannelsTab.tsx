import React, { FC, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '../../../ui-components/Button';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ChannelRow from './ChannelRow';
import { Channel, ChannelType } from '../../../../models/Channel';
import { Side } from '../../../../models/Side';
import _, { orderBy } from 'lodash';
import { breakpoints, size } from '../../../../helpers/breakpoints';
import channelService from '../../../../services/api-services/channel.service';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { v4 } from 'uuid';

export const ItemTypes = {
	CHANNEL: 'channel',
	CARD: 'card'
};

const ChannelsStyled = styled.div`
	width: 100%;
	user-select: none;
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

export enum ChannelGroup {
	CURRENT,
	ADDED
}
export interface IChannelExtension extends Channel {
	group: ChannelGroup;
	sideId: string;
	dirty: boolean;
	newChannel?: boolean;
}

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
	onChangeIsVisibleChannel,
	handleMoveCard
}: {
	currentSide: Side;
	channelsNewSide?: any;
	handleRemoveChannel?: any;
	handleAddNewChannel?: any;
	onChangeNameChannel?: any;
	onChangeTypeChannel?: any;
	onChangeAuthorizeCommentsChannel?: any;
	onChangeIsVisibleChannel?: any;
	handleMoveCard?: any;
}) {
	const dispatch = useDispatch();
	const [allChannels, setAllChannels] = useState<Partial<IChannelExtension>[]>([]);

	// Remove "New" status to all channels after creation to avoid multiple animations

	useEffect(() => {
		if (allChannels.some(channel => channel.newChannel))
			setTimeout(() => {
				setAllChannels(prevState => prevState.map(channel => ({ ...channel, newChannel: false })));
			}, 500);
	}, [allChannels]);

	useEffect(() => {
		if (currentSide['channels']) {
			const orderedChannels = orderBy([...currentSide['channels']], 'index');
			setAllChannels(
				orderedChannels.map(c => {
					return { ...c, dirty: false, group: ChannelGroup.CURRENT };
				})
			);
		}
	}, []);

	useEffect(() => {
		document.addEventListener('keyup', handleOnClickEnter);
		return () => {
			document.removeEventListener('keyup', handleOnClickEnter);
		};
	}, []);

	const handleOnClickEnter = (event: any) => {
		if (event.key === 'Enter') {
			const focusedElement = document.activeElement;
			if (focusedElement) {
				if (focusedElement.tagName === 'INPUT' && focusedElement.getAttribute('type') === 'text') {
					handleAddChannel();
					var elements: any = document.querySelectorAll(".channels-container input[type='text']");
					elements[elements.length - 1].focus();
				}
			}
		}
	};

	const handleRemove = async (id: string) => {
		if (channelsNewSide) {
			handleRemoveChannel(id);
		} else {
			try {
				await channelService.removeChannels(currentSide.id, id);
				const index = _.findIndex(allChannels, c => c.id === id);
				if (index !== -1) {
					setAllChannels(current =>
						update(current, {
							$splice: [[index, 1]]
						})
					);
				}
				toast.success('Channel has been removed', { toastId: 36 });
			} catch (error) {
				toast.error('Error removing channel', { toastId: 36 });
			}
		}
	};

	const handleAddChannel = () => {
		if (channelsNewSide) {
			handleAddNewChannel();
		} else {
			if (allChannels.length >= 50) {
				toast.error('You can not create more than 50 channels.');
				return;
			}

			const newChannel: Partial<IChannelExtension> = {
				id: v4(),
				name: '',
				isVisible: true,
				newChannel: true,
				type: ChannelType.Announcement,
				sideId: currentSide.id,
				group: ChannelGroup.ADDED,
				authorizeComments: false
			};
			setAllChannels(current => update(current, { $push: [newChannel] }));
		}
	};

	const onChangeName = (event: any, id: string) => {
		if (channelsNewSide) {
			onChangeNameChannel(event, id);
		} else {
			const index = _.findIndex(allChannels, c => c.id === id);
			console.log(event.target.value, index, id, allChannels);
			if (index !== -1) {
				setAllChannels(current =>
					update(current, { [index]: { name: { $set: event.target.value }, dirty: { $set: true } } })
				);
			}
		}
	};
	const onChangeType = (value: any, id: string) => {
		if (channelsNewSide) {
			onChangeTypeChannel(value, id);
		} else {
			const index = _.findIndex(allChannels, c => c.id === id);
			if (index !== -1) {
				setAllChannels(current =>
					update(current, { [index]: { type: { $set: value }, dirty: { $set: true } } })
				);
			}
		}
	};
	const onChangeAuthorizeComments = (event: any, id: string) => {
		if (channelsNewSide) {
			onChangeAuthorizeCommentsChannel(event, id);
		} else {
			// Change name on existing channel
			const index = _.findIndex(allChannels, c => c.id === id);
			if (index !== -1) {
				setAllChannels(current =>
					update(current, {
						[index]: { authorizeComments: { $set: event.target.checked }, dirty: { $set: true } }
					})
				);
			}
		}
	};
	const onChangeIsVisible = (value: any, id: string) => {
		if (channelsNewSide) {
			onChangeIsVisibleChannel(value, id);
		} else {
			// Change name on existing channel
			const index = _.findIndex(allChannels, c => c.id === id);
			if (index !== -1) {
				setAllChannels(current =>
					update(current, { [index]: { isVisible: { $set: value }, dirty: { $set: true } } })
				);
			}
		}
	};
	const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
		if (channelsNewSide) {
			handleMoveCard(dragIndex, hoverIndex);
		} else {
			setAllChannels((prevChannels: Partial<IChannelExtension>[]) =>
				update(prevChannels, {
					$splice: [
						[dragIndex, 1],
						[hoverIndex, 0, prevChannels[dragIndex] as Partial<IChannelExtension>]
					],
					$apply: (prevChannels: Partial<IChannelExtension>[]) => {
						let start = dragIndex < hoverIndex ? dragIndex : hoverIndex;
						let end: number | undefined = (dragIndex < hoverIndex ? hoverIndex : dragIndex) + 1;
						if (end === prevChannels.length) end = undefined;
						prevChannels.slice(start, end).forEach((channel, index) => {
							channel.index = index + start;
							channel.dirty = true;
						});
						return prevChannels;
					}
				})
			);
		}
	}, []);

	const onSubmit = async () => {
		try {
			const toUpdate = _.filter(allChannels, c => c.group === ChannelGroup.CURRENT && c.dirty).map(
				c => new Channel(c)
			);
			const toCreate = _.filter(allChannels, c => c.group === ChannelGroup.ADDED);

			const updatedChannels = await channelService.updateManyChannels(currentSide.id, toUpdate);
			const createdChannels = await channelService.createManyChannels(currentSide.id, toCreate);

			setAllChannels(current =>
				update(current, {
					$apply: (prevChannels: Partial<IChannelExtension>[]) => {
						prevChannels.forEach((channel, index) => {
							channel.group = ChannelGroup.CURRENT;
							channel.dirty = false;
						});
						return prevChannels;
					}
				})
			);
			toast.success(`Saved`, {
				toastId: 4
			});
		} catch (error) {
			console.log(error);
			toast.error('Error updating channels.', { toastId: 3 });
		}
	};

	const renderChannel = useCallback(
		(channel: Channel, index: number, placeholder: boolean, newChannel?: boolean) => {
			return (
				<ChannelRow
					key={channel.id}
					channel={channel}
					index={index}
					onChangeName={onChangeName}
					handleRemove={handleRemove}
					newChannel={newChannel}
					placeholder={placeholder ? channel['name'] : undefined}
					onChangeType={onChangeType}
					onChangeAuthorizeComments={onChangeAuthorizeComments}
					onChangeIsVisible={onChangeIsVisible}
					channelsNewSide={channelsNewSide}
					moveCard={moveCard}
				/>
			);
		},
		[allChannels, channelsNewSide]
	);

	return (
		<DndProvider backend={HTML5Backend}>
			<ChannelsStyled>
				<div className="text-primary-light mb-3 text fw-600">Channels</div>
				<div className="f-column channels-container">
					{/* Existing channels */}
					{channelsNewSide &&
						channelsNewSide.map((channel: any, index: number) =>
							renderChannel(channel, index, channel.group !== ChannelGroup.ADDED, channel.newChannel)
						)}
					{allChannels.length > 0 &&
						allChannels.map((channel: any, index: number) =>
							renderChannel(channel, index, channel.group !== ChannelGroup.ADDED, channel.newChannel)
						)}
				</div>

				{/* Add new channel Section*/}
				<div style={{ paddingLeft: 25 }}>
					<Button
						classes="fade-in add-channel-btn mt-4 fw-700"
						width={'100%'}
						height={40}
						onClick={handleAddChannel}
						radius={10}
						background={'var(--panels)'}
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
							classes="fade-in save-btn"
							height={46}
							onClick={onSubmit}
							radius={10}
							color={'var(--text)'}
							disabled={allChannels.every(c => !c.dirty)}
						>
							Save{' '}
						</Button>
					) : null}
				</div>
			</ChannelsStyled>
		</DndProvider>
	);
}
