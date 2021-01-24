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

export const getProcessMemoryUsage = (): any => {
  const memoryData = process.memoryUsage();

  const formatMemmoryUsage = (data: any) => `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;

  return {
    rss: `${formatMemmoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
    heapTotal: `${formatMemmoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
    heapUsed: `${formatMemmoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
    external: `${formatMemmoryUsage(memoryData.external)} -> V8 external memory`,
  };
};