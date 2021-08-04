import { post } from '.';

export const objectToFormData = (obj) =>
  Object.entries(obj).reduce(
    (prev, [key, value]) => `${prev}${encodeURIComponent(key)}=${value}&`,
    '',
  );

export const isQueryMatchCache = (query, cache: StateCache) => {
  console.log(`query, cache`, query, cache);
  for (const item of cache) {
    const matched = Object.keys(item.query).every(
      (key) => query[key] === item.query[key],
    );
    if (matched) {
      return item.data;
    }
  }
  return undefined;
};

export const thirdPost = (url, data) =>
  post(url, objectToFormData(data), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
