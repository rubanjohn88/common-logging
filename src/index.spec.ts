import { logger } from './index';
import config from 'configuration-master';
import path from 'path';
import express, { Request, NextFunction, Response } from 'express';
import request from 'supertest';
const app = express();

const randomNum = (): number =>
{
	return Math.floor(Math.random() * Math.floor(10000));
}
app.get("/testLogging", (req: Request, res: Response, next: NextFunction) =>
{
	const log = logger({ id: randomNum() });
	log.info('Test logging');
	res.send({ log: "Success" });
});


config.loadConfig(path.resolve(__dirname, "mocks/configuration.json"));

describe("common logging", () =>
{
	beforeEach(() =>
	{
		jest.clearAllMocks();
	});

	it("Test common logging success", async () =>
	{
		const log = logger({ id: randomNum() });

		expect(log).not.toBeNull();
		expect(log.trace).not.toBeNull();
		expect(log.warn).not.toBeNull();
		expect(log.error).not.toBeNull();
		expect(log.debug).not.toBeNull();
		expect(log.fatal).not.toBeNull();
	});

	it("Test common logging without passing child", async () =>
	{
		const log = logger();

		expect(log).not.toBeNull();
		expect(log.trace).not.toBeNull();
		expect(log.warn).not.toBeNull();
		expect(log.error).not.toBeNull();
		expect(log.debug).not.toBeNull();
		expect(log.fatal).not.toBeNull();
	});

	it("Test common logging with redact mask", async () =>
	{	
		config.logging.redactRemove = false;
		request(app)
		.get('/testLogging')
		.expect(200)
		.end(function (err, res) {
			expect(res.body.log).toBe("Success");
			if (err) throw err;
		});
	});
	
	it("Test common logging with redactPrefix undefined", async () =>
	{
		config.logging.redactPrefix = undefined;
		const log = logger({ id: randomNum() });

		expect(log).not.toBeNull();
		expect(log.trace).not.toBeNull();
		expect(log.warn).not.toBeNull();
		expect(log.error).not.toBeNull();
		expect(log.debug).not.toBeNull();
		expect(log.fatal).not.toBeNull();
	});

});
