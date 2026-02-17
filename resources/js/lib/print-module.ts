export type HealthResponse = {
    status: string;
    sumatra_found: boolean;
    hostname: string;
    client_id: string;
    os: string;
};

export class PrintModule {
    disconnected: boolean = true;
    hasInitiated: boolean = false;
    port: number;
    defaultPrinter: string | null = null;
    hostname: string | null = null;
    hash: string | null = null;
    host: string | null = '127.0.0.1';

    private autoPingInterval: number | null = null;
    private isChecking: boolean = false; // prevent overlapping fetch

    constructor(port: number = 60001) {
        this.port = port;
    }

    /* ================================
       PRINTERS
    ================================== */

    async getPrinterAvailable(): Promise<any[]> {
        try {
            const response = await fetch(
                `http://${this.host}:${this.port}/printers`
            );

            if (!response.ok) return [];

            const data = await response.json();
            return data.printers || [];
        } catch (error) {
            console.error('Error fetching printers:', error);
            return [];
        }
    }

    private updateDefaultPrinter(printers: any[]) {
        if (!printers || printers.length === 0) {
            this.defaultPrinter = null;
            return;
        }

        // Default to first printer
        this.defaultPrinter = printers[0].name || printers[0];

        // Override with system default
        for (const p of printers) {
            if (p.default) {
                this.defaultPrinter = p.name;
                break;
            }
        }
    }

    /* ================================
       INIT
    ================================== */

    async init(): Promise<boolean> {
        const alive = await this.pingServer();

        if (!alive) {
            this.hasInitiated = false;
            this.defaultPrinter = null;
            return false;
        }

        const printers = await this.getPrinterAvailable();
        this.updateDefaultPrinter(printers);
        this.hasInitiated = true;

        return true;
    }

    /* ================================
       HEALTH CHECK
    ================================== */

    async pingServer(timeout: number = 3000): Promise<boolean> {
        if (this.isChecking) return !this.disconnected; // prevent overlap

        this.isChecking = true;

        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(
                `http://${this.host}:${this.port}/health`,
                { signal: controller.signal }
            );

            clearTimeout(id);

            if (!response.ok) {
                this.resetConnectionState();
                return false;
            }

            const data: HealthResponse = await response.json();

            const isHealthy = data.status === "healthy";

            if (!isHealthy) {
                this.resetConnectionState();
                return false;
            }

            // Save metadata
            this.hostname = data.hostname;
            this.hash = data.client_id;
            this.disconnected = false;

            return true;

        } catch (error) {
            this.resetConnectionState();
            return false;
        } finally {
            this.isChecking = false;
        }
    }

    private resetConnectionState() {
        this.disconnected = true;
        this.hostname = null;
        this.hash = null;
    }

    /* ================================
       AUTO PING
    ================================== */

    async startAutoPing(interval: number = 5000) {
        if (this.autoPingInterval !== null) {
            clearInterval(this.autoPingInterval);
            this.autoPingInterval = null;
        }

        const check = async () => {
            const alive = await this.pingServer();

            if (alive && !this.hasInitiated) {
                const printers = await this.getPrinterAvailable();
                this.updateDefaultPrinter(printers);
                this.hasInitiated = true;
                console.log(
                    'Print server reconnected:',
                    this.hostname,
                    this.hash
                );
            }

            if (!alive && this.hasInitiated) {
                this.hasInitiated = false;
                this.defaultPrinter = null;
                console.log('Print server disconnected.');
            }
        };

        // Run immediately
        await check();

        this.autoPingInterval = window.setInterval(check, interval);
    }

    stopAutoPing() {
        if (this.autoPingInterval !== null) {
            clearInterval(this.autoPingInterval);
            this.autoPingInterval = null;
        }
    }
}
