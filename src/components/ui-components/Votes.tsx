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
		align-items: center;
		gap: 1rem;
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
	}
	& .vote-btn {
		max-width: fit-content;
		padding-left: 3rem;
		padding-right: 3rem;
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
	userVoteOptionId?: number;
}

const Votes = ({ onVote, options, pollId, userVoteOptionId }: VotesProps) => {
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

				return (
					<label
						key={option.optionId}
						className={`option-wrapper ${optionChecked ? 'checked' : ''} ${
							votedByUser ? 'user-option' : ''
						} ${!userVoteOptionId ? 'enabled' : ''}`}
						htmlFor={option.optionId.toString()}
					>
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
