import axios from 'axios';
import Cookies from 'js-cookie';

const api = () => {
    const token = Cookies.get('token');

    return axios.create({
        baseURL: process.env.REACT_APP_URL_SHORTENER_API,
        headers: { Authorization: `Bearer ${token}` },
    });
};

export default api;
