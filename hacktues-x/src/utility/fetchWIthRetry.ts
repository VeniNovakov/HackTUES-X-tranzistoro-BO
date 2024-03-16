import { BASEURL } from '$lib/env';
import axios from 'axios';

const createAxiosInstanceWithRetry = () => {
	const instance = axios.create();

	instance.interceptors.request.use(
		(config) => {
			const accessToken = localStorage.getItem('accessToken');

			if (accessToken) {
				config.headers.Authorization = `Bearer ${accessToken}`;
			}

			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	instance.interceptors.response.use(
		(response) => response,
		async (error) => {
			const {
				config,
				response: { status }
			} = error;

			if (status === 401) {
				// Request token refresh
				const refreshedToken = await refreshAccessToken(); // Implement this function

				// If token refresh successful, update the Authorization header and retry the request
				if (refreshedToken) {
					config.headers.Authorization = `Bearer ${refreshedToken}`;
					return axios(config);
				}
			}

			return Promise.reject(error);
		}
	);

	return instance;
};
const refreshAccessToken = async () => {
	const refreshedToken = await axios.get(`${BASEURL}/auth/refresh`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('refreshToken')}`
		}
	});

	return refreshedToken.data.accessToken;
};
// Usage
const axiosWithRetry = createAxiosInstanceWithRetry();
export default axiosWithRetry;
