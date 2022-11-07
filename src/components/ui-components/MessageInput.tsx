import React, { forwardRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, EditorState, Modifier } from 'draft-js';
import { draftToMarkdown } from 'markdown-draft-js';
import { apiService } from "../../services/api.service";

import boldIcon from "../../assets/bold.svg"
import codeIcon from "../../assets/code.svg"
import gifIcon from "../../assets/gif.svg"
import italicIcon from "../../assets/italic.svg"
import linkIcon from "../../assets/link.svg"
import redoIcon from "../../assets/rotate-right.svg"
import sendicon from "../../assets/send-icon.svg";
import strikeThroughIcon from "../../assets/strikethrough.svg"
import underlineIcon from "../../assets/underline.svg"
import undoIcon from "../../assets/rotate-left.svg"
import outdentIcon from "../../assets/outdent.svg"
import indentIcon from "../../assets/indent.svg"
import orderedIcon from "../../assets/list-ol.svg"
import unorderedIcon from "../../assets/list-ul.svg"

import EmojisModule from "./EmojisModule";
import GifsModule from "./GifsModule";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import './MessageInput.css';
import { getBase64, getRandomId } from "../../helpers/utilities";

interface MessageInputPropsType {
    bgColor?: string;
    border?: string;
    color?: string;
    defaultValue?: string;
    disabled?: any;
    editorState?: EditorState;
    imageUpload?:  boolean,
    height?: number;
    iconSize?: number;
    id?: any;
    maxLength?: number;
    maxWidth?: number;
    onChange?: any;
    onEditorStateChange?: any;
    onKeyUp?: any;
    onSubmit: (state: string) => void;
    parentWidth?: number | string;
    padding?: string;
    placeholder?: string;
    placeholderColor?: string;
    placeholderSize?: number;
    placeholderWeight?: number;
    radius?: string;
    size?: number;
    toolbar?: boolean;
    weight?: number;
    width?: number | string;
}

interface MessageInputProps {
    bgColor?: string;
    border?: string;
    color?: string;
    disabled?: any;
    height?: number | string;
    id?: any;
    maxLength?: number;
    maxWidth?: number;
    onEditorStateChange: any;
    padding?: string;
    parentWidth?: number | string;
    placeholderColor?: string;
    placeholderWeight?: number;
    placeholderSize?: number;
    radius?: string;
    size?: number;
    weight?: number;
    width?: number | string;
}

const EditorSyled = styled(Editor)<MessageInputProps>`
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
  &::placeholder {
    color: ${(props) =>
      props.placeholderColor
        ? props.placeholderColor
        : "#B4C1D266"};
    font-size: ${(props) =>
      props.placeholderSize ? props.placeholderSize : "15"}px;
    font-weight: ${(props) =>
      props.placeholderWeight ? props.placeholderWeight : "400"};
  }
`;

interface ImageToUpload {
  file: string;
  id: string;
  uploading?: boolean;
  url?: string;
}

