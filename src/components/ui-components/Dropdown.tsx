import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import InputText from './InputText';
import ClickAwayListener from 'react-click-away-listener';
import { FixedSizeList as List } from 'react-window';

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
	pointer-events: ${props => props.disable && 'none'};
	${props => props.disable && 'opacity: 0.2;'}
	z-index: 5;
	& > button:first-child {
		${props =>
			props.selected
				? `border-radius: ${props.radius ? props.radius : '7px 7px 0px 0px'};`
				: `border-radius: ${props.radius ? props.radius : '7px'};`}

		width: 100%;
		height: inherit;
		background-color: ${props => (props.backgroundColor ? props.backgroundColor : 'var(--disable)')};
		${props => props.selected && 'border-bottom: 1px solid var(--inactive);'}
		display: flex;
		align-items: center;
		justify-content: center;
	}
	& > div[role='list'] > div > div > button {
		width: 100%;
		background-color: ${props => (props.backgroundColor ? props.backgroundColor : 'var(--disable)')};

		height: 40px;
		border-bottom: 1px solid var(--inactive);
	}
	& > div[role='list'] > div > div > button:hover {
		background-color: var(--panels);
	}
	& > div[role='list'] > div > div > button:last-child {
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
	defaultValue,
	disable,
	resultsNumbers
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
	}, []);

	useEffect(() => {
		if (ref.current && isOpen) {
			ref.current.focus();
		}
	}, [ref, isOpen]);

	const toggleList = () => {
		setIsOpen(!isOpen);
	};

	const onClickAway = () => {
		if (isOpen) {
			toggleList();
		}
	};

	const selectItem = (item: any, value: any) => {
		setHeaderTitle(item);
		onChange(value);
		setIsOpen(false);
	};

	const Row = ({ index, style }: any) => {
		const option = options[index];
		return (
			<button style={style} type="button" key={index} onClick={e => selectItem(option, values[index])}>
				{key ? option[key] : option}
			</button>
		);
	};
	return (
		<ClickAwayListener onClickAway={onClickAway}>
			<DropdownContainer
				disable={disable}
				selected={isOpen}
				backgroundColor={backgroundColor}
				style={{ ...style }}
			>
				<button type="button" onClick={toggleList}>
					<div className="m-auto">{headerTitle}</div>
					<div className={`${isOpen ? 'selected' : ''} mr-2`}>
						<i className="fa-solid fs-22 fa-angle-down"></i>
					</div>
				</button>
				{isOpen && (
					<div role="list" className="dd-list">
						{filterDropdownList && (
							<div className="py-2 filterSearch px-2" style={{ backgroundColor: 'var(--disable)' }}>
								<InputText
									ref={ref}
									border="1px solid var(--primary)"
									onChange={filterDropdownList}
									glass
									iconRightPos={{ top: 9, right: 15 }}
								/>
								{resultsNumbers ? (
									<label className="resultsNumbers">{resultsNumbers} results</label>
								) : null}
							</div>
						)}
						<List height={300} itemCount={values.length} itemSize={44} width={'100%'}>
							{Row}
						</List>
					</div>
				)}
			</DropdownContainer>
		</ClickAwayListener>
	);
}
