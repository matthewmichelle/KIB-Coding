export const maskString = (stringToMask: string, n = 4): string => {
  if (stringToMask.length <= 2 * n) {
    return stringToMask;
  }

  const start = stringToMask.slice(0, n);
  const end = stringToMask.slice(-n);
  const middleLength = stringToMask.length - 2 * n;
  const middle = '*'.repeat(middleLength);

  return `${start}${middle}${end}`;
};
