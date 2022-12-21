import React, { forwardRef, useRef, useState } from 'react';
import styled from 'styled-components';
import { Grid } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';

import InputText from './InputText';

import useDebounceValue from '../../hooks/useDebounceValue';

const GifModuleStyled = styled.div`
	position: absolute;
	display: flex;
	flex-direction: column;
	height: 400px;
	overflow: hidden;
	bottom: 50px;
	right: 0;
	background-color: var(--panels);
	padding: 0.5rem;
	padding-bottom: 0;
	border-radius: 6px;
	.giphy-grid {
		flex: 1 1 0;
		overflow-x: hidden;
		overflow-y: scroll;
		scrollbar-width: thin;
	}
`;

interface GifsModulePropTypes {
	onCloseModal?: () => void;
	onSubmit?: (gifUrl: string) => void;
	width?: number;
}

const giphyService = new GiphyFetch(process.env.REACT_APP_GIPHY_API_KEY || '');

const GifsModule = forwardRef((props: GifsModulePropTypes, ref: React.Ref<HTMLDivElement> | null) => {
	const $searchRef = useRef<HTMLInputElement>(null);

	const [searchValue, setSearchValue] = useState<string>('');

	const debounceValue = useDebounceValue(searchValue);

	const fetchGifs = (offset: number) => {
		return debounceValue
			? giphyService.search(debounceValue, { offset, limit: 10 })
			: giphyService.trending({ offset, limit: 10 });
	};

	return (
		<GifModuleStyled>
			<div className="giphy-grid">
				<Grid
					className="pointer"
					columns={3}
					fetchGifs={fetchGifs}
					hideAttribution
					noLink
					onGifClick={gif => {
						props.onSubmit?.(gif.id?.toString());
						props.onCloseModal?.();
					}}
					key={debounceValue}
					width={props.width || 300}
				/>
			</div>
			<InputText
				bgColor="var(--black-transparency-20)"
				border="1px solid var(--disable)"
				className="mt-2"
				focus
				glass
				height={44}
				iconRightPos={{ top: 19, right: 18 }}
				id="sendmessage"
				onChange={(event: any) => {
					setSearchValue(event.target.value);
				}}
				placeholder={'Search GIFs'}
				radius="10px"
				ref={$searchRef}
				size={14}
				weight={600}
			/>
		</GifModuleStyled>
	);
});

export default GifsModule;
