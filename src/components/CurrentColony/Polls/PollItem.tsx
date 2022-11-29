import { useState } from 'react';
import styled from 'styled-components';
import { compareAsc, format, formatDistance } from 'date-fns';
import { LeafPoll } from 'react-leaf-polls';

import { getRandomId, reduceWalletAddressForColor } from '../../../helpers/utilities';
import { Poll } from '../../../models/Poll';
import ClampLines from '../../ui-components/ClampLines';
import UserBadge from '../../ui-components/UserBadge';
import Comments from '../shared-components/Comments';
import { Comment } from '../../../models/Comment';
import { toast } from 'react-toastify';
import { apiService } from '../../../services/api.service';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/app.store';
import { sum } from 'lodash';
import { breakpoints, size } from '../../../helpers/breakpoints';

const PollItemStyled = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: fit-content;
    gap: 0.5rem;
    color: var(--text-secondary);
    padding: 1rem;
    ${breakpoints(
        size.lg,
        `{
            padding: 1rem;
          }`
    )}
    &.border-top {
        border-top: 1px solid var(--bg-secondary-light);
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
    .poll-override article {
        width: 100% !important;
    }
    .poll-override article ._cCkxB {
        position: relative;
        padding: 1rem 2rem;
        border-radius: 10px;
    }
    .poll-override article ._3gEzx {
        padding: 1rem 0.8rem;
        border-radius: 10px;
    }
    .poll-override article ._3gEzx ._is6ww {
        height: 5px;
        margin-top: 1rem;
    }
    .poll-override article ._cCkxB ._is6ww::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(100%, -50%);
        width: 14px;
        height: 14px;
        border-radius: 14px;
        border: 1px solid var(--text-secondary);
    }
    .poll-override article ._3gEzx ._is6ww p {
        padding: 0;
        transform: translate(0, -1.5rem);
    }
    .poll-override article ._cCkxB ._is6ww p {
        padding: 0 1rem;
        transform: translate(1rem, -1rem);
    }

    .poll-override article ._3gEzx span {
        top: 50%;
        transform: translateY(calc(-50% - 0.5rem));
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
    const walletAddress = window.ethereum.selectedAddress;
    const [comments, setComments] = useState<Comment[]>([]);

    const { account } = useSelector((state: RootState) => state.user);

    // This will handle sending an comment to the api.
    const handleComment = async (value: string) => {
        // This will need to be made dynamic.
        const creatorAddress = account;
        try {
            const newComment = await apiService.commentPoll(value, creatorAddress, poll.id);
            setComments([...comments, newComment]);
        } catch (error) {
            console.error(error);
            toast.error('There has been an error when commenting this poll', {
                toastId: getRandomId()
            });
        }
    };

    const customTheme = {
        textColor: 'var(--text-secondary)',
        mainColor: 'var(--primary)',
        backgroundColor: 'var(--bg-secondary-light)',
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
    const checkUserVoted = poll.votes?.some((v) => v.voterId === walletAddress);

    return (
        <PollItemStyled className={`w-100 poll-item ${!isFirstItem ? 'border-top' : ''} ${className || ''}`}>
            <div className="poll-item_container">
                <div className="flex gap-20 w-100">
                    <UserBadge
                        check
                        color={reduceWalletAddressForColor(poll.creator)}
                        weight={700}
                        fontSize={14}
                        address={poll.creator}
                    />
                    <div className="size-11 fw-500 open-sans" style={{ color: 'var(--text-secondary-dark)' }}>
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

                    <p className="size-13 fw-500 open-sans" style={{ color: 'var(--text-secondary-dark)' }}>
                        {participants} participants
                    </p>
                </div>

                <ClampLines className="mb-2">{poll.question}</ClampLines>

                <div className="flex poll-override">
                    <LeafPoll
                        type={'multiple'}
                        results={thePollOptions || []}
                        theme={customTheme}
                        isVoted={!!checkUserVoted}
                        isVotedId={walletAddress}
                        onVote={
                            !!checkUserVoted ? () => null : (callbackData: any) => handleVote(callbackData, poll.id)
                        }
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
