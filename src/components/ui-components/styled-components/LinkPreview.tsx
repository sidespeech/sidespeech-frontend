import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { breakpoints, size } from '../../../helpers/breakpoints';
import { LinkPreview } from '../../../models/LinkPreview';
import linkPreviewService from '../../../services/api-services/link-preview.service';

const LinkPreviewStyled = styled.a<{ size: 'default' | 'small' }>`
	display: flex;
	flex-direction: column;
	max-width: ${props => (props.size === 'small' ? '300px' : 'calc(400px + 2rem)')};
	background-color: var(--white-transparency-10);
	padding: 0.8rem;
	gap: 1rem;
	color: inherit;
	overflow: hidden;
	border-radius: 7px;
	box-sizing: content-box;
	${props =>
		breakpoints(
			size.md,
			`{
			height: ${props.size === 'small' ? '' : '150px'};
		flex-direction: row;
	}`
		)}
	& .image-wrapper,
	& .video-wrapper {
		height: 200px;
		width: 100%;
		flex-shrink: 0;
		${breakpoints(
			size.md,
			`{
			height: 150px;
			width: 150px;
		}`
		)}
		& img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
	& .video-wrapper {
		& iframe {
			height: 200px;
			width: 100%;
			${breakpoints(
				size.md,
				`{
				height: 150px;
				width: 150px;
			}`
			)}
		}
	}
	& .content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex-grow: 1;
		width: 100%;
		max-height: 120px;
		overflow: hidden;
		${breakpoints(
			size.md,
			`{
			width: 250px;

		}`
		)}
		& .title-wrapper {
			display: flex;
			gap: 0.5rem;
			align-items: center;
			& .favicon {
				flex-shrink: 0;
				display: inline-block;
				width: 1rem;
				height: 1rem;
				& img {
					width: 100%;
					object-fit: contain;
				}
			}
			& .title {
				font-weight: 700;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
		& .description {
			white-space: ${props => (props.size === 'small' ? 'nowrap' : 'wrap')};
			overflow: ${props => (props.size === 'small' ? 'hidden' : 'visible')};
			text-overflow: ${props => (props.size === 'small' ? 'ellipsis' : '')};
		}
	}
`;

const createEmbedLinkForYoutube = (url: string): string => {
	if (url.indexOf('embed') !== -1) return url;
	if (url.split('v=')?.[1]) return `https://www.youtube.com/embed/${url.split('v=')[1]}`;
	else if (url.split('/v/')?.[1]) return `https://www.youtube.com/embed/${url.split('/v/')[1]}`;
	return '';
};

const LinkPreviewComponent = ({
	className = '',
	size = 'default',
	url,
	youtube,
	...rest
}: {
	className?: string;
	size?: 'default' | 'small';
	url: string;
	youtube?: boolean;
}) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<LinkPreview | null>(null);

	useEffect(() => {
		const getLinkMetadata = async (_url: string) => {
			try {
				setLoading(true);
				const response = await linkPreviewService.getLinkMetadata(_url);
				setData(response);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		getLinkMetadata(url);
	}, [url]);

	if (loading)
		return (
			<a href={url} target="_blank" rel="noreferrer">
				{url}
			</a>
		);

	if (!data)
		return (
			<a href={url} target="_blank" rel="noreferrer">
				{url}
			</a>
		);

	return (
		<>
			<a href={url} target="_blank" rel="noreferrer">
				{url}
			</a>
			<LinkPreviewStyled
				className={className}
				href={url}
				target="_blank"
				rel="noreferrer"
				size={youtube || data.images?.length ? size : 'small'}
				{...rest}
			>
				{size === 'default' && (
					<>
						{youtube ? (
							<div className="video-wrapper">
								<iframe
									src={createEmbedLinkForYoutube(url)}
									title="YouTube video player"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								/>
							</div>
						) : data.images?.length ? (
							<div className="image-wrapper">
								<img src={data.images[0]} alt={data.title} />
							</div>
						) : null}
					</>
				)}
				<div className="content">
					<div className="title-wrapper">
						{data.favicons.length && (
							<span className="favicon">
								<img src={data.favicons[0]} alt="favicon" />
							</span>
						)}
						<p className="title">{data?.title}</p>
					</div>
					<p className="description">{data?.description}</p>
				</div>
			</LinkPreviewStyled>
		</>
	);
};

export default LinkPreviewComponent;
