import styled from 'styled-components';
import emptyScreenImg from '../../../assets/channel_empty_screen_shape.svg';
import { Channel } from '../../../models/Channel';
import Icons from '../../ui-components/ChannelIcons';

const EmptyListStyled = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	.empty-list_wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-image: url(${emptyScreenImg});
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center bottom;
		width: 580px;
		margin-top: 15vh;
		padding-bottom: 10rem;
		& .empty-list_icon {
			display: block;
			background-color: var(--disable);
			padding: 1.2rem;
			border-radius: 10rem;
			& svg {
				transform: scale(1.4);
				& path {
					fill: var(--text);
				}
			}
		}
		& .empty-list_title {
			margin-bottom: 0.5rem;
		}
		& .empty-list_description {
			color: var(--inactive);
		}
	}
`;

function EmptyList({ selectedChannel }: { selectedChannel?: Channel | null }) {
	const Icon = Icons[selectedChannel?.type || 0];
	return (
		<EmptyListStyled>
			<div className="empty-list_wrapper">
				<span className="empty-list_icon">
					<Icon />
				</span>
				<h2 className="empty-list_title">Welcome to {selectedChannel?.name}</h2>
				<p className="empty-list_description">This is the beginning of the channel!</p>
			</div>
		</EmptyListStyled>
	);
}

export default EmptyList;
