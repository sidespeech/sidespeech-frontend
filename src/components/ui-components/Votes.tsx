import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';

const VotesStyled = styled.form`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;
	& .option-wrapper {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background-color: var(--panels);
		transition: all 0.3s ease;
		border-radius: 7px;
		width: 100%;
		cursor: pointer;
		pointer-events: none;
		&.checked,
		&.user-option {
			background-color: var(--primary);
			color: var(--panels);
		}
		&.enabled {
			pointer-events: all;
			&:hover {
				background-color: var(--primary);
				color: var(--background);
				& .option-input span {
					border: 1px solid var(--black-transparency-20);
				}
			}
		}
		& .name-input-wrapper {
			display: flex;
			align-items: center;
			gap: 1rem;
			width: 100%;
			& .option-input {
				flex-shrink: 0;
				flex-grow: 0;
				position: relative;
				width: 14px;
				height: 14px;
				& input {
					position: absolute;
					opacity: 0;
				}
				& span {
					position: relative;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					height: 100%;
					border-radius: 100px;
					border: 1px solid var(--text);
				}
				& input:checked ~ span {
					border: 1px solid var(--black-transparency-20);
					&::before {
						content: '';
						position: relative;
						z-index: 2;
						width: 80%;
						height: 80%;
						border-radius: 100px;
						background-color: var(--background);
					}
				}
			}
			& .percentage {
				display: none;
			}
		}
		&.show-results {
			& .name-input-wrapper {
				justify-content: space-between;
				& .option-input {
					display: none;
				}
				& .percentage {
					display: block;
				}
			}
		}
	}
	& .vote-btn {
		max-width: fit-content;
		padding-left: 3rem;
		padding-right: 3rem;
	}
`;

interface PercentageBarProps {
	percentage: number;
}

const PercentageBar = styled.span<PercentageBarProps>`
	display: none;
	position: relative;
	width: 100%;
	height: 5px;
	border-radius: 5px;
	overflow: hidden;
	background-color: var(--black-transparency-20);
	&.show {
		display: block;
	}
	&::after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: ${props => props.percentage}%;
		border-radius: 5px;
		background-color: var(--primary);
	}
`;

interface Option {
	id: number;
	optionId: number;
	text: string;
	votes: number;
}

interface VotesProps {
	onVote?: (option: Option) => any | null;
	options: Option[];
	pollId: string;
	showUserVotedOption?: boolean;
	userVoteOptionId?: number;
}

const Votes = ({ onVote, options, pollId, showUserVotedOption, userVoteOptionId }: VotesProps) => {
	const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

	const handleSubmit = (ev: any) => {
		ev.preventDefault();
		const selectedOption = options.filter(opt => opt.optionId === selectedOptionId)?.[0];
		if (!userVoteOptionId && Object.keys(selectedOption).length && onVote) onVote(selectedOption);
	};

	return (
		<VotesStyled onSubmit={handleSubmit}>
			{options.map(option => {
				const optionChecked = selectedOptionId === option.optionId;
				const votedByUser = userVoteOptionId?.toString() === option.optionId.toString();
				const percentage = 40;

				return (
					<label
						key={option.optionId}
						className={`option-wrapper ${optionChecked ? 'checked' : ''} ${
							votedByUser && showUserVotedOption ? 'user-option' : ''
						} ${!userVoteOptionId ? 'enabled' : 'show-results'}`}
						htmlFor={option.optionId.toString()}
					>
						<div className="name-input-wrapper">
							<div className="option-input">
								<input
									checked={optionChecked}
									id={option.optionId.toString()}
									name={pollId}
									onChange={ev => setSelectedOptionId(option.optionId)}
									type="radio"
									value={option.optionId}
								/>
								<span />
							</div>
							<span className="option-label">{option.text}</span>

							<div className="percentage">{percentage}%</div>
						</div>

						<PercentageBar className={!!userVoteOptionId ? 'show' : ''} percentage={percentage} />
					</label>
				);
			})}
			{!userVoteOptionId && (
				<Button disabled={!!userVoteOptionId} classes="vote-btn">
					Vote
				</Button>
			)}
		</VotesStyled>
	);
};

export default Votes;
