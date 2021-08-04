import axios from 'axios';

export const post = async (url, data, config) =>
  await (await axios.post(url, data, config)).data;
