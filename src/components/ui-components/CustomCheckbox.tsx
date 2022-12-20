import React, { MouseEventHandler } from 'react';
import styled from 'styled-components';

interface CustomCheckboxStyledProps {
	labelPosition?: 'left' | 'right' | 'top';
	size?: 'sm' | 'default';
}

const CustomCheckboxStyled = styled.div<CustomCheckboxStyledProps>`
	.checkbox-container {
		display: flex;
		align-items: center;
		flex-direction: ${props =>
			props.labelPosition === 'right' ? 'row-reverse' : props.labelPosition === 'top' ? 'column' : 'row'};
		position: relative;
		gap: 0.5rem;
		height: ${props => (props.size === 'sm' ? '15px' : '20px')};
		cursor: pointer;
		font-size: 1rem;
		color: var(--text);
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		& span {
			font-size: ${props => (props.size === 'sm' ? '12px' : '1rem')};
			white-space: nowrap;
		}
		& input {
			position: absolute;
			opacity: 0;
			cursor: pointer;
			height: 0;
			width: 0;
			&:checked ~ .checkmark {
				background-color: var(--primary);
				&:after {
					opacity: 1;
				}
			}
		}
		& .checkmark {
			position: relative;
			flex-shrink: 0;
			height: 100%;
			width: ${props => (props.size === 'sm' ? '15px' : '20px')};
			background-color: var(--input);
			border: 1px solid var(--inactive);
			border-radius: 5px;
			&:after {
				content: '';
				position: absolute;
				transition: opacity 0.2s ease;
				opacity: 0;
				left: ${props => (props.size === 'sm' ? '4px' : '7px')};
				top: ${props => (props.size === 'sm' ? '2px' : '3px')};
				width: 5px;
				height: ${props => (props.size === 'sm' ? '8px' : '10px')};
				border: 1px solid var(--white);
				border-width: 0 3px 3px 0;
				-webkit-transform: rotate(45deg);
				-ms-transform: rotate(45deg);
				transform: rotate(45deg);
			}
		}
		&:hover input ~ .checkmark {
			transition: background-color 0.2s ease;
		}
	}
`;

interface CustomCheckboxProps {
	className?: string;
	id?: string;
	isChecked?: boolean;
	label?: string;
	labelPosition?: 'left' | 'right' | 'top';
	name?: string;
	onClick?: MouseEventHandler | undefined;
	size?: 'sm' | 'default';
	style?: object;
}

export default function CustomCheckbox({
	className,
	id,
	isChecked,
	label,
	labelPosition,
	name,
	onClick,
	size = 'default',
	style
}: CustomCheckboxProps) {
	return (
		<CustomCheckboxStyled className={className} id={id} labelPosition={labelPosition} size={size} style={style}>
			<label htmlFor={name} className="checkbox-container">
				<span>{label}</span>
				<input type="checkbox" name={name} id={name} defaultChecked={isChecked} onClick={onClick} />
				<span className="checkmark"></span>
			</label>
		</CustomCheckboxStyled>
	);
}
