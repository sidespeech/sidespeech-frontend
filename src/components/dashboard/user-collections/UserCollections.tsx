import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/app.store';
import _ from 'lodash';

import { Collection, OpenSeaRequestStatus } from '../../../models/interfaces/collection';
import UserCollectionCard from './UserCollectionCard';
import UserCollectionItemSmall from './UserCollectionItemSmall';
import CustomCheckbox from '../../ui-components/CustomCheckbox';
import PaginationControls from '../../ui-components/PaginationControls';
import Spinner from '../../ui-components/Spinner';
import { paginateArray, sortCollectionByVerifiedCollectionsAndVolume } from '../../../helpers/utilities';
import { searchFiltersProps } from '../DashboardPage';
// import Button from '../../ui-components/Button';
import noResultsImg from '../../../assets/my_sides_empty_screen_shape.svg';
import { breakpoints, size } from '../../../helpers/breakpoints';

interface CollectionsStyledProps {}

const UserCollectionsStyled = styled.div<CollectionsStyledProps>`
	.collections-list-wrapper {
		display: grid;
		justify-items: center;
		grid-gap: 1rem;
		grid-template-columns: repeat(2, 1fr);
		${breakpoints(
			size.md,
			`
        {
                grid-template-columns: repeat(3, 1fr);
            }
        `
		)}
		${breakpoints(
			size.xl,
			`
            {
                grid-template-columns: repeat(auto-fit, minmax(250px, 300px));
            }
            `
		)}
        &.list-view {
			grid-template-columns: 1fr;
			${breakpoints(
				size.md,
				`
            {
                    grid-template-columns: repeat(3, 1fr);
                }
            `
			)}
			${breakpoints(
				size.xl,
				`
                {
                    grid-template-columns: repeat(auto-fit, minmax(250px, 300px));
                }
                `
			)}
		}
		& .spinner,
		& .no-results {
			grid-column: 1/4;
			width: 100%;
			min-height: 400px;
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--text);
			font-size: 1.2rem;
		}
		& .no-results {
			flex-direction: column;
			background-image: url(${noResultsImg});
			background-position: center center;
			backgound-size: contain;
			background-repeat: no-repeat;
			margin: 4rem 0;
			& p {
				text-align: center;
				font-size: 1.5rem;
				font-weight: 700;
				line-height: 1.4;
				color: var(--inactive);
			}
			& .buttons-wrapper {
				display: flex;
				gap: 1rem;
				margin-top: 2.5rem;
				& a {
					color: inherit;
				}
				& button svg {
					margin-right: 0.5rem;
				}
			}
		}
	}
	.toolbar-wrapper {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		align-items: center;
		justify-content: space-between;
		margin: 2rem 0;
		padding-right: 0.5rem;
		${breakpoints(size.md, `{display: flex; margin: 1rem 0;}`)};
		color: var(--text);
		.view-mode {
			display: flex;
			gap: 1rem;
			align-items: center;
			flex-grow: 1;
			justify-content: flex-end;
			& button {
				background-color: transparent;
				border: none;
				outline: none;
				box-shadow: none;
				padding: 0.5rem;
				& svg path {
					fill: var(--inactive);
				}
				&.active svg path {
					fill: var(--white);
				}
			}
		}
		.checkboxes {
			display: flex;
			gap: 1rem;
			grid-column: 1/3;
			.checkbox-wrapper {
				display: flex;
				align-items: center;
				gap: 1rem;
			}
		}
	}
	.pagination-controls {
		margin: 3rem 0 2rem 0;
	}
`;

type UserCollectionsProps = {
	setSearchFilters: React.Dispatch<React.SetStateAction<searchFiltersProps>>;
};

interface paginationProps {
	currentPage: number;
	pageSize: number;
}

const paginationInitialState = {
	currentPage: 1,
	pageSize: 9
};

