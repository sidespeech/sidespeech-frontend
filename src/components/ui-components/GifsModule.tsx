import React, { forwardRef, useRef, useState } from 'react';
import { Grid } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';

import InputText from './InputText';

import './GifsModule.css';

interface GifsModulePropTypes {
    onCloseModal?: any;
    width?: number;
}

const giphyService = new GiphyFetch(process.env.REACT_APP_GIPHY_API_KEY || '')

const GifsModule = forwardRef((props: GifsModulePropTypes, ref: React.Ref<HTMLDivElement> | null) => {
    const $searchRef = useRef<HTMLInputElement>(null)

    const [ searchValue, setSearchValue ] = useState<string>('');

    const fetchGifs = (offset: number) => {
        return searchValue ? giphyService.search(searchValue, {offset, limit: 10}) : giphyService.trending({ offset, limit: 10 })
    }

    return (
        <div
            className="giphy-grid_wrapper"
        >
            <div className="giphy-grid">
                <Grid 
                    className='pointer'
                    columns={3} 
                    fetchGifs={fetchGifs}
                    hideAttribution
                    noLink
                    onGifClick={(gif, ev) => {
                        console.log(gif);
                        props.onCloseModal();
                    }}
                    key={searchValue}
                    width={props.width || 300}
                />
            </div>
            <InputText 
                focus
                glass
                height={55}
                iconRightPos={{ top: 19, right: 18 }}
                id="sendmessage"
                onChange={(event: any) => {
                    setSearchValue(event.target.value);
                }}
                placeholder={"Search GIFs"}
                radius="10px"
                ref={$searchRef}
                size={14}
                weight={600}
            />
        </div>
        )
})

export default GifsModule;