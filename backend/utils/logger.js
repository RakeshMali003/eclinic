const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logDir = path.join(__dirname, '../logs');
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir);
        }
    }

    formatMessage(level, event, description, metadata = {}) {
        return {
            timestamp: new Date().toISOString(),
            level,
            event,
            description,
            metadata: Object.keys(metadata).length ? metadata : undefined
        };
    }

    log(level, event, description, metadata = {}) {
        const message = this.formatMessage(level, event, description, metadata);
        const logString = JSON.stringify(message);

        // Console output with colors
        const colors = {
            INFO: '\x1b[36m', // Cyan
            SUCCESS: '\x1b[32m', // Green
            WARN: '\x1b[33m', // Yellow
            ERROR: '\x1b[31m', // Red
            RESET: '\x1b[0m'
        };

        const color = colors[level] || colors.RESET;
        console.log(`${color}[${level}] ${event}:${colors.RESET} ${description}`, metadata && Object.keys(metadata).length ? metadata : '');

        // File logging
        const date = new Date().toISOString().split('T')[0];
        const logFile = path.join(this.logDir, `${date}.log`);
        fs.appendFileSync(logFile, logString + '\n');
    }

    info(event, description, metadata) {
        this.log('INFO', event, description, metadata);
    }

    success(event, description, metadata) {
        this.log('SUCCESS', event, description, metadata);
    }

    warn(event, description, metadata) {
        this.log('WARN', event, description, metadata);
    }

    error(event, description, metadata) {
        this.log('ERROR', event, description, metadata);
    }
}

module.exports = new Logger();
