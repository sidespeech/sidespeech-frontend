import React from 'react';
import styled from 'styled-components';

const SpinnerStyled = styled.div`
	width: 50px;
	height: 50px;
	border: 5px solid var(--inactive);
	border-bottom-color: transparent;
	border-radius: 50px;
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
};

const Spinner = ({ className, id, style }: SpinnerProps) => {
	return <SpinnerStyled className={className} id={id} style={style} />;
};

export default Spinner;
