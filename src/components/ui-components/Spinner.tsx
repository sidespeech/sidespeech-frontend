import React from 'react';
import styled from 'styled-components';

const SpinnerStyled = styled.div<any>`
	width: ${props => props.size * 50}px;
	height: ${props => props.size * 50}px;
	border: 5px solid ${props => (props.color ? props.color : 'var(--inactive)')};
	border-bottom-color: transparent;
	border-radius: ${props => props.size * 50}px;
	animation: 1.5s linear infinite spinner;

	@keyframes spinner {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`;

type SpinnerProps = {
	className?: string;
	id?: string;
	style?: object;
	size?: number;
	color?: string;
};

const Spinner = ({ className, id, style, size = 1, color }: SpinnerProps) => {
	return <SpinnerStyled size={size} color={color} className={className} id={id} style={style} />;
};

export default Spinner;
