import { store } from '../store';
import router from '../router';
import Cookies from 'js-cookie';

const Security = {
    requireToken: function() {
        if(store.token === '') {
            router.push('/login');
            return false;
        }
    },

    requestOptions(payload: Object) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer '+ store.token);
        return {
            method: "POST",
            body: JSON.stringify(payload),
            headers
        };
    },
    async checkToken() {
        if(store.token !== '') {
            const payload = {
                token: store.token
            }
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');

            const requestOptions = {
                method: "POST",
                body: JSON.stringify(payload),
                headers
            }

            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/validate-token`, requestOptions)
            const {error, message, data: valid} = await response.json();
            if(error) {
                console.log(message);
            } else {
                if(!valid) {
                    store.token = '';
                    store.user = {};
                    Cookies.remove('_site_data');
                }
            }
        }
    }
}

export default Security;