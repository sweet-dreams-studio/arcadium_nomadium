export enum ConfigColor {
  red = "red",
  white = "white",
  black = "black"
}

export const configColorValues: { [colorId in ConfigColor]: string } = {
  [ConfigColor.red]: "hsla(10, 90%, 40%, 1)",
  [ConfigColor.white]: "white",
  [ConfigColor.black]: "black"
};
