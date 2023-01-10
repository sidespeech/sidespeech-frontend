import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGnosisSafe } from '../../hooks/useGnosisSafe';
import { appDataState } from '../../redux/Slices/InterfaceSelectors';
import { setSelectedDao } from '../../redux/Slices/AppDatasSlice';
import SafeDashboard from './GnosisSafeContent/SafeDashboard';
import Nfts from './GnosisSafeContent/Nfts';
import ProposalComponent from './GnosisSafeContent/ProposalComponent';
import FundingRounds from './GnosisSafeContent/FundingRounds';
import Members from './GnosisSafeContent/Members';
import Transactions from './GnosisSafeContent/Transactions';

const MenuItem = styled.div<any>`
	display: flex;
	align-items: flex-start;
	padding: 8px 18px;
	cursor: pointer;
	background-color: ${props => (props.selected ? 'var(--green)' : 'var(--white-transparency-10)')};
	color: ${props => (props.selected ? 'black' : 'var(--white)')};
	border-radius: 7px;
	white-space: nowrap;
`;

const GnosisMain = styled.div`
	max-height: calc(100vh - 10vh);
	overflow: hidden;
	display: flex;
	flex-direction: column;
`;
const GnosisContent = styled.div`
	display: flex;
	width: 100%;
	overflow: hidden;
	padding-bottom: 15px;
`;

const menu = ['Dashboard', 'NFTs', 'Proposals', 'Funding rounds', 'Members', 'Transactions'];

export default function GnosisSafe() {
	const { currentSafe, sendTokenToFundingRound } = useGnosisSafe();
	const { displayDao, currentSide } = useSelector(appDataState);
	const [selectedItem, setSelectedItem] = useState<number>(2);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (currentSide && !currentSide.isDaoActive) navigate('/side' + currentSide.slug);
		if (!displayDao) dispatch(setSelectedDao(true));
	}, [displayDao, currentSide]);

	const handleSelectedMenu = (index: number) => {
		setSelectedItem(index);
	};

	const renderGnosisContent = () => {
		let content;
		switch (selectedItem) {
			case 0:
				content = <SafeDashboard />;
				break;
			case 1:
				content = <Nfts />;
				break;
			case 2:
				content = <ProposalComponent />;
				break;
			case 3:
				content = <FundingRounds />;
				break;
			case 4:
				content = <Members />;
				break;
			case 5:
				content = <Transactions />;
				break;
			default:
				content = <SafeDashboard />;
				break;
		}
		return content;
	};

	return (
		<GnosisMain className="px-4 ">
			<div className="flex fw-700 gap-15 mb-4">
				{menu.map((item, index) => (
					<MenuItem selected={index === selectedItem} onClick={() => handleSelectedMenu(index)} key={item}>
						{item}
					</MenuItem>
				))}
			</div>
			<GnosisContent>{renderGnosisContent()}</GnosisContent>
		</GnosisMain>
	);
}
