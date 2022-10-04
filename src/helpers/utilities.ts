import { NUMBER_OF_DECIMALS } from "../constants/constants";
import { Duration } from "date-fns";

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
