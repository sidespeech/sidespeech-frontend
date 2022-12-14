import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import check from '../../../assets/check_circle.svg';
import Button from '../../ui-components/Button';
import styled from 'styled-components';
import Dropdown from '../../ui-components/Dropdown';
import { Collection, OpenSeaRequestStatus } from '../../../models/interfaces/collection';
import { hasTraitInCollection, hasTraitValueInCollection } from '../../../helpers/utilities';
import CustomInputNumber from '../../ui-components/InputNumber';
import { breakpoints, size } from '../../../helpers/breakpoints';
import { UserCollectionsData } from '../../../models/interfaces/UserCollectionsData';
import CollectionsDropdown from '../../ui-components/CollectionsDropdown';

interface IAdmissionProps {
	divCollections: any[];
	collections: Collection[];
	setSideTokenAddress: any;
	setSidePropertyCondition: any;
	setSideValueCondition: any;
	onRemoveFeature: any;
	addDivCollection: any;
	removeDivCollection: any;
	addConditionToDivCollection: any;
	onlyOneRequired: boolean;
	setOnlyOneRequired: any;
	setNumberOfNftNeededToDivCollection: any;
	userCollectionsData: UserCollectionsData;
}
interface IRequirementsRadioButtonContainerProps {
	disable?: boolean;
}

const Chip = styled.span`
	width: fit-content;
	border-radius: 50px;
	background-color: var(--disable);
	padding: 1px 8px;
`;
const RequirementsRadioButtonContainer = styled.div<IRequirementsRadioButtonContainerProps>`
	border-radius: 7px;
	padding: 0.5rem 1rem;
	${props => props.disable && 'pointer-events: none; opacity: 0.2;'}
	${breakpoints(
		size.lg,
		`{
			height: 44px;
			border-radius: 50px;
		}`
	)}
	flex: 1 0 0;
	align-items: center;
	transition: all 0.2s ease;
	background-color: var(--white-transparency-10);
	color: var(--white);
	display: flex;
	cursor: pointer;
	&.active {
		background-color: var(--primary);
		color: var(--background);
		& > div:first-child {
			border: 1px solid var(--background);
		}
	}
	& > div:first-child {
		transition: border-color 0.2 ease;
		border: 1px solid var(--white);
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		border-radius: 10px;
		margin-right: 13px;
		display: flex;
		justify-content: center;
		align-items: center;
		& div {
			background-color: var(--background);
			width: 12px;
			height: 12px;
			border-radius: 8px;
		}
	}
`;

const AdmissionStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	${breakpoints(
		size.lg,
		`{
    flex-direction: row;
  }`
	)}
	.left-side {
		width: 100%;
		${breakpoints(
			size.lg,
			`{
      width: 60%;
      max-width: 500px;
    }`
		)}

		.collection-item {
			padding: 1rem;
			border-radius: 7px;
			background-color: var(--white-transparency-10);
			width: 100%;
			max-width: 90vw;
			${breakpoints(
				size.lg,
				`{
        max-width: 500px;
      }`
			)}
			.collection-name {
				justify-content: center;
				align-items: center;
				margin: auto;
				width: 100%;
			}
			.feature-box {
				display: flex;
				gap: 1rem;
				align-items: center;
				width: 100%;
				margin: 1rem 0;
				.feature-selects {
					width: 90%;
					background-color: var(--white-transparency-10);
					padding: 12px 15px;
					border-radius: 8px;
					display: flex;
					gap: 1rem;
					align-items: center;
				}
				.feature-btn {
					width: 10%;
					text-align: center;
					& button {
						background-color: transparent;
						border: none;
						& i {
							background-color: var(--disable);
							opacity: 0.7;
							padding: 8px;
							border-radius: 50%;
							font-size: 16px;
							cursor: pointer;
						}
					}
				}
			}

			.add-feature button {
				width: 100%;
				padding: 8px 0px;
				text-align: center;
				cursor: pointer;
				font-size: 17px;
				color: var(--inactive);
				background-color: var(--input);
				border: 2px dashed var(--disable);
				border-radius: 7px;
			}
		}
		.separator {
			width: 100%;
			height: 1px;
			background: var(--disable);
			flex: 5 0 0;
		}
	}
	.right-side {
		width: 100%;
		${breakpoints(
			size.lg,
			`{
      width: 40%;
      max-width: 400px;
    }`
		)}
	}
