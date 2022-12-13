import styled from 'styled-components';

export const Dot = styled.div`
	width: 15px;
	height: 15px;
	color: white;
	background-color: var(--red);
	weight: 700;
	font-size: 10px;
	border-radius: 8px;
	display: flex;
	z-index: 100;
	justify-content: center;
	align-items: center;
	padding: 3px 1px 2px 0px;
	width: 15px;
	height: 15px;
	font-size: 10px;
	weight: 700;
	border-radius: 50%;
	background-color: #ff4927;
	color: #fff;
	animation: bell 1s 1s both infinite;
	@keyframes bell {
		0% {
			transform: rotate(0);
		}
		10% {
			transform: rotate(30deg);
		}
		20% {
			transform: rotate(0);
		}
		80% {
			transform: rotate(0);
		}
		90% {
			transform: rotate(-30deg);
		}
		100% {
			transform: rotate(0);
		}
	}
`;

interface IRoundedImageContainerProps {
	width: string;
	height: string;
	radius: number;
}
export const RoundedImageContainer = styled.div<IRoundedImageContainerProps>`
	width: ${props => props.width};
	height: ${props => props.height};
	min-width: ${props => props.width};
	min-height: ${props => props.height};
	background-color: var(--input);
	border: 1px solid black;
	border-radius: ${props => props.radius}px;
	margin: 0px 12px;
	overflow: hidden;
	font-size: 62px;
	font-weight: 700;
	text-transform: uppercase;
	text-align: center;
	line-height: 106px;
	& img {
		object-fit: cover;
		height: 100%;
	}
`;