const MessageInput = forwardRef((props: MessageInputPropsType, ref: React.Ref<Editor> | null) => {
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
    const [isEmojiMenuOpen, setIsEmojiMenuOpen] = useState<boolean>(false);
    const [isGiphyOpen, setIsGiphyOpen] = useState<boolean>(false);
    const [imagesToUpload, setImagesToUpload] = useState<ImageToUpload[]>([]);
    const [toolbarhidden, setToolbarHidden] = useState<boolean>(true);

    const toolbarOptions = ['inline', 'link', 'list', 'history'];

    const imageInputId = getRandomId();

    const handleAddEmoji = (emoji: string): void => {
      setIsEmojiMenuOpen(false);
      
      const contentState = Modifier.replaceText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        emoji,
        editorState.getCurrentInlineStyle()
      );
      
      const newContentState = EditorState.push(editorState, contentState, 'insert-characters')
      setEditorState(newContentState);
    }

    const handleSubmitGif = (gifId: string): void => {
      const gifMarkdown = `[GIPHY]!${gifId}`;
      if (gifId) props.onSubmit(gifMarkdown);
    }

    // Iterate through files array and upload each file

    const handleUploadFiles = (images: FileList | null): void => {
      if (!images) return;
      for (let i=0;i<images.length;i++) {
        handleUploadFile(images[i]);
      }
    }

    // Upload a single file and update state within the message input

    const handleUploadFile = async (image: File | undefined): Promise<void> => {
      try {        
        if (!image) throw new Error('No file selected');
        if (imagesToUpload.length >= 4) throw new Error('You can upload up to 4 images at a time');
        const supportedImageExtensions = ['jpg', 'jpeg', 'gif', 'png', 'svg', 'webp']
        const fileExtension = image.name.split('.').pop() || '';
        if(!supportedImageExtensions.includes(fileExtension)) throw new Error('The file should be an image');
        if((Math.round(image.size/1024)/1000) > 2) throw new Error('Please insert an image up to 2Mb');

        const imageBase64 = await getBase64(image);

        setImagesToUpload(prevState => ([
          ...prevState,
          {
            file: imageBase64,
            id: imageBase64.substring(0, 256),
            uploading: true,
            url: '',
          }
        ]))

        const formData = new FormData();
        formData.append('file', image);
        const uploadedUrl = await apiService.uploadImage(formData);
        if (uploadedUrl) {
          const imageMarkdown = `![${image.name}](${uploadedUrl} "${image.name}")`;

          setImagesToUpload(previousState => ([
            ...previousState.filter(img => img.id !== imageBase64.substring(0, 256)),
            {
              file: imageBase64,
              id: imageBase64.substring(0, 256),
              uploading: false,
              url: imageMarkdown
            }          
          ]));
        }
      } catch (error: any) {
        toast.error(error?.message || 'Error', { toastId: 3 });
      }
    }

    const handleRemoveImageFromArray = (imageId: string): void => {
      setImagesToUpload(prevState => (prevState.filter(img => img.id !== imageId)));
    }
    
    const handleSubmit = (): void => {
      const stateContent = editorState.getCurrentContent();
      const rawState = convertToRaw(stateContent);
      let message = draftToMarkdown(rawState);

      if (imagesToUpload?.length) {
        const arrayOfImagesMarkdown = imagesToUpload.map(img => img.url).join('  ')
        message = `${message} [IMAGES] ${arrayOfImagesMarkdown}`;
      }
      
      if (message.trim()) {
        props.onSubmit(message);
        setEditorState(EditorState.createEmpty());
        setImagesToUpload([]);
      }
    }

  return (
    <div>
      <div
        className="relative"
        style={{ width: props.parentWidth ? props.parentWidth : "100%" }}
      >      
        <EditorSyled 
            bgColor={props.bgColor}
            border={props.border}
            color={props.color}
            disabled={props.disabled}
            editorClassName="message-intput-editor"
            editorState={editorState}
            height={props.height}
            id={props.id}
            maxLength={props.maxLength}
            onEditorStateChange={(state: EditorState) => {
              if (isGiphyOpen) setIsGiphyOpen(false);
              if (isEmojiMenuOpen) setIsEmojiMenuOpen(false);
              setEditorState(state);
            }}
            placeholder={props.placeholder}
            placeholderColor={props.placeholderColor}
            placeholderSize={props.placeholderSize}
            placeholderWeight={props.placeholderWeight}
            radius={props.radius}
            ref={ref}
            size={props.size}
            toolbarHidden={!props.toolbar}
            toolbar={{
              options: toolbarOptions,
              inline: {
                options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
                bold: { icon: boldIcon, className: 'bordered-option-classname' },
                italic: { icon: italicIcon, className: 'bordered-option-classname' },
                underline: { icon: underlineIcon, className: 'bordered-option-classname' },
                strikethrough: { icon: strikeThroughIcon, className: 'bordered-option-classname' },
                monospace: { icon: codeIcon, className: 'bordered-option-classname' },
              },
              link: {
                popupClassName: 'toolbar-popup',
                showOpenOptionOnHover: true,
                options: ['link'],
                link: { icon: linkIcon, className: 'bordered-option-classname' }
              },
              list: {
                options: ['unordered', 'ordered', 'indent', 'outdent'],
                unordered: { icon: unorderedIcon, className: 'bordered-option-classname' },
                ordered: { icon: orderedIcon, className: 'bordered-option-classname' },
                indent: { icon: indentIcon, className: 'bordered-option-classname' },
                outdent: { icon: outdentIcon, className: 'bordered-option-classname' },
              },
              history: { 
                undo: { icon: undoIcon, className: 'bordered-option-classname' },
                redo: { icon: redoIcon, className: 'bordered-option-classname' },
              },
            }}
            toolbarClassName="message-input-toolbar"
            weight={props.weight}
            width={props.width}
            wrapperClassName={`flex-1 message-input-wrapper ${imagesToUpload?.length ? 'loading-images' : ''}`}
        />

        <div className="absolute flex align-center ml-3 mr-3" style={{bottom: 10, right: 10, zIndex: 3}}>
          <button
            className="pointer toolbar-button"
            onClick={handleSubmit}
            disabled={
              (!editorState.getCurrentContent().getPlainText('\u0001') && !imagesToUpload?.length) 
              || !!imagesToUpload?.filter(img => img.uploading)?.length
            }
          >
            <img src={sendicon} alt="send-icon" />
          </button>

          {!!props.toolbar && (
            <button
              className="pointer ml-2 pr-2 pl-2 pt-1 pb-1 toolbar-button"
              onClick={() => setToolbarHidden(state => !state)}
              style={toolbarhidden ? {} : {borderBottom: '1px solid var(--text-secondary-dark)', backgroundColor: 'var(--bg-primary)'}}
              >
              <i style={{fontSize: '1rem', color: 'var(--text-secondary)'}} className="fa-sharp fa-solid fa-font" />
            </button>
          )}

          <div>
            <button
              onClick={() => {
                setIsGiphyOpen(false);
                setIsEmojiMenuOpen(state => !state);
              }}
              className="pointer ml-2 pr-2 pl-2 pt-1 pb-1 toolbar-button"
            >
              <i style={{fontSize: '1rem', color: 'var(--text-secondary)'}} className="fa-solid fa-face-smile" />
            </button>

            {isEmojiMenuOpen && (
              <EmojisModule onAddEmoji={handleAddEmoji} />
            )}
          </div>

          {!!props.imageUpload && (
            <label htmlFor={imageInputId}>
              <input 
                id={imageInputId} 
                name={imageInputId} 
                accept="image/*"
                multiple
                onChange={(ev) => handleUploadFiles(ev.target.files)}
                style={{
                  position: 'absolute', 
                  pointerEvents: 'none', 
                  opacity: '0', 
                  zIndex: '-1'
                }} 
                type="file" 
              />
              <div
                className="pointer ml-2 pr-2 pl-2 pt-1 pb-1 toolbar-button"
                onClick={() => {
                  if(isGiphyOpen) setIsGiphyOpen(false);
                  if(isEmojiMenuOpen) setIsEmojiMenuOpen(false);
                }}
              >
                <i style={{fontSize: '1.1rem', color: 'var(--text-secondary)'}} className="fa-solid fa-image" />
              </div>
            </label>
          )}

          <div>
            <button
              className="pointer flex align-center ml-2 pr-1 pl-1 pt-1 pb-1  toolbar-button"
              onClick={() => {
                setIsEmojiMenuOpen(false);
                setIsGiphyOpen(state => !state)}}
            >
              <img style={{height: '18px'}} src={gifIcon} alt="gif-icon" />

            </button>
            
            {isGiphyOpen && (
              <GifsModule 
                onCloseModal={() => setIsGiphyOpen(false)} 
                onSubmit={handleSubmitGif} 
              />
            )}
          </div>
        </div>
      </div>

      {!!imagesToUpload.length && (
          <div className="images-to-upload-wrapper">
          {imagesToUpload?.map(imageObject => (
            <div className={`images-to-upload-item ${imageObject.uploading ? 'uploading' : ''}`}>
              <img src={imageObject.file} alt="" />
              {imageObject.uploading && <div className="message-input-spinner" />}
              <div className="image-actions">
                <button onClick={() => handleRemoveImageFromArray(imageObject.id)}>
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default MessageInput;
