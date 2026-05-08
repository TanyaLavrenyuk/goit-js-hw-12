import axios from 'axios';

export async function getImagesByQuery(query, page = 1) {
  const API_KEY = '55631968-7584b9a203dbb647b76045b43';
  const BASE_URL = 'https://pixabay.com/api/';

  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 15,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
}
