// utils/logger.ts

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
    private formatMessage(level: LogLevel, message: string, meta?: any): string {
        const timestamp = new Date().toISOString();
        let logString = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

        if (meta) {
            if (meta instanceof Error) {
                logString += `\n  ↳ ${meta.name}: ${meta.message}`;
                if (meta.stack) logString += `\n  ↳ Stack: ${meta.stack}`;
            } else {
                try {
                    logString += `\n  ↳ Meta: ${JSON.stringify(meta, null, 2)}`;
                } catch (e) {
                    logString += `\n  ↳ Meta: [Circular or Unstringifiable Object]`;
                }
            }
        }

        return logString;
    }

    info(message: string, meta?: any) {
        console.log(this.formatMessage('info', message, meta));
    }

    warn(message: string, meta?: any) {
        console.warn(this.formatMessage('warn', message, meta));
    }

    error(message: string, meta?: any) {
        console.error(this.formatMessage('error', message, meta));
    }

    // debug(message: string, meta?: any) {
    //     if (process.env.VERCEL_ENV !== 'production') {
    //         console.debug(this.formatMessage('debug', message, meta));
    //     }
    // }
}

export const logger = new Logger();