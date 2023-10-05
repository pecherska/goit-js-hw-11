import axios from "axios";

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "39812088-032b6c14a0977753a1f192d5f";
const IMAGE_TYPE = "photo";
const ORIENTATION = "horizontal";
const SAFESEARCH = "true";
const PER_PAGE = "40";
let page = 1;


async function getPictures(userSearch) {
    const URL = `${BASE_URL}?key=${API_KEY}&q=${userSearch}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION}&safesearch=${SAFESEARCH}&per_page=${PER_PAGE}&page=${page}`;
    const response = await axios.get(URL);
    return response.data;
}

export { getPictures, PER_PAGE };