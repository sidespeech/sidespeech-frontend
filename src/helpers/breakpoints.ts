export enum ScreenSize {
  XS = 0,
  SM = 480,
  MD = 678,
  LG = 980,
  XL = 1200
}

export const size: {
  [size: string]: ScreenSize
} = {
  xs: ScreenSize.XS,
  sm: ScreenSize.SM,
  md: ScreenSize.MD,
  lg: ScreenSize.LG,
  xl: ScreenSize.XL
}

export const breakpoints = (
  screenBreakpoint: ScreenSize = size.xs, // the CSS property to apply to the breakpoints
  values: string = '', // array of objects, e.g. [{ 800: 60 }, ...] <-- 800 (key) = screen breakpoint, 60 (value) = CSS prop breakpoint
  mediaQueryType: string = "min-width" // media query breakpoint type, i.e.: max-width, min-width, max-height, min-height
) => {
    return `@media screen and (${mediaQueryType}: ${screenBreakpoint}px) {${values}}`;
};