const UserCollections = ({ setSearchFilters }: UserCollectionsProps) => {
	const { userCollectionsData, userCollectionsLoading } = useSelector((state: RootState) => state.user);

	const [userCollections, setUserCollections] = useState<Collection[]>([]);
	const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
	const [isOnlyVerifiedCollectionsChecked, setIsOnlyVerifiedCollectionsChecked] = useState<boolean>(true);
	const [isWithSidesChecked, setIsWithSidesChecked] = useState<boolean>(false);
	const [pagination, setPagination] = useState<paginationProps>(paginationInitialState);
	const [viewMode, setViewMode] = useState<string>('card');

	useEffect(() => {
		if (userCollectionsData) {
			let filteredArray = _.orderBy(userCollectionsData, 'name');

			// if (isWithSidesChecked) filteredArray = filteredArray.filter(collection => collection.sideCount > 0);
			if (isOnlyVerifiedCollectionsChecked)
				filteredArray = filteredArray.filter(
					collection => collection.safelistRequestStatus === OpenSeaRequestStatus.verified
				);
			setFilteredCollections(filteredArray.sort(sortCollectionByVerifiedCollectionsAndVolume));
		}
	}, [isOnlyVerifiedCollectionsChecked, isWithSidesChecked, userCollectionsData]);

	useEffect(() => {
		setPagination(prevState => ({
			...prevState,
			currentPage: 1
		}));
	}, [isOnlyVerifiedCollectionsChecked, isWithSidesChecked]);

	useEffect(() => {
		if (filteredCollections.length) {
			const { array } = paginateArray({
				array: filteredCollections,
				currentPage: pagination.currentPage,
				pageSize: pagination.pageSize
			});
			setUserCollections(array);
		}
	}, [filteredCollections, pagination]);

	return (
		<UserCollectionsStyled className="fade-in-delay-3">
			<div>
				<div className="toolbar-wrapper">
					<h2 className="title">My Collections</h2>
					<div className="view-mode">
						Show
						<button
							className={viewMode === 'list' ? 'active' : ''}
							onClick={() => {
								setViewMode('list');
								setPagination(prevState => ({
									...prevState,
									pageSize: 21
								}));
							}}
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M2 20C1.45 20 0.979333 19.8043 0.588 19.413C0.196 19.021 0 18.55 0 18V2C0 1.45 0.196 0.979 0.588 0.587C0.979333 0.195667 1.45 0 2 0H18C18.55 0 19.021 0.195667 19.413 0.587C19.8043 0.979 20 1.45 20 2V18C20 18.55 19.8043 19.021 19.413 19.413C19.021 19.8043 18.55 20 18 20H2ZM2 14V18H6V14H2ZM8 14V18H12V14H8ZM14 18H18V14H14V18ZM2 12H6V8H2V12ZM8 12H12V8H8V12ZM14 12H18V8H14V12ZM6 2H2V6H6V2ZM8 6H12V2H8V6ZM14 6H18V2H14V6Z" />
							</svg>
						</button>
						<button
							className={viewMode === 'card' ? 'active' : ''}
							onClick={() => {
								setViewMode('card');
								setPagination(prevState => ({
									...prevState,
									pageSize: 9
								}));
							}}
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 18 18"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M2 18C1.45 18 0.979 17.8043 0.587 17.413C0.195667 17.021 0 16.55 0 16V2C0 1.45 0.195667 0.979 0.587 0.587C0.979 0.195667 1.45 0 2 0H16C16.55 0 17.021 0.195667 17.413 0.587C17.8043 0.979 18 1.45 18 2V16C18 16.55 17.8043 17.021 17.413 17.413C17.021 17.8043 16.55 18 16 18H2ZM10 10V16H16V10H10ZM10 8H16V2H10V8ZM8 8V2H2V8H8ZM8 10H2V16H8V10Z" />
							</svg>
						</button>
					</div>

					<div className="checkboxes">
						<div className="checkbox-wrapper">
							<CustomCheckbox
								isChecked={isWithSidesChecked}
								label="With Sides"
								name="with-sides"
								onClick={() => setIsWithSidesChecked(!isWithSidesChecked)}
							/>
						</div>
						<div className="checkbox-wrapper">
							<CustomCheckbox
								isChecked={isOnlyVerifiedCollectionsChecked}
								label="Only verified collections"
								name="only-verified"
								onClick={() => setIsOnlyVerifiedCollectionsChecked(!isOnlyVerifiedCollectionsChecked)}
							/>
						</div>
					</div>
				</div>

				<div className={`collections-list-wrapper ${viewMode === 'list' ? 'list-view' : 'card-view'}`}>
					{userCollectionsLoading ? (
						<div className="spinner">
							<Spinner />
						</div>
					) : userCollections.length ? (
						userCollections.map((collection: Collection) => (
							<React.Fragment key={collection.address}>
								{viewMode === 'card' && (
									<UserCollectionCard
										collection={collection}
										onClick={() =>
											setSearchFilters(prevState => ({
												...prevState,
												collections: collection.address,
												selectedCollection: collection.getName()
											}))
										}
									/>
								)}
								{viewMode === 'list' && (
									<UserCollectionItemSmall
										collection={collection}
										onClick={() =>
											setSearchFilters(prevState => ({
												...prevState,
												collections: collection.address,
												selectedCollection: collection.getName()
											}))
										}
									/>
								)}
							</React.Fragment>
						))
					) : (
						<div className="no-results">
							<p>
								Ooops!
								<br />
								Nothing here
							</p>
							{/* <div className="buttons-wrapper">
                            <Link to="/new-side">
                                <Button width={145} background="var(--disable)">
                                    <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.66699 13.1666H9.33366V9.83329H12.667V8.16663H9.33366V4.83329H7.66699V8.16663H4.33366V9.83329H7.66699V13.1666ZM8.50033 17.3333C7.34755 17.3333 6.26421 17.1144 5.25033 16.6766C4.23644 16.2394 3.35449 15.6458 2.60449 14.8958C1.85449 14.1458 1.26088 13.2638 0.823659 12.25C0.385881 11.2361 0.166992 10.1527 0.166992 8.99996C0.166992 7.84718 0.385881 6.76385 0.823659 5.74996C1.26088 4.73607 1.85449 3.85413 2.60449 3.10413C3.35449 2.35413 4.23644 1.76024 5.25033 1.32246C6.26421 0.885237 7.34755 0.666626 8.50033 0.666626C9.6531 0.666626 10.7364 0.885237 11.7503 1.32246C12.7642 1.76024 13.6462 2.35413 14.3962 3.10413C15.1462 3.85413 15.7398 4.73607 16.177 5.74996C16.6148 6.76385 16.8337 7.84718 16.8337 8.99996C16.8337 10.1527 16.6148 11.2361 16.177 12.25C15.7398 13.2638 15.1462 14.1458 14.3962 14.8958C13.6462 15.6458 12.7642 16.2394 11.7503 16.6766C10.7364 17.1144 9.6531 17.3333 8.50033 17.3333Z" fill="white"/>
                                    </svg>
                                    Create a Side
                                </Button>
                            </Link>
                            <Link to="/">
                                <Button width={145}>Explore</Button>
                            </Link>
                        </div> */}
						</div>
					)}
				</div>

				<PaginationControls
					className="pagination-controls"
					currentPage={pagination.currentPage}
					onChangePage={(page: number) => {
						setPagination(prevState => ({
							...prevState,
							currentPage: page
						}));
					}}
					totalPages={
						paginateArray({
							array: filteredCollections,
							currentPage: pagination.currentPage,
							pageSize: pagination.pageSize
						}).pages
					}
				/>
			</div>
		</UserCollectionsStyled>
	);
};

export default UserCollections;
