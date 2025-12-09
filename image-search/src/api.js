// helper для работы с Pixabay API
const BASE_URL = 'https://pixabay.com/api/';
const KEY = import.meta.env.VITE_PIXABAY_KEY; // берётся из .env

if (!KEY) {
    console.error('VITE_PIXABAY_KEY is not defined. Please set it in .env.');
}

export async function fetchImages(query, page = 1, per_page = 40) {
    const url = new URL(BASE_URL);
    url.searchParams.set('key', KEY);
    url.searchParams.set('q', query);
    url.searchParams.set('image_type', 'photo');
    url.searchParams.set('orientation', 'horizontal');
    url.searchParams.set('safesearch', 'true');
    url.searchParams.set('page', String(page));
    url.searchParams.set('per_page', String(per_page));

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
    }
    const data = await response.json();
    return data;
}
