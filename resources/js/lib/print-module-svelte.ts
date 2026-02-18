import { type HealthResponse, PrintAPI, type Printer } from "$lib/print-module";

export interface PrinterAvailableResponse {
    success: boolean;
    printers?: Printer[];
    message?: string;
}

export interface PrintModuleState {
    hostname: string;
    os: string;
    initialized: boolean;
    default_printer: Printer | null;
    printer_list: Printer[];
    client_id: string;
    isChecking: boolean;
}

export interface PrintModuleAPI {
    init(): Promise<PrintModuleState>;
    refresh(): Promise<PrintModuleState>;
    ping(): Promise<boolean>;
    printPdf(payload: {
        path: string;
        printerName?: string;
        copies?: number;
    }): Promise<{
        success: boolean;
        message?: string;
        details?: unknown;
    }>;
}

export function printModule(): PrintModuleAPI {
    const service = new PrintAPI();

    async function load(): Promise<PrintModuleState> {
        let state: PrintModuleState = {
            hostname: "",
            os: "",
            initialized: false,
            default_printer: null,
            printer_list: [],
            client_id: "",
            isChecking: true,
        };

        try {
            const health: Partial<HealthResponse> | null =
                await service.checkHealth();

            if (health) {
                state.hostname = health.hostname ?? "";
                state.os = health.os ?? "";
                state.client_id = health.client_id ?? "";
            }

            const printerRes: PrinterAvailableResponse | null =
                await service.getPrinterAvailable();

            if (printerRes?.success && Array.isArray(printerRes.printers)) {
                state.printer_list = printerRes.printers;
                state.default_printer =
                    printerRes.printers.find(p => p.default) ?? null;
            }

            state.initialized = true;
        } catch (e) {
            state.initialized = false;
            console.error("Failed to initialize print module", e);
        }
        state.isChecking = false;

        return state;
    }

    async function ping(): Promise<boolean> {
        try {
            const health = await service.checkHealth();
            return !!health; // true if server responds
        } catch {
            return false;
        }
    }

    return {
        init: load,
        refresh: load,
        pingServer: ping,
        printPdf: service.printPDF.bind(service),
    } as unknown as PrintModuleAPI;
}
