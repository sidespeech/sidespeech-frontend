import React, { forwardRef, useEffect, useState } from "react";
import styled from "styled-components";
import { Gif } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Editor } from 'react-draft-wysiwyg';
import { convertFromRaw, EditorState } from 'draft-js';
import { markdownToDraft } from 'markdown-draft-js';

import GifsModule from "./GifsModule";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface MessageContentPropTypes {
    bgColor?: string;
    border?: string;
    color?: string;
    defaultValue?: string;
    disabled?: any;
    imageUpload?:  boolean,
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

const EditorSyled = styled(Editor)<MessageContentProps>`
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : "")}px;
  width: ${(props) => (props.width ? props.width : "100%")};
  border: ${(props) => (props.border ? props.border : "")};
  background-color: ${(props) =>
    props.bgColor ? props.bgColor : "var(--bg-secondary-dark)"};
  border-radius: ${(props) => (props.radius ? props.radius : "40px")};
  height: ${(props) => (props.height ? props.height : 35)}px;
  color: ${(props) =>
    props.color ? props.color : "var(--text-secondary-dark)"};
  padding: ${(props) => (props.padding ? props.padding : "0px 20px")};
  font-size: ${(props) => (props.size ? props.size : "15")}px;
  font-weight: ${(props) => (props.weight ? props.weight : "400")};
`;

const giphyService = new GiphyFetch(process.env.REACT_APP_GIPHY_API_KEY || '')

interface CustomImagePropTypes {
    src: string;
    alt?: string;
}

const CustomImage = (props: CustomImagePropTypes) => {
    return (
        <div style={{width: '400px'}}>
            <img style={{width: '100%'}} src={props.src} alt={props.alt} />
        </div>
    )
}

interface CustomGifPropTypes {
    gifId: string;
}

const CustomGif = (props: CustomGifPropTypes) => {
    const [gif, setGif] = useState<any>(null)

    const fetchGifs = async (id: string) => {
        try {            
            const { data } = await giphyService.gif(id);
            setGif(data);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchGifs(props.gifId)
    }, [])

    if (!gif) return null;
    
    return <Gif gif={gif} hideAttribution noLink width={400} />
}

const MessageContent = forwardRef((props: MessageContentPropTypes, ref: React.Ref<Editor> | null) => {
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

    useEffect(() => {
        const draftState = markdownToDraft(props.message || '');
        const contentState = convertFromRaw(draftState);
        const newEditorState = EditorState.createWithContent(contentState)
        
        setEditorState(newEditorState);
    }, [props.message])

    if (!props.message) return null;

    const imageRegex = /!\[(.*?)\]\((.*?)\)/gi;
    const imageArray = imageRegex.exec(props.message);

    if (imageArray) return <CustomImage src={imageArray[2]} alt={imageArray[1]} />

    const gifRegex = /\[GIPHY\]![a-zA-Z0-9^]/gi;
    const gifArray = gifRegex.exec(props.message);

    if (gifArray) return <CustomGif gifId={props.message.split('!')[1]} />

    return (
        <>
        <div
            className="relative flex align-end"
            style={{ width: props.parentWidth ? props.parentWidth : "100%" }}
        >
            <EditorSyled 
                bgColor={props.bgColor}
                border={props.border}
                color={props.color}
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
        </>
    );
});

export default MessageContent;
