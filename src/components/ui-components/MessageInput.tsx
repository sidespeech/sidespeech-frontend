import React, { forwardRef, useState } from "react";
import styled from "styled-components";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import boldIcon from "../../assets/bold.svg"
import codeIcon from "../../assets/code.svg"
import emojiIcon from "../../assets/face-smile.svg"
import gifIcon from "../../assets/gif.svg"
import imageIcon from "../../assets/image.svg"
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
import emojisArray from "../../assets/emojisArray"

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import './MessageInput.css';

interface MessageInputPropsType {
    bgColor?: string;
    border?: string;
    color?: string;
    defaultValue?: string;
    disabled?: any;
    editorState?: EditorState;
    handleUploadFile?:  (image: File) => Promise<string>,
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

const MessageInput = forwardRef((props: MessageInputPropsType, ref: any) => {
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
    const [toolbarhidden, setToolbarHidden] = useState<boolean>(true);

    const toolbarOptions = ['inline', 'link', 'list', 'history', 'emoji'];

    if (props.handleUploadFile) toolbarOptions.splice(4, 0, 'image');

    const handleSubmit = (): void => {
      props.onSubmit(editorState.getCurrentContent().getPlainText());
      setEditorState(EditorState.createEmpty());
    }

  return (
    <div
      className="relative flex align-end"
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
            onEditorStateChange={(state: EditorState) => setEditorState(state)}
            placeholder={props.placeholder}
            placeholderColor={props.placeholderColor}
            placeholderSize={props.placeholderSize}
            placeholderWeight={props.placeholderWeight}
            radius={props.radius}
            ref={ref}
            size={props.size}
            toolbarHidden={toolbarhidden}
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
              emoji: { 
                emojis: emojisArray,
                icon: emojiIcon, 
                className: 'bordered-option-classname', 
                popupClassName: 'toolbar-popup' 
              },
              image: { 
                alignmentEnabled: false,
                className: 'bordered-option-classname', 
                icon: imageIcon, 
                popupClassName: 'toolbar-popup',
                previewImage: true,
                uploadCallback: props.handleUploadFile,
                urlEnabled: false
              },
              history: { 
                undo: { icon: undoIcon, className: 'bordered-option-classname' },
                redo: { icon: redoIcon, className: 'bordered-option-classname' },
              },
            }}
            toolbarClassName="message-input-toolbar"
            weight={props.weight}
            width={props.width}
            wrapperClassName="flex-1 message-input-wrapper"
        />
        <div className="absolute flex align-center ml-3 mr-3" style={{bottom: 10, right: 10, zIndex: 3}}>
          <span
            className="pointer flex align-center mr-3 pr-1 pl-1 pt-1 pb-1 toolbar-icon"
            // onClick={null}
          >
            <img style={{height: '18px'}} src={gifIcon} alt="gif-icon" />
          </span>

          <span
            className="pointer mr-3 pr-1 pl-1 pt-1 pb-1 toolbar-icon"
            onClick={() => setToolbarHidden(bool => !bool)}
            style={toolbarhidden? {} : {borderBottom: '1px solid var(--text-secondary-dark)', backgroundColor: 'var(--bg-primary)'}}
          >
            <i className="fa-sharp fa-solid fa-font"></i>
          </span>

          <span
            className="pointer send-icon"
            onClick={handleSubmit}
            >
            <img src={sendicon} alt="send-icon" />
          </span>
        </div>
    </div>
  );
});

export default MessageInput;
