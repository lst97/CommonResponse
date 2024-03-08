import { Service } from 'typedi';
import { createLogger, transports, format } from 'winston';
import { consoleColorCodes } from '../constants/Colors';

@Service()
class LogService {
	private logger: any;

	constructor() {
		this.init();
	}

	public init() {
		this.logger = createLogger({
			transports: [new transports.Console()],
			format: format.combine(
				format.colorize(),
				format.timestamp(),
				format.printf(({ timestamp, level, message, service }) => {
					service =
						consoleColorCodes.blue +
						service +
						consoleColorCodes.reset;
					timestamp =
						consoleColorCodes.gray +
						timestamp +
						consoleColorCodes.reset;
					return `[${timestamp}] ${service} ${level}: ${message}`;
				})
			)
		});
	}

	public setServiceName(service: string) {
		if (service && service.trim() !== '') {
			this.logger.defaultMeta = { service: service };
		} else {
			throw new Error('Invalid service name');
		}
	}

	public error(message: string) {
		if (message && message.trim() !== '') {
			this.logger.error(message);
		}
	}

	public info(message: string) {
		if (message && message.trim() !== '') {
			this.logger.info(message);
		}
	}

	public warn(message: string) {
		if (message && message.trim() !== '') {
			this.logger.warn(message);
		}
	}

	public debug(message: string) {
		if (message && message.trim() !== '') {
			this.logger.debug(message);
		}
	}
}

export default LogService;
