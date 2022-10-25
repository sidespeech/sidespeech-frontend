import React, { forwardRef, useState } from "react";
import styled from "styled-components";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import boldIcon from "../../assets/bold.svg"
import codeIcon from "../../assets/code.svg"
import emojiIcon from "../../assets/face-smile.svg"
import imageIcon from "../../assets/image.svg"
import italicIcon from "../../assets/italic.svg"
import linkIcon from "../../assets/link.svg"
import redoIcon from "../../assets/rotate-right.svg"
import sendicon from "../../assets/send-icon.svg";
import strikeThroughIcon from "../../assets/strikethrough.svg"
import underlineIcon from "../../assets/underline.svg"
import undoIcon from "../../assets/rotate-left.svg"

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import './MessageInput.css';

interface MessageInputPropsType {
    bgColor?: string;
    border?: string;
    color?: string;
    defaultValue?: string;
    disabled?: any;
    editorState?: typeof EditorState;
    height?: number;
    iconRightPos?: { bottom?: number, top?: number; right?: number, left?: number };
    iconSize?: number;
    id?: any;
    maxLength?: number;
    maxWidth?: number;
    onChange?: any;
    onClick?: any;
    onEditorStateChange?: any;
    onKeyUp?: any;
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
    type: string;
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
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty())
    const [toolbarhidden, setToolbarHidden] = useState<boolean>(true);

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
            onEditorStateChange={(state: EditorState) => {
                setEditorState(state)
                props.onChange(state)
            }}
            placeholder={props.placeholder}
            placeholderColor={props.placeholderColor}
            placeholderSize={props.placeholderSize}
            placeholderWeight={props.placeholderWeight}
            radius={props.radius}
            ref={ref}
            size={props.size}
            toolbarHidden={toolbarhidden}
            toolbar={{
              options: ['inline', 'link', 'emoji', 'image', 'history'],
              inline: {
                options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
                bold: { icon: boldIcon, className: 'bordered-option-classname' },
                italic: { icon: italicIcon, className: 'bordered-option-classname' },
                underline: { icon: underlineIcon, className: 'bordered-option-classname' },
                strikethrough: { icon: strikeThroughIcon, className: 'bordered-option-classname' },
                monospace: { icon: codeIcon, className: 'bordered-option-classname' },
              },
              link: {
                inDropdown: false,
                className: undefined,
                component: undefined,
                popupClassName: undefined,
                dropdownClassName: undefined,
                showOpenOptionOnHover: true,
                defaultTargetOption: '_self',
                options: ['link'],
                link: { icon: linkIcon, className: 'bordered-option-classname' },
                linkCallback: undefined
              },
              emoji: { icon: emojiIcon, className: 'bordered-option-classname' },
              image: { icon: imageIcon, className: 'bordered-option-classname' },
              history: { 
                undo: { icon: undoIcon, className: 'bordered-option-classname' },
                redo: { icon: redoIcon, className: 'bordered-option-classname' },
              },
            }}
            toolbarClassName="message-input-toolbar"
            type={"text"}
            weight={props.weight}
            width={props.width}
            wrapperClassName="flex-1 message-input-wrapper"
        />
        <div className="absolute flex align-center ml-3 mr-3" style={{...props.iconRightPos, zIndex: 3}}>
          <span
            className="pointer mr-3 pr-1 pl-1 pt-1 pb-1"
            onClick={() => setToolbarHidden(bool => !bool)}
            style={toolbarhidden? {} : {borderBottom: '1px solid var(--text-secondary-dark)', backgroundColor: 'var(--bg-primary)'}}
          >
            <i className="fa-sharp fa-solid fa-font"></i>
          </span>

          <span
            className="pointer"
            onClick={props.onClick}
            >
            <img src={sendicon} alt="send-icon" />
          </span>
        </div>
    </div>
  );
});
export default MessageInput;
