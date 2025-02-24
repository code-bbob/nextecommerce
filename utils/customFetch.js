import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'; // Import js-cookie

const baseURL = 'http://127.0.0.1:8000/'; // Set base URL

async function refreshToken() {
  const refresh = Cookies.get('refreshToken'); // Get refresh token from cookie

  if (!refresh) {
    throw new Error('Refresh token not found');
  }

  const response = await fetch(`${baseURL}/api/auth/refresh-token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  Cookies.set('accessToken', data.access); // Set access token in cookie
  return data.access;
}

async function customFetch(url, options = {}) {
  let token = Cookies.get('accessToken'); // Get access token from cookie

  if (token) {
    const decoded = jwtDecode(token);
    const isExpired = dayjs.unix(decoded.exp).diff(dayjs()) < 1;

    if (isExpired) {
      try {
        token = await refreshToken();
      } catch (error) {
        console.error('Token refresh failed', error);
        throw error;
      }
    }
  }

  options.headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : '',
  };

  let response = await fetch(`${baseURL}${url}`, options);

  if (response.status === 401 && token) {
    try {
      token = await refreshToken();
      options.headers.Authorization = `Bearer ${token}`;
      response = await fetch(`${baseURL}${url}`, options);
    } catch (error) {
      console.error('Token refresh failed on retry', error);
      throw error;
    }
  }

  // Add error handling for non-successful responses
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (jsonError) {
      errorData = { msg: `HTTP error! status: ${response.status}` };
    }
    throw {
      response: {
        status: response.status,
        data: errorData,
      },
    };
  }

  return response;
}

export default customFetch;