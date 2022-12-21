import React, { useState } from 'react';
import styled from 'styled-components';
import { compareAsc, format, formatDistance } from 'date-fns';

import { getRandomId, reduceWalletAddressForColor } from '../../../helpers/utilities';
import { Poll } from '../../../models/Poll';
import ClampLines from '../../ui-components/ClampLines';
import UserBadge from '../../ui-components/UserBadge';
import Comments from '../shared-components/Comments';
import { Comment } from '../../../models/Comment';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/app.store';
import { sum } from 'lodash';
import { breakpoints, size } from '../../../helpers/breakpoints';
import pollService from '../../../services/api-services/poll.service';
import Votes from '../../ui-components/Votes';
import useWalletAddress from '../../../hooks/useWalletAddress';

const PollItemStyled = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: fit-content;
	gap: 0.5rem;
	color: var(--text);
	padding: 1rem;
	${breakpoints(
		size.lg,
		`{
            padding: 1rem;
          }`
	)}
	&.border-top {
		border-top: 1px solid var(--disable);
	}
	.poll-item_container {
		width: 350px;
		.poll-description {
			position: relative;
			padding: 0 1rem;
			margin: 1rem 0;
			.success-message {
				color: var(--green);
			}
			.progress-message {
				color: var(--warning);
			}
			&::before {
				content: '';
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				width: 3px;
				border-radius: 3px;
			}
			&.finished::before {
				background-color: var(--green);
			}
			&.progress::before {
				background-color: var(--warning);
			}
		}
	}
	&.thread {
		max-height: 100%;
		overflow-y: scroll;
		padding-bottom: 4rem;
	}
`;

interface PollItemProps {
	authorizeComments?: boolean;
	className?: string;
	handleVote?: any;
	isThread: boolean;
	isFirstItem?: boolean;
	poll: Poll;
	sideId: string;
}

const PollItem = ({ authorizeComments, className, handleVote, isFirstItem, isThread, poll, sideId }: PollItemProps) => {
	const { walletAddress } = useWalletAddress();
	const [comments, setComments] = useState<Comment[]>([]);

	const { account } = useSelector((state: RootState) => state.user);

	// This will handle sending an comment to the api.
	const handleComment = async (value: string) => {
		// This will need to be made dynamic.
		const creatorAddress = account;
		try {
			const newComment = await pollService.commentPoll(value, creatorAddress, poll.id);
			setComments([...comments, newComment]);
		} catch (error) {
			console.error(error);
			toast.error('There has been an error when commenting this poll', {
				toastId: getRandomId()
			});
		}
	};

	const customTheme = {
		textColor: 'var(--text)',
		mainColor: 'var(--primary)',
		backgroundColor: 'var(--disable)',
		alignment: 'center'
	};

	const participants = poll.pollOption?.reduce((prevCount: number, next: any) => {
		return prevCount + next.votes.length || 0;
	}, 0);

	const thePollOptions = poll.pollOption?.map((option: any, index: any) => {
		return {
			id: index,
			optionId: option.id,
			text: option.text,
			votes: sum(option.votes.map((v: any) => v.power))
		};
	});

	const isExpired = compareAsc(new Date(), new Date(poll.endDate)) === 1;
	const finishedVoting = isExpired;

	// We'll check if the user has voted.
	const userVoteOptionId = poll.votes?.filter(v => v.voterId === walletAddress)?.[0]?.option?.id;

	return (
		<PollItemStyled className={`w-100 poll-item ${!isFirstItem ? 'border-top' : ''} ${className || ''}`}>
			<div className="poll-item_container fade-in">
				<div className="flex gap-20 w-100">
					<UserBadge
						check
						color={reduceWalletAddressForColor(poll.creator)}
						weight={700}
						fontSize={14}
						avatar={poll.user?.userAvatar?.metadata?.image}
						username={poll.user?.username}
					/>
					<div className="size-11 fw-500 open-sans" style={{ color: 'var(--inactive)' }}>
						{formatDistance(new Date(Number.parseInt(poll.createdAt || '2022-09-11')), new Date(), {
							addSuffix: true
						})}
					</div>
				</div>

				<div
					className={`flex justify-between align-start poll-description ${
						finishedVoting ? 'finished' : 'progress'
					}`}
				>
					<div className="f-column">
						<p className="size-14">{poll.proposalTitle}</p>
						{finishedVoting ? (
							<p className="success-message size-12">
								Completed the {format(new Date(poll.endDate), 'MM/dd/yyyy')}
							</p>
						) : (
							<p className="progress-message size-12">
								In progress - End on {format(new Date(poll.endDate || '2022-09-11'), 'MM/dd/yyyy')}
							</p>
						)}
					</div>

					<p className="size-13 fw-500 open-sans" style={{ color: 'var(--inactive)' }}>
						{participants} participants
					</p>
				</div>

				<ClampLines className="mb-2">{poll.question}</ClampLines>

				<div className="flex poll-override">
					<Votes
						onVote={!!userVoteOptionId ? null : handleVote}
						options={thePollOptions}
						pollId={poll.id}
						userVoteOptionId={userVoteOptionId}
					/>
				</div>
			</div>

			{authorizeComments && (
				<Comments
					channel={poll}
					comments={comments}
					isThread={!!isThread}
					handleComment={handleComment}
					sideId={sideId || ''}
				/>
			)}
		</PollItemStyled>
	);
};

export default PollItem;
