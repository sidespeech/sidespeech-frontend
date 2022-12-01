import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { getRandomId, paginateArray } from '../../helpers/utilities';
import useDebounceValue from '../../hooks/useDebounceValue';
import { Collection, OpenSeaRequestStatus } from '../../models/interfaces/collection';
import { Side } from '../../models/Side';
import { RootState } from '../../redux/store/app.store';
import SideEligibilityModal from '../Modals/SideEligibilityModal';
import Button from '../ui-components/Button';
import CustomCheckbox from '../ui-components/CustomCheckbox';
import CustomSelect from '../ui-components/CustomSelect';
import PaginationControls from '../ui-components/PaginationControls';
import Spinner from '../ui-components/Spinner';
import { searchFiltersInitialState, searchFiltersProps } from './DashboardPage';
import SideCardItem from './shared-components/SideCardItem';
import { breakpoints, size } from '../../helpers/breakpoints';
import noResultsImg from '../../assets/my_sides_empty_screen_shape.svg';
import sideService from '../../services/api-services/side.service';

interface SearchStyledProps {}

const SearchStyled = styled.main<SearchStyledProps>`
	.title_wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
		.title {
			margin: 0;
		}
		.filters-btn {
			background: transparent;
			border: none;
			outline: none;
			box-shadow: none;
			${breakpoints(
				size.md,
				`{
        display: none;
      }`
			)}
		}
	}
	.search-toolbar {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin: 1rem 0 2rem 0;
		gap: 1rem;
		transform: scaleY(0);
		position: absolute;
		${breakpoints(
			size.md,
			`{
      position: relative;
      flex-direction: row;
      align-items: center;
      transform: scaleY(1);
    }`
		)}
		&.filters-showing {
			position: relative;
			transform: scaleY(1);
		}
		.collection-select,
		.elegibility-select,
		.verified-checkbox {
			display: flex;
			align-items: center;
			gap: 1rem;
		}
		.collection-select,
		.elegibility-select {
			justify-content: space-between;
			background-color: var(--input);
			padding: 0.5rem 1rem;
			border-radius: 10px;
		}
		.collection-select {
			width: 100%;
			${breakpoints(
				size.md,
				`{
        width: 30%;
      }`
			)}
		}
		.elegibility-select {
			width: 100%;
			${breakpoints(
				size.md,
				`{
        width: 20%;
      }`
			)}
		}
	}

	.no-results,
	.spinner-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.2rem;
		width: 100%;
		min-height: 400px;
		color: var(--text);
	}
	.no-results {
		flex-direction: column;
		background-image: url(${noResultsImg});
		background-position: center center;
		backgound-size: contain;
		background-repeat: no-repeat;
		margin: 80px 0;
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
	.list-wrapper {
		display: grid;
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
        grid-gap: 1rem;
	}
	.pagination-controls {
		margin: 3rem 0 2rem 0;
	}
`;

interface SearchProps {
	collections: Collection[];
	searchFilters: searchFiltersProps;
	searchText: string;
	setSearchFilters: React.Dispatch<React.SetStateAction<searchFiltersProps>>;
}

interface paginationProps {
	currentPage: number;
	pageSize: number;
}

const paginationInitialState = {
	currentPage: 1,
	pageSize: 9
};

