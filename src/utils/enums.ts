export const reverseEnumMap = <T extends Record<string, U>, U>(enumObj: T, value: U): keyof T => {
  const key = Object.keys(enumObj).find((key) => enumObj[key] === value);
  if (key === undefined) {
    throw new TypeError(`Value ${key} not found in enum.`);
  }
  return key;
};
