export const isEmpty = (value: any): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const sortStrAlphabet = (str: string): string => {
  return [...str].sort().join('');
};

export const isValid = (value: any): boolean => {
  return value !== null && value !== undefined;
};