const Search = ({ collections, searchFilters, searchText, setSearchFilters }: SearchProps) => {
	const [displayEligibility, setDisplayEligibility] = useState<boolean>(false);
	const [filteredSides, setFilteredSides] = useState<Side[]>([]);
	const [isFiltersShowing, setIsFiltersShowing] = useState<boolean>(false);
	const [pagination, setPagination] = useState<paginationProps>(paginationInitialState);
	const [selectedSide, setSelectedSide] = useState<Side | null>(null);
	const [sidesList, setSidesList] = useState<Side[]>([]);
	const [sidesLoading, setSidesLoading] = useState<boolean>(false);
	const [totalResults, setTotalResults] = useState<number>(0);

	const { sides, user, userCollectionsData } = useSelector((state: RootState) => state.user);

	const _searchText = useDebounceValue(searchText);

	useEffect(() => {
		return () => setSearchFilters(searchFiltersInitialState);
	}, []);

	const getSearchSides = useCallback(async () => {
		try {
			setSidesLoading(true);
			const response = await sideService.getSidesBySearchValue(
				_searchText,
				searchFilters.collections,
				userCollectionsData,
				sides
			);
			setFilteredSides(response);
		} catch (error) {
			console.error(error);
			toast.error('Ooops! Something went wrong fetching your Sides', {
				toastId: getRandomId()
			});
		} finally {
			setSidesLoading(false);
		}
	}, [_searchText, searchFilters.collections, sides, userCollectionsData]);

	useEffect(() => {
		getSearchSides();
	}, [getSearchSides]);

	useEffect(() => {
		let parsedArray =
			searchFilters.elegibility === 'eligible'
				? filteredSides.filter(side => side.eligible)
				: searchFilters.elegibility === 'non-eligible'
				? filteredSides.filter(side => !side.eligible)
				: filteredSides;
		if (searchFilters.verifiedCollections) {
			parsedArray = parsedArray.filter(
				side => side.firstCollection?.safelistRequestStatus === OpenSeaRequestStatus.verified
			);
		}
		setTotalResults(parsedArray.length);
		const { array } = paginateArray({
			array: parsedArray,
			currentPage: pagination.currentPage,
			pageSize: pagination.pageSize
		});
		setSidesList(array);
	}, [filteredSides, pagination, searchFilters]);

	const handleEligibilityCheck = (side: Side) => {
		setSelectedSide(side);
		setDisplayEligibility(true);
	};

	return (
		<SearchStyled>
			<div className="title_wrapper">
				<h2 className="title">
					{totalResults} Sides found for "{searchText || searchFilters.selectedCollection || ''}"
				</h2>

				<button onClick={() => setIsFiltersShowing(prevState => !prevState)} className="filters-btn">
					<svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M7.99991 16C7.71657 16 7.47924 15.904 7.28791 15.712C7.09591 15.5207 6.99991 15.2833 6.99991 15V9L1.19991 1.6C0.949908 1.26667 0.912574 0.916667 1.08791 0.55C1.26257 0.183334 1.56657 0 1.99991 0H15.9999C16.4332 0 16.7376 0.183334 16.9129 0.55C17.0876 0.916667 17.0499 1.26667 16.7999 1.6L10.9999 9V15C10.9999 15.2833 10.9042 15.5207 10.7129 15.712C10.5209 15.904 10.2832 16 9.99991 16H7.99991ZM8.99991 8.3L13.9499 2H4.04991L8.99991 8.3Z"
							fill="#B4C1D2"
						/>
					</svg>
				</button>
			</div>

			<div className={`search-toolbar ${isFiltersShowing ? 'filters-showing' : ''}`}>
				<div className="collection-select">
					<label>Collection</label>
					<CustomSelect
						arrowPosition={{ right: '-8px' }}
						onChange={(ev: any) =>
							setSearchFilters(prevState => ({
								...prevState,
								collections: ev.target.value,
								selectedCollection: ''
							}))
						}
						options={['All', ...collections.map(collection => collection.name)]}
						placeholder="Select a collection"
						valueToSet={searchFilters.collections?.split(',')[0] || ''}
						values={['all', ...collections.map(collection => collection.address)]}
						width="70%"
					/>
				</div>

				<div className="elegibility-select">
					<label>Elegibility</label>
					<CustomSelect
						arrowPosition={{ right: '-8px' }}
						onChange={(ev: any) =>
							setSearchFilters(prevState => ({
								...prevState,
								elegibility: ev.target.value
							}))
						}
						options={['All', 'Eligible', 'Non eligible']}
						valueToSet={searchFilters.elegibility}
						values={['all', 'eligible', 'non-eligible']}
						width="70%"
					/>
				</div>

				<div className="verified-checkbox">
					<CustomCheckbox
						label="Only with verified collections"
						isChecked={searchFilters.verifiedCollections}
						onClick={(ev: any) =>
							setSearchFilters(prevState => ({
								...prevState,
								verifiedCollections: ev.target.checked
							}))
						}
					/>
				</div>
			</div>

			{sidesLoading ? (
				<div className="spinner-wrapper">
					<Spinner />
				</div>
			) : !!sidesList?.length ? (
				<div className="list-wrapper">
					{sidesList.map(side => (
						<SideCardItem
							key={side.id}
							onJoin={handleEligibilityCheck}
							side={side}
							userProfiles={user?.profiles || []}
						/>
					))}
				</div>
			) : (
				<div className="no-results">
					<p>
						Ooops!
						<br />
						Nothing here
					</p>
					<div className="buttons-wrapper">
						<Link to="/new-side">
							<Button width={'145px'} background="var(--disable)">
								<svg
									width="17"
									height="18"
									viewBox="0 0 17 18"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M7.66699 13.1666H9.33366V9.83329H12.667V8.16663H9.33366V4.83329H7.66699V8.16663H4.33366V9.83329H7.66699V13.1666ZM8.50033 17.3333C7.34755 17.3333 6.26421 17.1144 5.25033 16.6766C4.23644 16.2394 3.35449 15.6458 2.60449 14.8958C1.85449 14.1458 1.26088 13.2638 0.823659 12.25C0.385881 11.2361 0.166992 10.1527 0.166992 8.99996C0.166992 7.84718 0.385881 6.76385 0.823659 5.74996C1.26088 4.73607 1.85449 3.85413 2.60449 3.10413C3.35449 2.35413 4.23644 1.76024 5.25033 1.32246C6.26421 0.885237 7.34755 0.666626 8.50033 0.666626C9.6531 0.666626 10.7364 0.885237 11.7503 1.32246C12.7642 1.76024 13.6462 2.35413 14.3962 3.10413C15.1462 3.85413 15.7398 4.73607 16.177 5.74996C16.6148 6.76385 16.8337 7.84718 16.8337 8.99996C16.8337 10.1527 16.6148 11.2361 16.177 12.25C15.7398 13.2638 15.1462 14.1458 14.3962 14.8958C13.6462 15.6458 12.7642 16.2394 11.7503 16.6766C10.7364 17.1144 9.6531 17.3333 8.50033 17.3333Z"
										fill="white"
									/>
								</svg>
								Create a Side
							</Button>
						</Link>
						<Link to="/">
							<Button width={'145px'}>Explore</Button>
						</Link>
					</div>
				</div>
			)}

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
						array: sidesList,
						currentPage: pagination.currentPage,
						pageSize: pagination.pageSize
					}).pages
				}
			/>

			{displayEligibility && selectedSide && (
				<SideEligibilityModal
					setDisplayLeaveSide={() => {}}
					setDisplayEligibility={setDisplayEligibility}
					selectedSide={selectedSide}
				/>
			)}
		</SearchStyled>
	);
};

export default Search;
