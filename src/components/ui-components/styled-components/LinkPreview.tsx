import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LinkPreview } from '../../../models/LinkPreview';
import linkPreviewService from '../../../services/api-services/link-preview.service';

const LinkPreviewStyled = styled.a`
	display: flex;
	max-width: calc(400px + 2rem);
	background-color: var(--white-transparency-10);
	padding: 0.5rem;
	gap: 1rem;
	color: inherit;
	max-height: 150px;
	overflow: hidden;
	border-radius: 10px;
	& .image-wrapper,
	& .video-wrapper {
		min-height: 100px;
		width: 150px;
		flex-shrink: 0;
		& img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
	& .content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex-grow: 1;
		width: 250px;
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
	}
`;

const LinkPreviewComponent = ({ url, youtube }: { url: string; youtube?: boolean }) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<LinkPreview | null>(null);
	console.log(data);

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
		<LinkPreviewStyled href={url} target="_blank" rel="noreferrer">
			{youtube ? (
				<div className="video-wrapper"></div>
			) : (
				data.images?.length && (
					<div className="image-wrapper">
						<img src={data.images[0]} alt={data.title} />
					</div>
				)
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
	);
};

export default LinkPreviewComponent;
