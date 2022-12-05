import React, { forwardRef, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Editor } from 'react-draft-wysiwyg';
import Draft, { convertToRaw, EditorState, Modifier } from 'draft-js';
import { draftToMarkdown } from 'markdown-draft-js';

import boldIcon from '../../assets/bold.svg';
import codeIcon from '../../assets/code.svg';
import gifIcon from '../../assets/gif.svg';
import italicIcon from '../../assets/italic.svg';
import linkIcon from '../../assets/link.svg';
import redoIcon from '../../assets/rotate-right.svg';
import sendicon from '../../assets/send-icon.svg';
import strikeThroughIcon from '../../assets/strikethrough.svg';
import underlineIcon from '../../assets/underline.svg';
import undoIcon from '../../assets/rotate-left.svg';
import outdentIcon from '../../assets/outdent.svg';
import indentIcon from '../../assets/indent.svg';
import orderedIcon from '../../assets/list-ol.svg';
import unorderedIcon from '../../assets/list-ul.svg';

import EmojisModule from './EmojisModule';
import GifsModule from './GifsModule';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { getBase64, getRandomId } from '../../helpers/utilities';
import filesService from '../../services/api-services/files.service';

interface MessageInputPropsType {
	bgColor?: string;
	border?: string;
	color?: string;
	defaultValue?: string;
	disabled?: any;
	editorState?: EditorState;
	imageUpload?: boolean;
	height?: number;
	iconSize?: number;
	keyBindingFn?:any;
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
	keyBindingFn?:any;
	width?: number | string;
}

const MessageInputStyled = styled.div`
	position: relative;
	min-height: 3rem;
	background-color: var(--disable);
	color: var(--text);
	scrollbar-width: none;
	background-color: var(--disable);
	border-radius: 10px;
	& .input-editor-wrapper {
		width: 100%;
		padding: 0 1rem;
		& .message-intput-editor {
			max-height: 250px;
		}
	}

	& a {
		color: #ffffff !important;
		text-decoration: underline !important;
	}

	.message-input-toolbar {
		background-color: var(--disable);
		border-color: var(--disable);
	}

	.message-input-wrapper.loading-images {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.bordered-option-classname {
		padding: 3px 5px;
		background-color: var(--disable);
		border-color: var(--inactive);
		color: var(--inactive);
		&[aria-selected='true'] {
			background-color: var(--disable);
		}

		&:hover {
			box-shadow: none;
		}

		& > img {
			height: 100%;
		}
	}

	.toolbar-popup {
		top: auto;
		bottom: 150%;
		background-color: var(--input);
		border-color: var(--inactive);
		box-shadow: none;
		& .rdw-image-modal-upload-option,
		& .rdw-link-modal-input {
			background-color: var(--input);
			color: var(--inactive);
		}

		& .rdw-image-modal-btn,
		& .rdw-link-modal-btn {
			background-color: var(--input);
			color: var(--inactive);
		}

		& .rdw-image-modal-size {
			display: none;
		}
	}

	.images-to-upload-wrapper {
		display: flex;
		align-items: center;
		gap: 1rem;
		background-color: var(--disable);
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
		padding: 0.5rem 1rem;
		& .images-to-upload-item {
			position: relative;
			width: 100px;
			height: 100px;
			&.uploading img {
				opacity: 0.3;
			}

			& img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

			& .image-actions {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				padding: 0.2rem;
				position: absolute;
				right: 0;
				left: 0;
				top: 0;
			}

			& .image-actions button {
				background-color: var(--disable);
				border: none;
				border-radius: 20px;
				width: 20px;
				height: 20px;
				outline: none;
				box-shadow: none;
			}

			& .image-actions button > i {
				color: var(--inactive);
				font-size: 0.8rem;
			}
		}
	}

	.message-input-spinner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 2;
		width: 50px;
		height: 50px;
		border: 5px solid var(--inactive);
		border-bottom-color: transparent;
		border-radius: 50px;
		animation: 1.5s linear infinite spinner;
	}

	.buttons-wrapper {
		position: absolute;
		display: flex;
		align-items: flex-end;
		gap: 1rem;
		bottom: 10px;
		right: 0;
		margin: 0 1rem;
		height: 100%;
		z-index: 9;
		& .file-input:focus + .toolbar-button {
			outline: 1px solid var(--primary);
		}
		& .toolbar-button {
			background: transparent;
			flex-shrink: 0;
			border-radius: 100px;
			padding: 6px 6px 2px 6px;
			&[disabled] {
				opacity: 0.3;
				cursor: default;
				pointer-events: none;
			}
			&:focus {
				outline: 1px solid var(--primary);
			}
		}
	}

	@keyframes spinner {
		0% {
			transform: translate3d(-50%, -50%, 0) rotate(0deg);
		}
		100% {
			transform: translate3d(-50%, -50%, 0) rotate(360deg);
		}
	}
`;

