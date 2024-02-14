import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

interface Api {
    get<T>(url: string, params?: object): Promise<AxiosResponse<T>>;
    post<T>(url: string, data?: object): Promise<AxiosResponse<T>>;
    put<T>(url: string, data?: object): Promise<AxiosResponse<T>>;
    delete<T>(url: string): Promise<AxiosResponse<T>>;
}

class ApiService {
    private axiosInstance: AxiosInstance;

    constructor(customConfig?: AxiosRequestConfig) {
        const defaultConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                // Add any other default headers you need
            },
        };

        this.axiosInstance = axios.create({
            ...defaultConfig,
            ...customConfig,
        });
    }

    public get<T>(url: string, params?: object): Promise<AxiosResponse<T>> {
        return this.axiosInstance.get(url, { params });
    }

    public post<T>(url: string, data?: object): Promise<AxiosResponse<T>> {
        return this.axiosInstance.post(url, data);
    }

    public put<T>(url: string, data?: object): Promise<AxiosResponse<T>> {
        return this.axiosInstance.put(url, data);
    }

    public patch<T>(url: string, data?: object): Promise<AxiosResponse<T>> {
        return this.axiosInstance.put(url, data);
    }

    public delete<T>(url: string): Promise<AxiosResponse<T>> {
        return this.axiosInstance.delete(url);
    }
}

export default ApiService;
