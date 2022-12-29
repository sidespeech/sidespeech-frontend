import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const SwitchStyled = styled.label`
	position: relative;
	display: inline-block;
	width: 38px;
	height: 15px;
	& input {
		opacity: 0;
		width: 0;
		height: 0;
		&:checked {
			& + .slider {
				background-color: #36da8033;
				&:before {
					-webkit-transform: translateX(22px);
					-ms-transform: translateX(22px);
					transform: translateX(22px);
					background-color: var(--green);
				}
			}
			& ~ .left-text {
				display: inline !important;
			}
			& ~ .right-text {
				display: none;
			}
		}

		&:focus + .slider {
			box-shadow: 0 0 1px #2196f3;
		}
	}
	& .slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(240, 158, 34, 0.1);
		-webkit-transition: 0.4s;
		transition: 0.4s;
		&:before {
			position: absolute;
			content: '';
			height: 8px;
			width: 8px;
			left: 4px;
			bottom: 3.5px;
			background-color: var(--warning);
			-webkit-transition: 0.4s;
			transition: 0.4s;
		}
		&.round {
			border-radius: 34px;
			&:before {
				border-radius: 50%;
			}
		}
	}
	& .left-text {
		position: absolute;
		bottom: 1px;
		left: 5px;
		font-weight: 700;
		font-size: 9px;
		line-height: 12px;
		display: none;
	}
	& .right-text {
		position: absolute;
		font-weight: 700;
		font-size: 9px;
		line-height: 12px;
		bottom: 1px;
		right: 5px;
		display: inline;
	}
`;

export default function Switch(props: any) {
	const [isChecked, setIsChecked] = useState(false);

	useEffect(() => {
		setIsChecked(props.value);
	}, [props.value]);

	const handleOnClick = (event: any) => {
		setIsChecked(!isChecked);
		props.onClick(!isChecked);
	};

	return (
		<SwitchStyled>
			<input type="checkbox" checked={isChecked} readOnly onClick={handleOnClick} />
			<span className="slider round"></span>
			<span className="left-text">{props.left || ''}</span>
			<span className="right-text">{props.right || ''}</span>
		</SwitchStyled>
	);
}
