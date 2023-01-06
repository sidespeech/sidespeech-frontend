import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import InputText from './InputText';
import ClickAwayListener from 'react-click-away-listener';
import { FixedSizeList as List } from 'react-window';
import CustomCheckbox from './CustomCheckbox';

interface IDropdownProps {
	onChange: any;
	options: any[];
	key?: string;
	values: any[];
	style?: any;
	filterByCheckbox?: any;
	checkboxDefaultValue?: boolean;
	checkboxLabel?: string;
	filterDropdownList?: any;
	backgroundColor?: string;
	defaultValue?: any;
	disable?: boolean;
	resultsNumbers?: number;
}

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
		border: 1px solid var(--disable);
		background-color: ${props => (props.backgroundColor ? props.backgroundColor : 'var(--black-transparency-20)')};
		${props => props.selected && 'border-bottom: 1px solid var(--inactive);'}
		display: flex;
		gap: 1rem;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem;
	}
	& > div[role='list'] > div > div > button {
		width: 100%;
		transition: background-color 0.2s ease;
		background-color: ${props => (props.backgroundColor ? props.backgroundColor : 'var(--panels)')};
		border: 1px solid var(--disable);

		height: 40px;
		border-bottom: 1px solid var(--inactive);
	}
	& > div[role='list'] > div > div > button:hover,
	& > div[role='list'] > div > div > button:focus {
		background-color: var(--background);
	}
	& > div[role='list'] > div > div > button:last-child {
		width: 100%;
		border-radius: ${props => (props.radius ? props.radius : '0px 0px 7px 7px')};
	}
	& .dd-list {
		transition: all 0.3s ease;
		overflow-y: hidden;
		display: none;
		max-height: 0;
		padding-top: 0.5rem;
		&.open {
			max-height: 100vh;
			transition: all 0.3s ease;
			padding-top: 0;
			display: block;
		}
		& .filterSearch {
			padding: 1rem 1rem 0.5rem 1rem;
			background-color: var(--panels);
			border: 1px solid var(--disable);
			& .filters-wrapper {
				display: flex;
				justify-content: space-between;
				align-items: center;
				& .resultsNumbers {
					display: block;
					margin-top: 0.5rem;
					padding: 0 0.5rem;
					width: 100%;
					text-align: right;
				}
				& .filter-checkbox {
					margin-top: 0.5rem;
				}
			}
		}
	}
`;

export default function Dropdown({
	onChange,
	options,
	key,
	values,
	style,
	filterByCheckbox,
	checkboxDefaultValue,
	checkboxLabel = 'filter',
	filterDropdownList,
	backgroundColor,
	defaultValue,
	disable,
	resultsNumbers
}: IDropdownProps) {
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
					<div className="">{headerTitle}</div>
					<div className={`${isOpen ? 'selected' : ''}`}>
						<i className="fa-solid fs-22 fa-angle-down"></i>
					</div>
				</button>
				<div role="list" className={`dd-list ${isOpen ? 'open' : ''}`}>
					{filterDropdownList && (
						<div className="filterSearch relative">
							<InputText
								ref={ref}
								bgColor="var(--panels)"
								border="1px solid var(--primary)"
								onChange={filterDropdownList}
								glass
								iconRightPos={{ top: 9, right: 15 }}
							/>
							<div className="filters-wrapper">
								{filterByCheckbox && (
									<CustomCheckbox
										className="filter-checkbox"
										isChecked={checkboxDefaultValue}
										label={checkboxLabel}
										labelPosition="right"
										onClick={filterByCheckbox}
										size="sm"
									/>
								)}
								{resultsNumbers && <label className="resultsNumbers">{resultsNumbers} results</label>}
							</div>
						</div>
					)}
					<List height={300} itemCount={values.length} itemSize={44} width={'100%'}>
						{Row}
					</List>
				</div>
			</DropdownContainer>
		</ClickAwayListener>
	);
}
