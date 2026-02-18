import axios, { type AxiosInstance } from "axios";

export type HealthResponse = {
    status: string;
    sumatra_found: boolean;
    hostname: string;
    client_id: string;
    os: string;
};

export type Printer = {
    name: string;
    status: string;
    status_code: number,
    default: boolean;
    port: number;
};

export type PrinterListResponse = {
    success: boolean;
    printers: Printer[];
    count: number;
};

export class PrintAPI {
    private api: AxiosInstance;

    constructor(
        host: string = "127.0.0.1",
        port: number = 60001
    ) {
        this.api = axios.create({
            baseURL: `http://${host}:${port}`,
            timeout: 5000
        });
    }

    async checkHealth(): Promise<HealthResponse> {
        const res = await this.api.get<HealthResponse>("/health");
        return res.data;
    }

    async getPrinterAvailable(): Promise<PrinterListResponse> {
        const res = await this.api.get<PrinterListResponse>("/printers");
        return res.data;
    }

    async getDefaultPrinter(): Promise<Printer | null> {
        const res = await this.getPrinterAvailable();
        if (!res.success) return null;
        return res.printers.find(p => p.default) ?? null;
    }

    async printPDF(
        file: File,
        printer: string,
        webhook?: string,
        webhook_data?: string
    ): Promise<any> {
        const form = new FormData();
        form.append("pdf", file);
        form.append("printer", printer);

        if (webhook) form.append("webhook", webhook);
        if (webhook_data) form.append("webhook_data", webhook_data);

        const res = await this.api.post("/print", form, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        return res.data;
    }
}
