import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomSelect from '../../ui-components/CustomSelect';
import check from '../../../assets/check_circle.svg';
import Button from '../../ui-components/Button';
import Switch from '../../ui-components/Switch';
import styled from 'styled-components';
import Dropdown from '../../ui-components/Dropdown';
import { Collection, OpenSeaRequestStatus } from '../../../models/interfaces/collection';
import { fixURL, hasTraitInCollection, hasTraitValueInCollection } from '../../../helpers/utilities';
import CustomInputNumber from '../../ui-components/InputNumber';
import { filter, unionBy } from 'lodash';
import { breakpoints, size } from '../../../helpers/breakpoints';
import { UserCollectionsData } from '../../../models/interfaces/UserCollectionsData';

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
	selected: boolean;
}

const Chip = styled.span`
	width: fit-content;
	border-radius: 50px;
	background-color: var(--disable);
	padding: 1px 8px;
`;
const Thumbnail = styled.img`
	border-radius: 15px;
`;
const RequirementsRadioButtonContainer = styled.div<IRequirementsRadioButtonContainerProps>`
	background-color: ${props => (props.selected ? 'var(--primary)' : 'var(--input)')};
	border-radius: 7px;
	padding: 0.5rem;
	${breakpoints(
		size.lg,
		`{
    height: 44px;
    border-radius: 50px;
  }`
	)}
	flex: 1 0 0;
	align-items: center;
	color: ${props => (props.selected ? 'var(--white)' : 'var(--inactive)')};
	display: flex;
	cursor: pointer;

	& > div:first-child {
		border: 1px solid ${props => (props.selected ? 'var(--white)' : 'var(--inactive)')};
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		border-radius: 10px;
		margin-right: 13px;
		display: flex;
		justify-content: center;
		align-items: center;
		& div {
			background-color: var(--white);
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
	.filterSearch {
		text-align: right;
	}
	.filterSearch + button {
		display: none;
	}
	${breakpoints(
		size.lg,
		`{
    flex-direction: row;
    justify-content: space-between;
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
			background-color: var(--input);
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
					background-color: var(--disable);
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
	const dispatch = useDispatch();
	const [value, setValue] = useState(false);
	const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
	const [filter, setFilter] = useState<string>('');

	useEffect(() => {
		const selectedCollections: string[] = divCollections.map((d: any) => d.collection);
		const filtered = collections.filter(
			c =>
				!selectedCollections.includes(c.address) &&
				(c.name ? c.name.toLowerCase().includes(filter.toLowerCase()) : c.name)
		);
		setFilteredCollections(filtered);
	}, [divCollections, filter]);

	const filterDropdownList = (e: any) => {
		const value = e.target.value;
		setFilter(value);
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
						onClick={() => setOnlyOneRequired(true)}
						selected={onlyOneRequired}
					>
						<div>{onlyOneRequired && <div></div>}</div>
						<div>1 collection from the list</div>
					</RequirementsRadioButtonContainer>
					<RequirementsRadioButtonContainer
						onClick={() => setOnlyOneRequired(false)}
						selected={!onlyOneRequired}
					>
						<div>{!onlyOneRequired && <div></div>}</div>
						<div>All collections are required</div>
					</RequirementsRadioButtonContainer>
				</div>

				<div className="f-column align-center">
					{divCollections.map((current: any, i: number) => {
						return (
							<>
								<div className="collection-item mb-3" key={i}>
									<div className="flex justify-between">
										<label className="size-14">Collection</label>

										<label
											className="size-14 text-red cursor-pointer"
											onClick={() => removeDivCollection(i)}
										>
											<i className="fa-regular fa-trash-can mr-2"></i>Remove
										</label>
									</div>

									<div className="f-row collection-name">
										<div className="f-column mt-3 mb-3">
											<div className="flex">
												<Dropdown
													style={{ zIndex: 5 + divCollections.length - i }}
													resultsNumbers={filteredCollections.length}
													values={
														filteredCollections.length
															? ['', ...filteredCollections.map(c => c.address)]
															: [current['collection']]
													}
													options={
														filteredCollections.length
															? [
																	`Choose collection`,
																	...filteredCollections.map((c, fi) => {
																		return (
																			<span
																				className="flex align-center pl-3"
																				key={fi}
																			>
																				{c.imageUrl ? (
																					<Thumbnail
																						width={27}
																						height={27}
																						src={c.imageUrl}
																						alt="thumbnail"
																					/>
																				) : null}
																				<span
																					className="ml-2 mr-3"
																					style={{
																						color: userCollectionsData[
																							c.address
																						]
																							? 'var(--green)'
																							: 'var(--red)'
																					}}
																				>
																					{c.name}
																				</span>
																				{c.safelistRequestStatus ===
																					OpenSeaRequestStatus.verified && (
																					<img alt="check" src={check} />
																				)}
																			</span>
																		);
																	})
															  ]
															: Object.keys(current['metadata']).length !== 0
															? [
																	<span className="flex align-center pl-3">
																		{current['metadata'].opensea?.imageUrl ? (
																			<Thumbnail
																				width={27}
																				height={27}
																				src={
																					current['metadata'].opensea
																						?.imageUrl
																				}
																				alt="thumbnail"
																			/>
																		) : null}
																		<span className="ml-2 mr-3">
																			{current['metadata'].name}
																		</span>
																		{current['metadata'].opensea
																			?.safelistRequestStatus ===
																			OpenSeaRequestStatus.verified && (
																			<img alt="check" src={check} />
																		)}
																	</span>
															  ]
															: ['Choose collection']
													}
													onChange={(address: string) => {
														setFilter('');
														setSideTokenAddress(address, i, filteredCollections);
													}}
													filterDropdownList={filterDropdownList}
												/>
												<div className="ml-4">
													<CustomInputNumber
														onChange={(value: number) =>
															setNumberOfNftNeededToDivCollection(value, i)
														}
														collections={collections}
														defaultValue={1}
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
														{current['features'].map((fcurrent: any, findex: number) => {
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
															return (
																<div className="feature-box" key={findex}>
																	<div className="feature-selects mr-auto">
																		<Dropdown
																			style={{ zIndex: 4 }}
																			defaultValue={
																				fcurrent['trait_selected'] ? (
																					<span
																						className={`${
																							hasTrait
																								? 'text-green'
																								: 'text-red'
																						}`}
																					>
																						{fcurrent['trait_selected']}
																					</span>
																				) : null
																			}
																			backgroundColor={'var(--black-plain)'}
																			options={[
																				'Select trait',
																				...current['traits_values'].map(
																					(item: any) => {
																						let hasFeature =
																							hasTraitInCollection(
																								collection,
																								item['property'][
																									'value'
																								].toLowerCase()
																							);

																						return (
																							<span
																								className={`${
																									hasFeature
																										? 'text-green'
																										: 'text-red'
																								}`}
																							>
																								{
																									item['property'][
																										'value'
																									]
																								}
																							</span>
																						);
																					}
																				)
																			]}
																			values={[
																				'',
																				...current['traits_values'].map(
																					(item: any) =>
																						item['property']['value']
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
																			style={{ zIndex: 4 }}
																			defaultValue={
																				fcurrent['value_selected'] ? (
																					<span
																						className={`${
																							hasTraitValue
																								? 'text-green'
																								: 'text-red'
																						}`}
																					>
																						{fcurrent['value_selected']}
																					</span>
																				) : null
																			}
																			backgroundColor={'var(--black-plain)'}
																			values={
																				fcurrent['value_selected']
																					? [
																							'Select value of trait',
																							<span
																								className={`${
																									hasTraitValue
																										? 'text-green'
																										: 'text-red'
																								}`}
																							>
																								{
																									fcurrent[
																										'value_selected'
																									]
																								}
																							</span>,
																							...current['traits_values']
																								.reduce(
																									(
																										prev: any,
																										innerCurrent: any
																									) => {
																										if (
																											innerCurrent[
																												'property'
																											][
																												'value'
																											] ===
																											fcurrent[
																												'trait_selected'
																											]
																										)
																											prev =
																												innerCurrent[
																													'values'
																												].filter(
																													function (
																														el: any
																													) {
																														if (
																															innerCurrent[
																																'values_used'
																															].indexOf(
																																el
																															) <
																															0
																														)
																															return el;
																													}
																												);
																										return prev;
																									},
																									[]
																								)
																								.sort(
																									(
																										a: any,
																										b: any
																									) => {
																										if (
																											a['value'] <
																											b['value']
																										)
																											return -1;
																										if (
																											a['value'] >
																											b['value']
																										)
																											return 1;
																										return 0;
																									}
																								)
																								.map(
																									(item: any) =>
																										item['value']
																								)
																					  ]
																					: [
																							'',
																							...current['traits_values']
																								.reduce(
																									(
																										prev: any,
																										innerCurrent: any
																									) => {
																										if (
																											innerCurrent[
																												'property'
																											][
																												'value'
																											] ===
																											fcurrent[
																												'trait_selected'
																											]
																										)
																											prev =
																												innerCurrent[
																													'values'
																												].filter(
																													function (
																														el: any
																													) {
																														if (
																															innerCurrent[
																																'values_used'
																															].indexOf(
																																el
																															) <
																															0
																														)
																															return el;
																													}
																												);
																										return prev;
																									},
																									[]
																								)
																								.sort(
																									(
																										a: any,
																										b: any
																									) => {
																										if (
																											a['value'] <
																											b['value']
																										)
																											return -1;
																										if (
																											a['value'] >
																											b['value']
																										)
																											return 1;
																										return 0;
																									}
																								)
																								.map(
																									(item: any) =>
																										item['value']
																								)
																					  ]
																			}
																			options={
																				fcurrent['value_selected']
																					? [
																							`Select value of trait`,
																							fcurrent['value_selected'],
																							...current['traits_values']
																								.reduce(
																									(
																										prev: any,
																										innerCurrent: any
																									) => {
																										if (
																											innerCurrent[
																												'property'
																											][
																												'value'
																											] ===
																											fcurrent[
																												'trait_selected'
																											]
																										)
																											prev =
																												innerCurrent[
																													'values'
																												].filter(
																													function (
																														el: any
																													) {
																														if (
																															innerCurrent[
																																'values_used'
																															].indexOf(
																																el
																															) <
																															0
																														)
																															return el;
																													}
																												);
																										return prev;
																									},
																									[]
																								)
																								.sort(
																									(
																										a: any,
																										b: any
																									) => {
																										if (
																											a['value'] <
																											b['value']
																										)
																											return -1;
																										if (
																											a['value'] >
																											b['value']
																										)
																											return 1;
																										return 0;
																									}
																								)
																								.map((item: any) => {
																									let hasValue =
																										hasTraitValueInCollection(
																											collection,
																											fcurrent[
																												'trait_selected'
																											].toLowerCase(),
																											item[
																												'value'
																											].toLowerCase()
																										);
																									return (
																										<span
																											className={`${
																												hasValue
																													? 'text-green'
																													: 'text-red'
																											}`}
																										>
																											{
																												item[
																													'value'
																												]
																											}
																										</span>
																									);
																								})
																					  ]
																					: [
																							`Select value of trait`,
																							...current['traits_values']
																								.reduce(
																									(
																										prev: any,
																										innerCurrent: any
																									) => {
																										if (
																											innerCurrent[
																												'property'
																											][
																												'value'
																											] ===
																											fcurrent[
																												'trait_selected'
																											]
																										)
																											prev =
																												innerCurrent[
																													'values'
																												].filter(
																													function (
																														el: any
																													) {
																														if (
																															innerCurrent[
																																'values_used'
																															].indexOf(
																																el
																															) <
																															0
																														)
																															return el;
																													}
																												);
																										return prev;
																									},
																									[]
																								)
																								.sort(
																									(
																										a: any,
																										b: any
																									) => {
																										if (
																											a['value'] <
																											b['value']
																										)
																											return -1;
																										if (
																											a['value'] >
																											b['value']
																										)
																											return 1;
																										return 0;
																									}
																								)
																								.map((item: any) => {
																									let hasValue =
																										hasTraitValueInCollection(
																											collection,
																											fcurrent[
																												'trait_selected'
																											].toLowerCase(),
																											item[
																												'value'
																											].toLowerCase()
																										);
																									return (
																										<span
																											className={`${
																												hasValue
																													? 'text-green'
																													: 'text-red'
																											}`}
																										>
																											{
																												item[
																													'value'
																												]
																											}
																										</span>
																									);
																								})
																					  ]
																			}
																			onChange={(value: any) =>
																				setSideValueCondition(value, i, findex)
																			}
																		/>
																	</div>

																	<div className="feature-btn f-column justify-center">
																		<button
																			className="mt-2 text-red"
																			onClick={() => onRemoveFeature(i, findex)}
																		>
																			<i className="fa-solid fa-minus"></i>
																		</button>
																	</div>
																</div>
															);
														})}
														<div
															className="add-feature mt-3"
															onClick={() => addConditionToDivCollection(i)}
														>
															<button>
																<i className="fa fa-plus-circle" aria-hidden="true"></i>{' '}
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
															<i className="fa fa-plus-circle" aria-hidden="true"></i> Add
															a Feature
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
					background={'var(--disable)'}
					color={'var(--text)'}
					onClick={() => {
						setFilter('');
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
								<Chip>{collections.find(c => c.address === d['collection'])?.name || ''}</Chip>
								collection{' '}
								{d['trait_selected'] && d['value_selected'] && (
									<>
										{' '}
										that has this trait : <br />
										<Chip>
											{d['trait_selected']} - {d['value_selected']}
										</Chip>
									</>
								)}
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
