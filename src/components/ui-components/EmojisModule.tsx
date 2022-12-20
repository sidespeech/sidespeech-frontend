import React from 'react';
import styled from 'styled-components';
import emojisArray from '../../assets/emojisArray';

const EmojisModuleStyled = styled.div`
	position: absolute;
	display: flex;
	flex-direction: column;
	height: 400px;
	width: 324px;
	overflow: hidden;
	bottom: 50px;
	right: 0;
	background-color: var(--panels);
	padding: 0.5rem;
	padding-bottom: 0;
	border-radius: 6px;
	& .emojis-menu {
		flex: 1 1 0;
		overflow-x: hidden;
		overflow-y: scroll;
		scrollbar-width: thin;
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		grid-gap: 1rem;
		padding: 0;
		& li {
			list-style: none;
			cursor: pointer;
			text-align: center;
			font-size: 1.5rem;
		}
	}
`;

interface EmojisModulePropTypes {
	onAddEmoji: (emoji: string) => void;
}

const EmojisModule = (props: EmojisModulePropTypes) => {
	return (
		<EmojisModuleStyled>
			<ul className="emojis-menu">
				{emojisArray.map((emoji: string) => (
					<li onClick={() => props.onAddEmoji(emoji)}>{emoji}</li>
				))}
			</ul>
		</EmojisModuleStyled>
	);
};

export default EmojisModule;
