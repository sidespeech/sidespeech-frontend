import React from 'react';
import styled from 'styled-components';

const SkeletonStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;
	max-width: 500px;
	& .item {
		width: 100%;
		height: 3rem;
		background-color: var(--white-transparency-10);
		border-radius: 7px;
		animation: beat 1.5s ease-in-out infinite;
		&:nth-of-type(2) {
			animation-delay: 0.3s;
		}
		&:nth-of-type(3) {
			animation-delay: 0.6s;
		}
	}

	@keyframes beat {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
		100% {
			opacity: 1;
		}
	}
`;

const Skeleton = () => {
	return (
		<SkeletonStyled>
			<span className="item" />
			<span className="item" />
			<span className="item" />
		</SkeletonStyled>
	);
};

export default Skeleton;
