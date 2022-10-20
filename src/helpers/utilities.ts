import { NUMBER_OF_DECIMALS } from "../constants/constants";
import { Duration } from "date-fns";
import { Side } from "../models/Side";

export function weiToDecimals(
  value: number,
  exposant: number = NUMBER_OF_DECIMALS
) {
  return value / 10 ** exposant;
}
export function decimalsToWei(
  value: number,
  exposant: number = NUMBER_OF_DECIMALS
) {
  return value * 10 ** exposant;
}

export function reduceWalletAddress(address: string): string {
  if (!address) return "";
  const name =
    address.substring(0, 6) +
    "..." +
    address.substring(address.length - 4, address.length);
  return name;
}
export function reduceWalletAddressForColor(address: string): string {
  if (!address) return "";
  const name = "#" + address.substring(2, 8);
  return name;
}

export function renameFile(originalFile: File, newName: string): File {
  return new File([originalFile], newName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  });
}

export function getRoleColor(role: string) {
  switch (role) {
    case "User":
      return "text-blue";
    case "Moderator1":
    case "Moderator2":
    case "Moderator3":
      return "text-green";
    case "Administrator":
      return "text-red";
    default:
      return "text-blue";
  }
}
export function getRoleColorForStyle(role: string) {
  switch (role) {
    case "User":
      return "var(--text-blue)";
    case "Moderator":
      return "var(--text-green)";
    case "Admin":
      return "var(--text-red)";
    default:
      return "var(--text-blue)";
  }
}

/**
 *
 * @param tokenBalance number of token in the user wallet
 * @param nodePrice the price of the Bcash the user wanted to buy
 * @returns true if the user has anaf token
 */
export function hasAnafToken(tokenBalance: number, nodePrice: number): boolean {
  return tokenBalance >= nodePrice;
}

export const durationToString = (
  duration: Duration | null,
  _default: string
) => {
  if (!duration) return _default;
  return `${
    duration.years || duration.years !== 0 ? duration.years + "y " : ""
  }${duration.months || duration.months !== 0 ? duration.months + "m " : ""}${
    duration.days || duration.days !== 0 ? duration.days + "d " : ""
  } ${
    duration.hours && duration.hours < 10
      ? "0" + duration.hours
      : duration.hours || "00"
  }:${
    duration.minutes && duration.minutes < 10
      ? "0" + duration.minutes
      : duration.minutes || "00"
  }:${
    duration.seconds && duration.seconds < 10
      ? "0" + duration.seconds
      : duration.seconds || "00"
  }`;
};
export const durationToStringMax1h = (
  duration: Duration | null,
  _default: string
) => {
  if (!duration) return _default;
  if (duration.days || duration.hours) return "More than 1h ago";
  else {
    return `${
      duration.minutes && duration.minutes < 10
        ? "0" + duration.minutes
        : duration.minutes || "00"
    } min ${
      duration.seconds && duration.seconds < 10
        ? "0" + duration.seconds
        : duration.seconds || "00"
    } sec ago`;
  }
};

export function timestampToLocalString(timestamp: string) {
  return new Date(Number.parseInt(timestamp)).toLocaleTimeString();
}

export function checkUserEligibility(nfts: any, selectedSide: Side): any[] {
  const res: any[] = [];
  if (selectedSide) {
    Object.entries<any>(selectedSide.conditions).forEach(
      ([token_address, condition]) => {
        const collection = nfts[token_address];
        if (!collection) {
          res.push({
            message: `No nfts for the collection with address ${token_address}`,
            id: token_address,
            type: "error",
          });
        } else {
          // get nfts from collection with needed attributes
          const filteredNfts: any[] = [];
          collection.nfts.filter((nft: any) =>
            getParsedNftMetaData(nft)?.attributes.some((a: any) => {
              const success =
                condition.hasOwnProperty(a.trait_type) &&
                a.value === condition[a.trait_type];
              if (success) filteredNfts.push(nft);
              return success;
            })
          );
          if (!filteredNfts.length) {
            // if no nfts corresponding to the condition returning error response
            res.push({
              id: token_address,
              type: "error",
              message: `No nft in the collection ${token_address} with property ${
                Object.keys(condition)[0]
              } and value ${Object.values(condition)[0]}`,
            });
          }
          // if there is nfts with needed attributes returning success response
          else {
            res.push({
              id: token_address,
              type: "success",
              property: Object.keys(condition)[0],
              value: Object.values(condition)[0],
              usefulNfts: filteredNfts,
            });
          }
        }
      }
    );
  }
  return res;
}

export function getParsedNftMetaData(nft: any) {
  return JSON.parse(nft.metadata);
}

export function fixURL(url: string) {
  if (url.startsWith("ipfs")) {
    return (
      "https://ipfs.io/ipfs/" + url.split("ipfs://").slice(-1)[0]
    );
  } else if (url.startsWith("https://")) {
    return url;
  }
}
