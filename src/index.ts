import P, { default as Pino } from 'pino';
import config from 'configuration-master';

const getPiiFilter = (redactPrefix: string[], key: string): string[] =>
{
	const piiFilter = redactPrefix.map(data => `${data}${key}`);
	piiFilter.push(key);
	return piiFilter;
};
//create logger instance
export const logger = (children?: P.Bindings): P.Logger =>
{
	//Get the sensitive keys from configuration file to redact
	const service = ((config as { [key: string]: any }).serviceName as string) || 'micro service';
	const redactPrefix = ((config as { [key: string]: any }).logging.redactPrefix as string[]) || ['request[*].'];
	const redactRemove = ((config as { [key: string]: any }).logging.redactRemove as boolean) || false;

	const piiKeys: string[] =
		(config as { [key: string]: any }).logging.piiFilter.map((key: string) =>
			getPiiFilter(redactPrefix, key.toLowerCase()));

	const redact = {
		paths: piiKeys.flat(),
		censor: (value: any) => { return "*".repeat(value.length); },
		remove: redactRemove
	};
	const baseLogger: P.Logger = Pino({
		redact: redact,
		formatters: {
			level: (level, number) => ({ level })
		},
		messageKey: "message",
		level: ((config as { [key: string]: any }).logging.level as string).toLowerCase()
	});
	return children == null ? baseLogger.child({ id: "server generated log", service }) : baseLogger.child({ ...children, service });
};
