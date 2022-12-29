import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { getRandomId, paginateArray } from '../../helpers/utilities';
import { Collection, OpenSeaRequestStatus } from '../../models/interfaces/collection';
import { Side } from '../../models/Side';
import { RootState } from '../../redux/store/app.store';
import Button from '../ui-components/Button';
import CustomCheckbox from '../ui-components/CustomCheckbox';
import CustomSelect from '../ui-components/CustomSelect';
import Spinner from '../ui-components/Spinner';
import SideCardItem from './shared-components/SideCardItem';
import noResultsImg from '../../assets/my_sides_empty_screen_shape.svg';
import { searchFiltersProps } from './DashboardPage';
import PaginationControls from '../ui-components/PaginationControls';
import { breakpoints, size } from '../../helpers/breakpoints';
import sideService, { getSidesMetadata } from '../../services/api-services/side.service';
import { Role } from '../../models/Profile';
import { setEligibilityOpen } from '../../redux/Slices/AppDatasSlice';
import { useNotificationsContext } from '../../providers/NotificationsProvider';
import useWalletAddress from '../../hooks/useWalletAddress';
import { NotificationType } from '../../models/Notification';

interface MySidesStyledProps {}

const MySidesStyled = styled.main<MySidesStyledProps>`
	width: 100%;
	.title {
		margin-top: 0;
	}
	.my-sides-toolbar {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: space-between;
		margin: 1rem 0 2rem 0;
		${breakpoints(
			size.md,
			`{
      flex-direction: row;
      align-items: center;
      gap: 0;
    }`
		)}
		.collection-select, .verified-checkbox {
			display: flex;
			align-items: center;
			gap: 1rem;
		}
		.collection-select {
			justify-content: space-between;
			background-color: var(--input);
			padding: 0.5rem 1rem;
			width: 100%;
			border-radius: 10px;
			${breakpoints(
				size.md,
				`{
        width: 40%;
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
		width: 100%;
	}
	.pagination-controls {
		margin: 3rem 0 2rem 0;
	}
`;

interface MySidesProps {
	collections: Collection[];
}

interface paginationProps {
	currentPage: number;
	pageSize: number;
}

const paginationInitialState = {
	currentPage: 1,
	pageSize: 9
};

const searchFiltersInitialState = {
	collections: 'all',
	elegibility: 'all',
	selectedCollection: '',
	verifiedCollections: false
};

const MySides = ({ collections }: MySidesProps) => {
	const [alertsBySide, setAlertsBySide] = useState<any>([]);
	const [messagesBySide, setMessagesBySide] = useState<any>([]);
	const [sidesLoading, setSidesLoading] = useState<boolean>(false);
	const [sidesList, setSidesList] = useState<Side[]>([]);
	const [filteredSides, setFilteredSides] = useState<Side[]>([]);
	const [pagination, setPagination] = useState<paginationProps>(paginationInitialState);
	const [searchFilters, setSearchFilters] = useState<searchFiltersProps>(searchFiltersInitialState);
	const [numberOfPages, setNumberOfPages] = useState<number>(0);
	const dispatch = useDispatch();

	const { sides, user, userCollectionsData } = useSelector((state: RootState) => state.user);

	const { lastAnnouncement, lastMessage, staticNotifications } = useNotificationsContext();
	const { walletAddress } = useWalletAddress();

	useEffect(() => {
		setSearchFilters(searchFiltersInitialState);
	}, []);

	useEffect(() => {
		async function getSearchSides() {
			try {
				setSidesLoading(true);
				const sidesData = await sideService.getMany(sides.map(s => s.id));
				const response = await getSidesMetadata(sidesData, userCollectionsData, sides);
				setFilteredSides(response);
			} catch (error) {
				console.error(error);
				toast.error('Ooops! Something went wrong fetching your Sides', { toastId: getRandomId() });
			} finally {
				setSidesLoading(false);
			}
		}
		if (sides.length && Object.keys(userCollectionsData).length) getSearchSides();
	}, [sides, userCollectionsData]);

	useEffect(() => {
		let parsedArray = searchFilters.verifiedCollections
			? filteredSides.filter(
					side => side.firstCollection?.safelistRequestStatus === OpenSeaRequestStatus.verified
			  )
			: filteredSides;
		if (searchFilters.collections?.split(',')?.length && searchFilters.collections?.split(',')[0] !== 'all') {
			parsedArray = parsedArray.filter(side =>
				Object.keys(side.conditions).includes(searchFilters.collections?.split?.(',')?.[0] || '')
			);
		}
		const { array, pages } = paginateArray({
			array: parsedArray,
			currentPage: pagination.currentPage,
			pageSize: pagination.pageSize
		});
		setNumberOfPages(pages);
		setSidesList(array);
	}, [filteredSides, pagination, searchFilters]);

	const setRoomNotifications = useCallback(async (notifications: any[]) => {
		setMessagesBySide(notifications.filter(notification => notification.type === NotificationType.Private));
		setAlertsBySide(notifications.filter(notification => notification.type === NotificationType.Channel));
	}, []);

	useEffect(() => {
		if (walletAddress && staticNotifications?.length) setRoomNotifications(staticNotifications);
	}, [staticNotifications, walletAddress]);

	useEffect(() => {
		if (lastAnnouncement && walletAddress) setAlertsBySide((prevState: any) => [...prevState, lastAnnouncement]);
	}, [lastAnnouncement, walletAddress]);

	useEffect(() => {
		if (lastMessage && walletAddress) setMessagesBySide((prevState: any) => [...prevState, lastMessage]);
	}, [lastMessage, walletAddress]);

	const handleEligibilityCheck = (side: Side) => {
		dispatch(setEligibilityOpen({ open: true, side: side }));
	};

	return (
		<>
			<MySidesStyled className="fade-in">
				<h2 className="title">My sides ({filteredSides.length})</h2>

				<div className="my-sides-toolbar">
					<div className="collection-select">
						<label>Collection</label>
						<CustomSelect
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

					<div className="verified-checkbox">
						<CustomCheckbox
							isChecked={searchFilters.verifiedCollections}
							label="Only with verified collections"
							name="only-verified"
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
								alerts={alertsBySide}
								messages={messagesBySide}
								side={side}
								userProfiles={user?.profiles || []}
								userSides
								onJoin={handleEligibilityCheck}
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
					totalPages={numberOfPages}
				/>
			</MySidesStyled>
		</>
	);
};

export default MySides;
