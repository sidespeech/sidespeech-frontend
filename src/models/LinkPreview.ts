export class LinkPreview {
	url: string;
	title?: string;
	siteName?: string;
	description?: string;
	mediaType: string;
	contentType?: string;
	images?: string[];
	videos?: {
		url?: string;
		secureUrl?: string | null;
		type?: string | null;
		width?: string;
		height?: string;
	}[];
	favicons: string[];

	constructor(_data: any) {
		this.url = _data.url;
		this.title = _data.title;
		this.siteName = _data.siteName;
		this.description = _data.description;
		this.mediaType = _data.mediaType;
		this.contentType = _data.contentType;
		this.images = _data.images;
		this.videos = _data.videos;
		this.favicons = _data.favicons;
	}
}
