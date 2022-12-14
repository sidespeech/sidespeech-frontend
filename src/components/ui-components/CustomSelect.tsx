import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface ISelectContainer {
	width?: string;
	height?: string;
	radius?: string;
	disable?: boolean;
}

interface ISelectCustom {
	fontSize?: number;
	fontWeight?: number;
	radius?: string;
	bgColor?: string;
}

const SelectContainer = styled.div<ISelectContainer>`
	position: relative;
	${props => props.disable && 'pointer-events: none;'}
	${props => props.disable && 'opacity: 0.2;'}
  	width: ${props => (props.width ? props.width : '148px')};
	height: ${props => (props.height ? props.height : '31px')};
	.select-arrow {
		position: absolute;
		right: 7px;
		top: 7px;
		background-color: transparent;
		border-radius: 15px;
		width: 28px;
		display: flex;
		height: 20px;
		justify-content: center;
		align-items: center;
		pointer-events: none;
	}
	.select-arrow > i {
		color: var(--text);
		transition: transform 0.1s;
		transform: rotate(0deg);
	}
`;

const SelectCustom = styled.select<ISelectCustom>`
	border-radius: ${props => (props.radius ? props.radius : '10px')};
	background: ${props => (props.bgColor ? props.bgColor : 'var(--input)')};
	width: 100%;
	padding: 5px 20px 5px 12px;
	appearance: none;
	color: var(--text);
	text-align: left;
	height: inherit;
	cursor: pointer;
	&:focus-visible {
		outline: none;
	}
	& option {
		background: var(--background);
		&:hover {
			background: var(--black-transparency-20);
		}
	}
`;

/**
 *
 * @param options - options to display in the select dropdown
 * @param key - key of the options to display if options is an array of Objects
 * @description  display a Select component with custom options. Return Object key if Key is present else return options
 */

export default function CustomSelect({
	valueToSet,
	onChange,
	options,
	key,
	values,
	defaut,
	width,
	height,
	arrowPosition,
	fontWeight,
	fontSize,
	placeholder,
	radius,
	bgColor,
	classes,
	style,
	disable
}: {
	onChange: any;
	options: any[];
	placeholder?: string;
	key?: string;
	values?: any[];
	defaut?: any;
	width?: string;
	valueToSet?: any;
	height?: string;
	arrowPosition?: any;
	fontSize?: number;
	fontWeight?: number;
	radius?: string;
	bgColor?: string;
	classes?: string;
	style?: any;
	disable?: boolean;
}) {
	const [selected, setSelected] = useState(false);
	// const [defautState, setDefautState] = useState(null);
	const [value, setValue] = useState(0);

	useEffect(() => {
		if (defaut) {
			console.log(defaut);
			setValue(defaut);
		}
	}, [defaut]);

	useEffect(() => {
		setValue(valueToSet);
	}, [valueToSet]);

	return (
		<SelectContainer
			style={{ ...style }}
			width={width}
			height={height}
			radius={radius}
			className={classes}
			disable={disable}
		>
			<SelectCustom
				fontSize={fontSize}
				bgColor={bgColor}
				fontWeight={fontWeight}
				radius={radius}
				onChange={(event: any) => {
					setValue(event.target.value);
					onChange(event);
				}}
				onClick={(event: any) => {
					setSelected(!selected);
				}}
				value={value}
			>
				{placeholder && (
					<option value="" disabled selected>
						{placeholder}
					</option>
				)}
				{options.map((o, index) => {
					return (
						<option key={index} value={values ? values[index] : index}>
							{key ? o[key] : o}
						</option>
					);
				})}
			</SelectCustom>
			<div style={arrowPosition} className="select-arrow">
				<i className="fa-solid fs-22 fa-angle-down"></i>
			</div>
		</SelectContainer>
	);
}
