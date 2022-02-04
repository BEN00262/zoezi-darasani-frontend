import axios from 'axios';

import HttpClientInterface from './HttpClientInterface';

class HttpClientAxios implements HttpClientInterface {
    get(url:string,...otherArgs:any[]): Promise<any> {
        return axios.get(url,...otherArgs);
    }
}

export default HttpClientAxios;