const PEXELS_ENDPOINT = 'https://api.pexels.com/v1/search';
const DEFAULT_PER_PAGE = 5;
const MAX_PER_PAGE = 15;
const MAX_QUERY_LENGTH = 100;
const REQUEST_TIMEOUT_MS = 8000;

function jsonResponse(statusCode, payload, extraHeaders) {
  return {
    statusCode,
    headers: Object.assign({ 'Content-Type': 'application/json' }, extraHeaders),
    body: JSON.stringify(payload)
  };
}

function normalizeField(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function parsePerPage(value) {
  const raw = normalizeField(value);
  if (!raw) return { value: DEFAULT_PER_PAGE };

  if (!/^\d+$/.test(raw)) {
    return { error: 'Le paramètre per_page doit être un entier.' };
  }

  const parsed = Number(raw);
  if (parsed < 1) {
    return { error: 'Le paramètre per_page doit être supérieur à 0.' };
  }

  return { value: Math.min(parsed, MAX_PER_PAGE) };
}

function pickPhotoFields(photo) {
  const src = photo.src || {};
  return {
    id: photo.id,
    url: photo.url,
    photographer: photo.photographer,
    src: {
      large2x: src.large2x,
      original: src.original
    }
  };
}

exports.handler = async function(event) {
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method Not Allowed' });
  }

  const params = event.queryStringParameters || {};

  const query = normalizeField(params.query);
  if (!query) {
    return jsonResponse(400, { error: 'Le paramètre query est requis.' });
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return jsonResponse(400, { error: 'Le paramètre query est trop long.' });
  }

  const perPage = parsePerPage(params.per_page);
  if (perPage.error) {
    return jsonResponse(400, { error: perPage.error });
  }

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, { error: 'Configuration serveur Pexels manquante.' });
  }

  const url = `${PEXELS_ENDPOINT}?query=${encodeURIComponent(query)}&per_page=${perPage.value}`;

  let res;
  try {
    res = await fetch(url, {
      headers: { Authorization: apiKey },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
  } catch {
    return jsonResponse(502, { error: 'Impossible de contacter l’API Pexels.' });
  }

  if (res.status === 429) {
    return jsonResponse(429, { error: 'Quota Pexels dépassé, réessayez plus tard.' });
  }

  if (res.status === 401 || res.status === 403) {
    return jsonResponse(500, { error: 'Clé API Pexels invalide ou refusée.' });
  }

  if (!res.ok) {
    return jsonResponse(502, { error: 'La requête Pexels a échoué.' });
  }

  let data;
  try {
    data = await res.json();
  } catch {
    return jsonResponse(502, { error: 'Réponse Pexels illisible.' });
  }

  const photos = Array.isArray(data.photos) ? data.photos.map(pickPhotoFields) : [];

  return jsonResponse(
    200,
    {
      query,
      per_page: perPage.value,
      total_results: typeof data.total_results === 'number' ? data.total_results : photos.length,
      photos
    },
    { 'Cache-Control': 'public, max-age=3600' }
  );
};
