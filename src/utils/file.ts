export const getFileNameFromUrlOrPath = (urlOrPath: string): string => {
  const lastPart = urlOrPath.split('/').pop();
  if (!lastPart) {
    throw new Error('Invalid url or path');
  }
  return lastPart.split('?')[0];
};

export const getFileExtensionFromName = (fileName: string): string =>
  fileName.split('.')[fileName.split('.').length - 1].toLowerCase();

export const getFilenameWithoutExtension = (fileName: string): string =>
  fileName.replace(`.${getFileExtensionFromName(fileName)}`, '');
