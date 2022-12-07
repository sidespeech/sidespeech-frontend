import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import InputText from './InputText';

const DropdownLine = styled.div<any>`
	position: relative;
	width: ${props => (props.width ? props.width : '148px')};
	height: ${props => (props.height ? props.height : '31px')};
`;

const DropdownContainer = styled.div<any>`
	font-size: ${props => (props.fontSize ? props.fontSize : 11)}px;
	font-weight: ${props => (props.fontWeight ? props.fontWeight : '400')};
	width: ${props => (props.width ? props.width : '100%')};
	height: ${props => (props.height ? props.height : '44px')};
	z-index: 5;
	& > button:first-child {
		${props =>
			props.selected
				? `border-radius: ${props.radius ? props.radius : '7px 7px 0px 0px'};`
				: `border-radius: ${props.radius ? props.radius : '7px'};`}

		width: inherit;
		height: inherit;
		background-color: ${props => (props.backgroundColor ? props.backgroundColor : 'var(--disable)')};
		${props => props.selected && 'border-bottom: 1px solid var(--inactive);'}
		display: flex;
		align-items: center;
		justify-content: center;
	}
	& > div[role='list'] {
		max-height: 20vh;
		overflow: auto;
	}
	& > div[role='list'] > button {
		width: 100%;
		background-color: ${props => (props.backgroundColor ? props.backgroundColor : 'var(--disable)')};

		height: 40px;
		border-bottom: 1px solid var(--inactive);
	}
	& > div[role='list'] > button:last-child {
		width: 100%;
		border-radius: ${props => (props.radius ? props.radius : '0px 0px 7px 7px')};
	}
`;

export default function Dropdown({
	onChange,
	options,
	key,
	values,
	style,
	filterDropdownList,
	backgroundColor,
	defaultValue
}: any) {
	const [isOpen, setIsOpen] = useState(false);
	const [headerTitle, setHeaderTitle] = useState<any>(options[0]);
	const ref = useRef<HTMLInputElement>();

	useEffect(() => {
		if (defaultValue) {
			setHeaderTitle(defaultValue);
		} else if (defaultValue === null) {
			setHeaderTitle(options[0]);
		}
	}, [defaultValue, options]);

	useEffect(() => {
		if (ref.current && isOpen) {
			ref.current.focus();
		}
	}, [ref, isOpen]);

	const toggleList = () => {
		setIsOpen(!isOpen);
	};

	const selectItem = (item: any, value: any) => {
		setHeaderTitle(item);
		onChange(value);
		setIsOpen(false);
	};

	return (
		<DropdownContainer selected={isOpen} backgroundColor={backgroundColor} style={{ ...style }}>
			<button type="button" onClick={toggleList}>
				<div className="m-auto">{headerTitle}</div>
				<div className={`${isOpen ? 'selected' : ''} mr-2`}>
					<i className="fa-solid fs-22 fa-angle-down"></i>
				</div>
			</button>
			{isOpen && (
				<div role="list" className="dd-list">
					{filterDropdownList && (
						<div className="py-2 px-2" style={{ backgroundColor: 'var(--disable)' }}>
							<InputText
								ref={ref}
								border="1px solid var(--primary)"
								onChange={filterDropdownList}
								glass
								iconRightPos={{ top: 9, right: 15 }}
							/>
						</div>
					)}
					{options.map((item: any, index: any) => (
						<button type="button" key={index} onClick={e => selectItem(item, values[index])}>
							{key ? item[key] : item}
						</button>
					))}
				</div>
			)}
		</DropdownContainer>
	);
}