const EditorSyled = styled(Editor)<MessageInputProps>`
	max-width: ${props => (props.maxWidth ? props.maxWidth : '')}px;
	width: ${props => (props.width ? props.width : '100%')};
	border: ${props => (props.border ? props.border : '')};
	background-color: ${props => (props.bgColor ? props.bgColor : 'var(--input)')};
	border-radius: ${props => (props.radius ? props.radius : '40px')};
	height: ${props => (props.height ? props.height : 35)}px;
	color: ${props => (props.color ? props.color : 'var(--inactive)')};
	padding: ${props => (props.padding ? props.padding : '0px 20px')};
	font-size: ${props => (props.size ? props.size : '15')}px;
	font-weight: ${props => (props.weight ? props.weight : '400')};
	&::placeholder {
		color: ${props => (props.placeholderColor ? props.placeholderColor : '#B4C1D266')};
		font-size: ${props => (props.placeholderSize ? props.placeholderSize : '15')}px;
		font-weight: ${props => (props.placeholderWeight ? props.placeholderWeight : '400')};
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

		const newContentState = EditorState.push(editorState, contentState, 'insert-characters');
		setEditorState(newContentState);
	};

	const handleSubmitGif = (gifId: string): void => {
		const gifMarkdown = `[GIPHY]!${gifId}`;
		if (gifId) props.onSubmit(gifMarkdown);
	};

	// Iterate through files array and upload each file

	const handleUploadFiles = (images: FileList | null): void => {
		if (!images) return;
		for (let i = 0; i < images.length; i++) {
			handleUploadFile(images[i]);
		}
	};

	const keyBindingFn = (e:any) => {
		if (!e.metaKey && e.code === 'Enter') {
		  handleSubmit();
		  return false
		}
	  
		// Return Draft's default command for this key.
		return Draft.getDefaultKeyBinding(e)
	  }

	// Upload a single file and update state within the message input

	const handleUploadFile = async (image: File | undefined): Promise<void> => {
		try {
			if (!image) throw new Error('No file selected');
			if (imagesToUpload.length >= 4) throw new Error('You can upload up to 4 images at a time');
			const supportedImageExtensions = ['jpg', 'jpeg', 'gif', 'png', 'svg', 'webp'];
			const fileExtension = image.name.split('.').pop() || '';
			if (!supportedImageExtensions.includes(fileExtension)) throw new Error('The file should be an image');
			if (Math.round(image.size / 1024) / 1000 > 2) throw new Error('Please insert an image up to 2Mb');

			const imageBase64 = await getBase64(image);

			setImagesToUpload(prevState => [
				...prevState,
				{
					file: imageBase64,
					id: imageBase64.substring(0, 256),
					uploading: true,
					url: ''
				}
			]);

			const formData = new FormData();
			formData.append('file', image);
			const uploadedUrl = await filesService.uploadImage(formData);
			if (uploadedUrl) {
				const imageMarkdown = `![${image.name}](${uploadedUrl} "${image.name}")`;

				setImagesToUpload(previousState => [
					...previousState.filter(img => img.id !== imageBase64.substring(0, 256)),
					{
						file: imageBase64,
						id: imageBase64.substring(0, 256),
						uploading: false,
						url: imageMarkdown
					}
				]);
			}
		} catch (error: any) {
			toast.error(error?.message || 'Error', { toastId: 3 });
		}
	};

	const handleRemoveImageFromArray = (imageId: string): void => {
		setImagesToUpload(prevState => prevState.filter(img => img.id !== imageId));
	};

	const handleSubmit = (): void => {
		const stateContent = editorState.getCurrentContent();
		const rawState = convertToRaw(stateContent);
		let message = draftToMarkdown(rawState);

		if (imagesToUpload?.length) {
			const arrayOfImagesMarkdown = imagesToUpload.map(img => img.url).join('  ');
			message = `${message} [IMAGES] ${arrayOfImagesMarkdown}`;
		}

		if (message.trim()) {
			props.onSubmit(message);
			setEditorState(EditorState.createEmpty());
			setImagesToUpload([]);
		}
	};

	return (
		<MessageInputStyled>
			<div className="input-editor-wrapper">
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
					keyBindingFn={keyBindingFn}
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
							bold: {
								icon: boldIcon,
								className: 'bordered-option-classname'
							},
							italic: {
								icon: italicIcon,
								className: 'bordered-option-classname'
							},
							underline: {
								icon: underlineIcon,
								className: 'bordered-option-classname'
							},
							strikethrough: {
								icon: strikeThroughIcon,
								className: 'bordered-option-classname'
							},
							monospace: {
								icon: codeIcon,
								className: 'bordered-option-classname'
							}
						},
						link: {
							popupClassName: 'toolbar-popup',
							showOpenOptionOnHover: true,
							options: ['link'],
							link: {
								icon: linkIcon,
								className: 'bordered-option-classname'
							}
						},
						list: {
							options: ['unordered', 'ordered', 'indent', 'outdent'],
							unordered: {
								icon: unorderedIcon,
								className: 'bordered-option-classname'
							},
							ordered: {
								icon: orderedIcon,
								className: 'bordered-option-classname'
							},
							indent: {
								icon: indentIcon,
								className: 'bordered-option-classname'
							},
							outdent: {
								icon: outdentIcon,
								className: 'bordered-option-classname'
							}
						},
						history: {
							undo: {
								icon: undoIcon,
								className: 'bordered-option-classname'
							},
							redo: {
								icon: redoIcon,
								className: 'bordered-option-classname'
							}
						}
					}}
					toolbarClassName="message-input-toolbar"
					weight={props.weight}
					width={props.width}
					wrapperClassName={`flex-1 message-input-wrapper ${imagesToUpload?.length ? 'loading-images' : ''}`}
				/>

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

			<div className="buttons-wrapper">
				<button
					className="toolbar-button"
					onClick={handleSubmit}
					disabled={
						(!editorState.getCurrentContent().getPlainText('\u0001') && !imagesToUpload?.length) ||
						!!imagesToUpload?.filter(img => img.uploading)?.length
					}
				>
					<img src={sendicon} alt="send-icon" />
				</button>

				{!!props.toolbar && (
					<button
						className="toolbar-button"
						onClick={() => setToolbarHidden(state => !state)}
						style={
							toolbarhidden
								? {}
								: {
										borderBottom: '1px solid var(--inactive)',
										backgroundColor: 'var(--background)'
								  }
						}
					>
						<i style={{ fontSize: '1rem', color: 'var(--text)' }} className="fa-sharp fa-solid fa-font" />
					</button>
				)}

				{!!props.imageUpload && (
					<label htmlFor={imageInputId}>
						<input
							className="file-input"
							id={imageInputId}
							name={imageInputId}
							accept="image/*"
							multiple
							onChange={ev => handleUploadFiles(ev.target.files)}
							style={{
								position: 'absolute',
								pointerEvents: 'none',
								opacity: '0',
								zIndex: '-1'
							}}
							type="file"
						/>
						<div
							className="toolbar-button cursor-pointer"
							onClick={() => {
								if (isGiphyOpen) setIsGiphyOpen(false);
								if (isEmojiMenuOpen) setIsEmojiMenuOpen(false);
							}}
						>
							<svg
								width="20"
								height="18"
								viewBox="0 0 20 18"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill="var(--text)"
									fillOpacity="0.6"
									d="M11.7953 0V2H2.51535V16H16.9509V7H19.0131V16C19.0131 16.55 18.8114 17.021 18.4079 17.413C18.0037 17.8043 17.518 18 16.9509 18H2.51535C1.94824 18 1.46258 17.8043 1.05839 17.413C0.654879 17.021 0.453125 16.55 0.453125 16V2C0.453125 1.45 0.654879 0.979 1.05839 0.587C1.46258 0.195667 1.94824 0 2.51535 0H11.7953ZM16.9509 0V2H19.0131V4H16.9509V6H14.8887V4H12.8265V2H14.8887V0H16.9509ZM3.54646 14H15.9198L12.0531 9L8.95979 13L6.63979 10L3.54646 14Z"
								/>
							</svg>
						</div>
					</label>
				)}

				<div>
					<button
						onClick={() => {
							setIsGiphyOpen(false);
							setIsEmojiMenuOpen(state => !state);
						}}
						className="toolbar-button"
					>
						<svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								fill="var(--text)"
								fillOpacity="0.6"
								d="M10.9156 21C9.48923 21 8.14879 20.7373 6.89427 20.212C5.63975 19.6873 4.54849 18.975 3.62049 18.075C2.69249 17.175 1.958 16.1167 1.41701 14.9C0.875331 13.6833 0.604492 12.3833 0.604492 11C0.604492 9.61667 0.875331 8.31667 1.41701 7.1C1.958 5.88333 2.69249 4.825 3.62049 3.925C4.54849 3.025 5.63975 2.31233 6.89427 1.787C8.14879 1.26233 9.48923 1 10.9156 1C11.6546 1 12.3678 1.07067 13.0552 1.212C13.7426 1.354 14.4042 1.55833 15.04 1.825V4.075C14.4386 3.74167 13.79 3.479 13.0943 3.287C12.398 3.09567 11.6718 3 10.9156 3C8.62997 3 6.68392 3.779 5.07745 5.337C3.47029 6.89567 2.66671 8.78333 2.66671 11C2.66671 13.2167 3.47029 15.1043 5.07745 16.663C6.68392 18.221 8.62997 19 10.9156 19C13.2012 19 15.1476 18.221 16.7548 16.663C18.3613 15.1043 19.1645 13.2167 19.1645 11C19.1645 10.4667 19.1085 9.95 18.9964 9.45C18.8851 8.95 18.7349 8.46667 18.5458 8H20.7627C20.9174 8.48333 21.0336 8.97067 21.1112 9.462C21.1882 9.954 21.2267 10.4667 21.2267 11C21.2267 12.3833 20.9559 13.6833 20.4142 14.9C19.8732 16.1167 19.1387 17.175 18.2107 18.075C17.2827 18.975 16.1915 19.6873 14.9369 20.212C13.6824 20.7373 12.342 21 10.9156 21ZM19.1645 6V4H17.1023V2H19.1645V0H21.2267V2H23.2889V4H21.2267V6H19.1645ZM14.5245 10C14.9541 10 15.3191 9.854 15.6195 9.562C15.9206 9.27067 16.0712 8.91667 16.0712 8.5C16.0712 8.08333 15.9206 7.72933 15.6195 7.438C15.3191 7.146 14.9541 7 14.5245 7C14.0949 7 13.7298 7.146 13.4295 7.438C13.1284 7.72933 12.9778 8.08333 12.9778 8.5C12.9778 8.91667 13.1284 9.27067 13.4295 9.562C13.7298 9.854 14.0949 10 14.5245 10ZM7.30671 10C7.73634 10 8.10136 9.854 8.40175 9.562C8.70284 9.27067 8.85338 8.91667 8.85338 8.5C8.85338 8.08333 8.70284 7.72933 8.40175 7.438C8.10136 7.146 7.73634 7 7.30671 7C6.87708 7 6.51207 7.146 6.21167 7.438C5.91059 7.72933 5.76005 8.08333 5.76005 8.5C5.76005 8.91667 5.91059 9.27067 6.21167 9.562C6.51207 9.854 6.87708 10 7.30671 10ZM10.9156 16.5C12.0842 16.5 13.1456 16.1793 14.0997 15.538C15.0531 14.896 15.7446 14.05 16.1743 13H5.65694C6.08657 14.05 6.77844 14.896 7.73256 15.538C8.686 16.1793 9.74701 16.5 10.9156 16.5Z"
							/>
						</svg>
					</button>

					{isEmojiMenuOpen && <EmojisModule onAddEmoji={handleAddEmoji} />}
				</div>

				<div>
					<button
						className="toolbar-button"
						onClick={() => {
							setIsEmojiMenuOpen(false);
							setIsGiphyOpen(state => !state);
						}}
					>
						<img style={{ height: '18px' }} src={gifIcon} alt="gif-icon" />
					</button>

					{isGiphyOpen && (
						<GifsModule onCloseModal={() => setIsGiphyOpen(false)} onSubmit={handleSubmitGif} />
					)}
				</div>
			</div>
		</MessageInputStyled>
	);
});

export default MessageInput;
