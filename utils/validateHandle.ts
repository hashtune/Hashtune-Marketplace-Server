// Only allow lower case letters
export const regexPat = /^[a-z0-9_.-]*$/;
export const validateHandle = (handle: string): boolean => {
  if (handle === '') return false;
  if (handle.length > 30) return false;
  return regexPat.test(handle) != false;
};
