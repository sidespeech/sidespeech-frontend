import React, { forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Gif } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Editor } from 'react-draft-wysiwyg';
import { ContentBlock, ContentState, convertFromRaw, EditorState } from 'draft-js';
import { markdownToDraft } from 'markdown-draft-js';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './MessageContent.css';

interface MessageContentPropTypes {
    bgColor?: string;
    border?: string;
    color?: string;
    defaultValue?: string;
    disabled?: any;
    imageUpload?: boolean;
    height?: number;
    iconSize?: number;
    id?: any;
    maxLength?: number;
    maxWidth?: number;
    message?: string;
    parentWidth?: number | string;
    padding?: string;
    radius?: string;
    size?: number;
    weight?: number;
    width?: number | string;
}

interface MessageContentProps {
    bgColor?: string;
    border?: string;
    color?: string;
    disabled?: any;
    height?: number | string;
    id?: any;
    maxLength?: number;
    maxWidth?: number;
    padding?: string;
    parentWidth?: number | string;
    radius?: string;
    size?: number;
    weight?: number;
    width?: number | string;
}

const EditorStyled = styled(Editor)<MessageContentProps>`
    max-width: ${(props) => (props.maxWidth ? props.maxWidth : '')}px;
    width: ${(props) => (props.width ? props.width : '100%')};
    border: ${(props) => (props.border ? props.border : '')};
    background-color: ${(props) => (props.bgColor ? props.bgColor : 'var(--input)')};
    border-radius: ${(props) => (props.radius ? props.radius : '40px')};
    height: ${(props) => (props.height ? props.height : 35)}px;
    color: ${(props) => (props.color ? props.color : 'var(--inactive)')};
    padding: ${(props) => (props.padding ? props.padding : '0px 20px')};
    font-size: ${(props) => (props.size ? props.size : '15')}px;
    font-weight: ${(props) => (props.weight ? props.weight : '400')};
`;

const giphyService = new GiphyFetch(process.env.REACT_APP_GIPHY_API_KEY || '');

interface CustomImagePropTypes {
    src: string;
    alt?: string;
}

const CustomImage = (props: CustomImagePropTypes) => {
    const fileExtension = props.alt?.split('.').pop() || '';

    return (
        <div className="image-item">
            <img src={props.src} alt={props.alt} />
            <div className="image-actions">
                <a className="download-btn" href={props.src} download={`${props.src}.${fileExtension}`}>
                    <i className="fa-solid fa-download" />
                </a>
            </div>
        </div>
    );
};

interface CustomGifPropTypes {
    gifId: string;
}

const CustomGif = (props: CustomGifPropTypes) => {
    const [gif, setGif] = useState<any>(null);

    const fetchGifs = async (id: string) => {
        try {
            const { data } = await giphyService.gif(id);
            setGif(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchGifs(props.gifId);
    }, []);

    if (!gif) return null;

    return <Gif gif={gif} hideAttribution noLink width={400} />;
};

const emojiRegex = /<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu;

const emojiStrategy = (
    contentBlock: ContentBlock,
    callback: (start: number, end: number) => void,
    contentState: ContentState
) => {
    findWithRegex(emojiRegex, contentBlock, callback);
};

function findWithRegex(regex: RegExp, contentBlock: ContentBlock, callback: (start: number, end: number) => void) {
    const text = contentBlock.getText();
    let matchArr, start;
    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        callback(start, start + matchArr[0].length);
    }
}

const compositeDecorators = [
    {
        strategy: emojiStrategy,
        component: (props?: any | undefined) => <span className="emoji-item">{props.children}</span>
    }
];

const MessageContent = forwardRef((props: MessageContentPropTypes, ref: React.Ref<Editor> | null) => {
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
    const [imagesArray, setImagesArray] = useState<CustomImagePropTypes[]>([]);

    useEffect(() => {
        const draftState = markdownToDraft(props.message?.split('[IMAGES]')[0] || '');
        const contentState = convertFromRaw(draftState);
        const newEditorState = EditorState.createWithContent(contentState);

        setEditorState(newEditorState);
    }, [props.message]);

    useEffect(() => {
        const imagesMarker = /\[IMAGES\]/gi;
        const imageRegex = /!\[(.*?)\]\((.*?)\)/gi;
        const imagesMatch = imagesMarker.exec(props?.message || '');

        if (imagesMatch) {
            const markdownArray = props?.message?.split('[IMAGES]')[1].match(imageRegex) || [];
            const imagesObjectsArray = markdownArray.map((imgMd) => ({
                src: imgMd.trim().split('](')[1].split('"')[0].trim(),
                alt: imgMd.trim().split('![')[1].split(']')[0]
            }));
            setImagesArray(imagesObjectsArray);
        }
    }, [props.message]);

    if (!props.message) return null;

    const gifRegex = /\[GIPHY\]![a-zA-Z0-9^]/gi;
    const gifArray = gifRegex.exec(props.message);

    if (gifArray) return <CustomGif gifId={props.message.split('!')[1]} />;

    return (
        <div>
            <div className="relative flex align-end" style={{ width: props.parentWidth ? props.parentWidth : '100%' }}>
                <EditorStyled
                    bgColor={props.bgColor}
                    border={props.border}
                    color={props.color}
                    customDecorators={compositeDecorators}
                    disabled={props.disabled}
                    editorClassName="message-content-editor"
                    editorState={editorState}
                    height={props.height}
                    id={props.id}
                    maxLength={props.maxLength}
                    radius={props.radius}
                    readOnly
                    ref={ref}
                    size={props.size}
                    toolbarHidden
                    toolbarClassName="message-content-toolbar"
                    weight={props.weight}
                    width={props.width}
                    wrapperClassName="flex-1 message-content-wrapper"
                />
            </div>

            {!!imagesArray.length && (
                <div className="images-wrapper flex gap-20">
                    {imagesArray.map((imageObject) => (
                        <CustomImage src={imageObject.src} alt={imageObject.alt} />
                    ))}
                </div>
            )}
        </div>
    );
});

export default MessageContent;
