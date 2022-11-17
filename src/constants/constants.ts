import { Network } from "alchemy-sdk";
import bannerImage from "../assets/images/dashboard-banner.png";

export const NUMBER_OF_DECIMALS = 18;

export const BASE_URL = process.env.REACT_APP_BASE_URL;

export const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

export const ALCHEMY_API_KEY = process.env.REACT_APP_ALCHEMY_API_KEY;

export const ALCHEMY_BASE_URL = process.env.REACT_APP_ALCHEMY_BASE_URL;

export const ALCHEMY_NETWORK = Network.MATIC_MAINNET;

export const FALLBACK_BG_IMG = bannerImage;
