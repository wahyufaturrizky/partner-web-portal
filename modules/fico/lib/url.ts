export const objectToParams = (param) => {
  const merged = { ...param };

  const temp = Object.entries(merged)
    .filter(
      ([, value]) => value !== null && value !== '' && value !== undefined && value !== 'undefined',
    )
    .map((obj) => obj);

  const qs = temp.map(([key, value]) => `${key}=${value}`).join('&');
  return `${qs}`;
};
