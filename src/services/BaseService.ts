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

    /**
     * Sendet einen Request und liest die Antwort als Server-Sent-Events-Stream.
     * Ruft onEvent für jedes empfangene Event auf.
     */
    async fetchStream(
        endpoint: string,
        method: string,
        body: any,
        onEvent: (eventName: string, data: any) => void
    ): Promise<void> {
        const response = await fetch(this.baseUrl + "/" + this.serviceUri + "/" + endpoint, {
            method,
            headers: {
                "content-type": "application/json",
                "accept": "text/event-stream"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok || !response.body) {
            throw new Error(`Response status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const {done, value} = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, {stream: true});

            // SSE-Events sind durch eine Leerzeile getrennt
            let boundary;
            while ((boundary = buffer.indexOf("\n\n")) !== -1) {
                const rawEvent = buffer.slice(0, boundary);
                buffer = buffer.slice(boundary + 2);

                let eventName = "message";
                let data = "";
                for (const line of rawEvent.split("\n")) {
                    if (line.startsWith("event:")) eventName = line.slice(6).trim();
                    if (line.startsWith("data:")) data += line.slice(5).trim();
                }

                if (data) {
                    try {
                        onEvent(eventName, JSON.parse(data));
                    } catch {
                        onEvent(eventName, data);
                    }
                }
            }
        }
    }
}