`;

function sortByValue(a: any, b: any) {
	if (a['value'] < b['value']) return -1;
	if (a['value'] > b['value']) return 1;
	return 0;
}

function featuresValueFilter(innerCurrent: any, el: any) {
	if (innerCurrent['values_used'].findIndex((vu: any) => vu['valueUsed'] === el) < 0) return el;
}

function reduceTraitsValues(prev: any, innerCurrent: any, fcurrent: any) {
	if (innerCurrent['property']['value'] === fcurrent['trait_selected'])
		prev = innerCurrent['values'].filter((el: any) => featuresValueFilter(innerCurrent, el));
	return prev;
}

export default function Admission({
	divCollections,
	collections,
	setSideTokenAddress,
	setSidePropertyCondition,
	setSideValueCondition,
	onRemoveFeature,
	addDivCollection,
	removeDivCollection,
	addConditionToDivCollection,
	onlyOneRequired,
	setOnlyOneRequired,
	setNumberOfNftNeededToDivCollection,
	userCollectionsData
}: IAdmissionProps) {
	const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);

	useEffect(() => {
		const selectedCollections: string[] = divCollections.map((d: any) => d.collection);
		let filtered = collections.filter(c => !selectedCollections.includes(c.address));
		if (!onlyOneRequired) {
			filtered = filtered.filter(c => userCollectionsData[c.address]);
		}
		setFilteredCollections(filtered);
	}, [divCollections, onlyOneRequired, collections]);

	useEffect(() => {
		if (divCollections.length <= 1 && !onlyOneRequired) {
			setOnlyOneRequired(true);
		}
	}, [divCollections, onlyOneRequired]);

	const TraitValueRow = ({ ownedByUser, value }: { ownedByUser: boolean; value: string }) => {
		return <span className={`${ownedByUser ? 'text-green' : 'text-red'}`}>{value}</span>;
	};
	function traitValuesOptionsMap(collection: Collection, trait: string, value: string) {
		let hasValue = hasTraitValueInCollection(collection, trait.toLowerCase(), value.toLowerCase());
		return <TraitValueRow ownedByUser={hasValue} value={value} key={value} />;
	}

	const handleOnChange = (address: string, i: number) => {
		setSideTokenAddress(address, i, filteredCollections);
	};
	return (
		<AdmissionStyled>
			<div className="left-side">
				<label htmlFor="fade-in name" className="size-14 fw-400 mb-4 text-left">
					Admission conditions ({divCollections.length})
				</label>
				<p className="fade-in text-secondary my-3">Collection requirements</p>
				<div className="fade-in flex gap-20 mt-2 mb-3 w-100">
					<RequirementsRadioButtonContainer
						className={onlyOneRequired ? 'active' : ''}
						onClick={() => setOnlyOneRequired(true)}
					>
						<div>{onlyOneRequired && <div></div>}</div>
						<div>1 collection from the list</div>
					</RequirementsRadioButtonContainer>
					<RequirementsRadioButtonContainer
						className={onlyOneRequired ? '' : 'active'}
						onClick={() => setOnlyOneRequired(false)}
						disable={divCollections.length <= 1}
					>
						<div>{!onlyOneRequired && <div></div>}</div>
						<div>All collections are required</div>
					</RequirementsRadioButtonContainer>
				</div>

				<div className="f-column align-center">
					{Object.keys(userCollectionsData).length > 0 &&
						divCollections.map((current: any, i: number) => {
							return (
								<>
									<div className="collection-item bounce-from-right mb-3" key={i}>
										<div className="flex justify-between">
											<label className="size-14">Collection</label>

											<button
												className="reset-btn size-14 text-red"
												onClick={() => removeDivCollection(current.collection, i)}
											>
												<i className="fa-regular fa-trash-can mr-2"></i>Remove
											</button>
										</div>

										<div className="f-row collection-name">
											<div className="f-column mt-3 mb-3">
												<div className="flex">
													<CollectionsDropdown
														collections={filteredCollections}
														userCollectionsData={userCollectionsData}
														onChange={(address: string) => handleOnChange(address, i)}
														defaultValue={'Choose collection'}
														style={{
															zIndex: 6 * (divCollections.length - i)
														}}
														selectedCollection={
															Object.keys(current['metadata']).length !== 0 &&
															current['metadata']
														}
													/>
													<div className="ml-4">
														<CustomInputNumber
															onChange={(value: number) =>
																setNumberOfNftNeededToDivCollection(value, i)
															}
															collections={collections}
															defaultValue={
																Object.keys(current['metadata']).length !== 0
																	? current.numberNeeded
																	: 1
															}
															currentDiv={current}
														/>
													</div>
												</div>
											</div>

											{current['traits_values'].length > 0 && (
												<>
													<label>Holders of one of these traits</label>
													{current['features'].length ? (
														<>
															{current['features'].map(
																(fcurrent: any, findex: number) => {
																	const collection =
																		userCollectionsData[current['collection']];
																	const hasTrait = hasTraitInCollection(
																		collection,
																		fcurrent['trait_selected'].toLowerCase()
																	);
																	const hasTraitValue = hasTraitValueInCollection(
																		collection,
																		fcurrent['trait_selected'].toLowerCase(),
																		fcurrent['value_selected'].toLowerCase()
																	);
																	const traitsValues = current['traits_values'];
																	const selectedTrait = fcurrent['trait_selected'];
																	const zIndex =
																		6 * (divCollections.length - i) - (findex + 1);
																	return (
																		<div className="feature-box" key={findex}>
																			<div className="feature-selects mr-auto">
																				<Dropdown
																					style={{
																						zIndex: zIndex
																					}}
																					defaultValue={
																						fcurrent['trait_selected'] ? (
																							<TraitValueRow
																								ownedByUser={hasTrait}
																								value={selectedTrait}
																								key={findex}
																							/>
																						) : (
																							'Select trait'
																						)
																					}
																					options={[
																						...traitsValues.map(
																							(item: any) => {
																								const value =
																									item['property'][
																										'value'
																									];
																								let hasFeature =
																									hasTraitInCollection(
																										collection,
																										value.toLowerCase()
																									);
																								return (
																									<TraitValueRow
																										ownedByUser={
																											hasFeature
																										}
																										value={value}
																										key={value}
																									/>
																								);
																							}
																						)
																					]}
																					values={[
																						...traitsValues.map(
																							(item: any) =>
																								item['property'][
																									'value'
																								]
																						)
																					]}
																					onChange={(value: any) =>
																						setSidePropertyCondition(
																							value,
																							i,
																							findex
																						)
																					}
																				/>
																				<Dropdown
																					style={{
																						zIndex: zIndex
																					}}
																					defaultValue={
																						fcurrent['value_selected'] ? (
																							<TraitValueRow
																								ownedByUser={
																									hasTraitValue
																								}
																								value={
																									fcurrent[
																										'value_selected'
																									]
																								}
																								key={findex}
																							/>
																						) : (
																							'Select value of trait'
																						)
																					}
																					values={[
																						...traitsValues
																							.reduce(
																								(
																									prev: any,
																									innerCurrent: any
																								) => {
																									return reduceTraitsValues(
																										prev,
																										innerCurrent,
																										fcurrent
																									);
																								},
																								[]
																							)
																							.sort(sortByValue)
																							.map(
																								(item: any) =>
																									item['value']
																							)
																					]}
																					options={[
																						...traitsValues
																							.reduce(
																								(
																									prev: any,
																									innerCurrent: any
																								) => {
																									return reduceTraitsValues(
																										prev,
																										innerCurrent,
																										fcurrent
																									);
																								},
																								[]
																							)
																							.sort(sortByValue)
																							.map((item: any) => {
																								return traitValuesOptionsMap(
																									collection,
																									fcurrent[
																										'trait_selected'
																									],
																									item['value']
																								);
																							})
																					]}
																					onChange={(value: any) =>
																						setSideValueCondition(
																							value,
																							i,
																							findex
																						)
																					}
																				/>
																			</div>

																			<div className="feature-btn f-column justify-center">
																				<button
																					className="mt-2 text-red"
																					onClick={() =>
																						onRemoveFeature(i, findex)
																					}
																				>
																					<i className="fa-solid fa-minus"></i>
																				</button>
																			</div>
																		</div>
																	);
																}
															)}
															<div
																className="add-feature mt-3"
																onClick={() => addConditionToDivCollection(i)}
															>
																<button>
																	<i
																		className="fa fa-plus-circle"
																		aria-hidden="true"
																	></i>{' '}
																	Add a Feature
																</button>
															</div>
														</>
													) : (
														<div
															className="add-feature mt-3"
															onClick={() => addConditionToDivCollection(i)}
														>
															<button>
																<i className="fa fa-plus-circle" aria-hidden="true"></i>{' '}
																Add a Feature
															</button>
														</div>
													)}
												</>
											)}
										</div>
									</div>{' '}
									{i < divCollections.length - 1 && (
										<div className="flex align-center w-100 mb-3">
											<hr className="separator"></hr>
											<span className="mx-3">{onlyOneRequired ? 'OR' : 'AND'}</span>
											<hr className="separator"></hr>
										</div>
									)}
								</>
							);
						})}
				</div>
				<Button
					classes="fade-in"
					width={'100%'}
					height={46}
					radius={10}
					background={'var(--white-transparency-10)'}
					color={'var(--text)'}
					onClick={() => {
						// setFilter('');
						addDivCollection();
					}}
				>
					<i className="fa-solid fa-circle-plus mr-2"></i> Add a collection
				</Button>
			</div>

			<div className="fade-in right-side">
				<div>Summary</div>
				<div style={{ lineHeight: '26px' }}>
					To join this Side, you must have in your wallet : <br />
					{divCollections.map((d, index) => {
						if (!d['collection']) return;
						return (
							<>
								<Chip>{d['numberNeeded'] || 1} NFT</Chip> From the{' '}
								<Chip>{collections.find(c => c.address === d['collection'])?.getName() || ''}</Chip>
								collection{' '}
								{d['features'].map((f: any, index: number) => {
									return (
										<>
											{' '}
											{index === 0 ? 'that has this trait : ' : 'OR'}
											<br />
											<Chip>
												{f['trait_selected'] || ''} - {f['value_selected'] || ''}
											</Chip>
										</>
									);
								})}
								<br />
								{index < divCollections.length - 1 && <>{onlyOneRequired ? 'OR' : 'AND'}</>}
								<br />
							</>
						);
					})}
				</div>
			</div>
		</AdmissionStyled>
	);
}
