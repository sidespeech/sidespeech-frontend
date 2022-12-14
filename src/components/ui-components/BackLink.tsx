import React from 'react';
import styled from 'styled-components';

const BackLinkStyled = styled.div`
	display: flex;
	gap: 1rem;
	align-items: center;
	transition: color 0.2s ease;
	&:hover {
		color: var(--white);
		& svg {
			animation: slide 0.6s ease;
		}
	}

	@keyframes slide {
		50% {
			transform: translateX(-5px);
		}
		100% {
			transform: translateX(0);
		}
	}
`;

const BackLink = () => {
	return (
		<BackLinkStyled>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M7.99984 15.3332L0.666504 7.99984L7.99984 0.666504L9.30609 1.94984L4.17275 7.08317H15.3332V8.9165H4.17275L9.30609 14.0498L7.99984 15.3332Z"
					fill="white"
				/>
			</svg>
			Back
		</BackLinkStyled>
	);
};

export default BackLink;
