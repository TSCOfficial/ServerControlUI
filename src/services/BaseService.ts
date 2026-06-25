export default class BaseService {

    baseUrl: string = 'http://localhost:8080/api';
    serviceUri: string = "";

    constructor(service: string) {
        this.serviceUri = service
    }

    async fetch(endpoint: string) {
        try {
            const response = await fetch(this.baseUrl + "/" + this.serviceUri + "/" + endpoint);
            console.log(this.baseUrl + this.serviceUri + endpoint);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            return await response.json()
        } catch (error:any) {
            console.error(error.message);
        }
    }
}