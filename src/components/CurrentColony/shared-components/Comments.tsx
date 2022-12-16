import React, { useRef } from 'react';
import styled from 'styled-components';
import { formatDistance } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { getRandomId, reduceWalletAddressForColor } from '../../../helpers/utilities';
import { Comment } from '../../../models/Comment';
import Accordion from '../../ui-components/Accordion';
import Button from '../../ui-components/Button';
import MessageContent from '../../ui-components/MessageContent';
import MessageInput from '../../ui-components/MessageInput';
import UserBadge from '../../ui-components/UserBadge';
import _ from 'lodash';
import { Editor } from 'react-draft-wysiwyg';
import { breakpoints, size } from '../../../helpers/breakpoints';

const CommentsContainerStyled = styled.div`
	width: 100%;
	padding-left: 2rem;
	overflow: hidden;
	gap: 10px;
	display: flex;
	flex-direction: column;
	height: 100%;
	& .comments-scroll-container {
		overflow-y: scroll;
	}
`;

interface CommentInputStyledProps {
	isThread?: boolean;
}

const CommentInputStyled = styled.div<CommentInputStyledProps>`
	position: ${props => (props.isThread ? 'absolute' : 'relative')};
	bottom: 0;
	width: ${props => (props.isThread ? '90vw' : 'auto')};
	z-index: 9;
	${props =>
		breakpoints(
			size.lg,
			`{
    width: ${props.isThread ? '67vw' : 'auto'};
  }`
		)}
`;

interface CommentsProps {
	channel: any;
	comments: Comment[];
	handleComment: any;
	isThread: boolean;
	sideId: string;
}

const Comments = ({ channel, comments, handleComment, isThread, sideId }: CommentsProps) => {
	const navigate = useNavigate();

	const ref = useRef<Editor>(null);

	return (
		<>
			<Accordion
				style={{ height: 'auto', flex: '1 0' }}
				AccordionButton={() => (
					<div className="flex align-center gap-20">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								fill="var(--text)"
								d="M0.5 11.75V1.25C0.5 1.0375 0.572 0.85925 0.716 0.71525C0.8595 0.57175 1.0375 0.5 1.25 0.5H11C11.2125 0.5 11.3905 0.57175 11.534 0.71525C11.678 0.85925 11.75 1.0375 11.75 1.25V8C11.75 8.2125 11.678 8.3905 11.534 8.534C11.3905 8.678 11.2125 8.75 11 8.75H3.5L0.5 11.75ZM4.25 12.5C4.0375 12.5 3.85925 12.428 3.71525 12.284C3.57175 12.1405 3.5 11.9625 3.5 11.75V10.25H13.25V3.5H14.75C14.9625 3.5 15.1405 3.57175 15.284 3.71525C15.428 3.85925 15.5 4.0375 15.5 4.25V15.5L12.5 12.5H4.25Z"
							/>
						</svg>
						<span className="fw-700 size-10">
							{channel.comments?.length + comments.length || 0} Replies
						</span>
						{!isThread && (
							<Button
								background="var(--white-transparency-10)"
								fontSize="12px"
								height={30}
								onClick={() => navigate(`/side/${sideId}/thread/${channel.id}`)}
								radius={7}
								width="160px"
							>
								See the comments
								<svg
									className="arrow-icon ml-3"
									width="12"
									height="12"
									viewBox="0 0 12 12"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M-2.29485e-07 5.25L9.13125 5.25L4.93125 1.05L6 -2.62268e-07L12 6L6 12L4.93125 10.95L9.13125 6.75L-2.95052e-07 6.75L-2.29485e-07 5.25Z"
										fill="white"
									/>
								</svg>
							</Button>
						)}
					</div>
				)}
				hideOpenIcon
				locked
				openInitialState={!!isThread}
			>
				<CommentsContainerStyled className="mt-3">
					<div className="comments-scroll-container">
						{_.orderBy(channel.comments?.concat(comments), ['timestamp'], ['asc']).map(
							(comment: Comment) => (
								<div
									className=""
									key={comment.content + getRandomId()}
									style={{
										gap: '.5rem',
										padding: '.5rem 0px',
										borderTop: '1px solid var(--disable)'
									}}
								>
									<div className="flex gap-20 w-100">
										<UserBadge
											check
											color={reduceWalletAddressForColor(comment.creatorAddress)}
											weight={700}
											fontSize={14}
											address={comment.creatorAddress}
										/>
										<div className="size-11 fw-500 open-sans" style={{ color: '#7F8CA4' }}>
											{formatDistance(new Date(Number.parseInt(comment.timestamp)), new Date(), {
												addSuffix: true
											})}
										</div>
									</div>
									<MessageContent message={comment.content} />
								</div>
							)
						)}
					</div>
				</CommentsContainerStyled>
				<CommentInputStyled isThread={isThread}>
					<MessageInput
						id={`sendcomment-${channel.id}`}
						imageUpload
						onSubmit={handleComment}
						placeholder={'Type your message here'}
						radius="10px"
						ref={ref}
						size={14}
						weight={600}
					/>
				</CommentInputStyled>
			</Accordion>
		</>
	);
};

export default Comments;
