export default class BaseService {

    baseUrl: string = 'http://localhost:8080/api';
    serviceUri: string = "";

    constructor(service: string) {
        this.serviceUri = service
    }

    static Method = class {
        static GET = "GET";
        static POST = "POST";
        static PUT = "PUT";
        static PATCH = "PATCH";
        static DELETE = "DELETE";
    }

    async fetch(endpoint: string, method?: string, body?: any): Promise<any> {
        try {
            let response;
            if (method && body) {
                response = await fetch(this.baseUrl + "/" + this.serviceUri + "/" + endpoint, {
                    method: method,
                    headers: {
                        "content-type": "application/json",
                        "origin": "http://localhost:5173"
                    },
                    body: JSON.stringify(body)
                });
            } else {
                response = await fetch(this.baseUrl + "/" + this.serviceUri + "/" + endpoint);
            }

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            // return empty body if status is 204 (no content
            console.log("Response status", response.status)
            if (response.status === 204) return

            return await response.json()
        } catch (error:any) {
            console.error(error.message);
        }
    }
}