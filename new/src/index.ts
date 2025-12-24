import { fakeDataDirect, writeToFakeDb, type DataDirectRow } from './fakeDb';
import { generateFakeSensorData } from './fakeRequest';
import { parseStringPromise } from 'xml2js';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const xmlContent = generateFakeSensorData();

		const parsedXml = await parseStringPromise(xmlContent);

		const storeId = parsedXml.metrics.siteId[0];
		storeId.replace(' LUSH', '');
		const storeDate = parsedXml.metrics.reportData[0].report[0].date[0];

		const countData = parsedXml.metrics.reportData[0].report[0].object[0].count;
		const insertedData: DataDirectRow[] = [];

		countData.forEach((e: any) => {
			const dataToInsert = {
				storeId: +storeId,
				entrances: +e.enters,
				exits: +e.exits,
				whenstamp: `${storeDate} ${e.startTime}`,
			} satisfies DataDirectRow;

			writeToFakeDb(dataToInsert);
			insertedData.push(dataToInsert);
		});

		return new Response(
			`Data saved!\n\nThe following new data was added to the fakeDb:\n${JSON.stringify(insertedData)}\n\nFull data:\n${JSON.stringify(
				fakeDataDirect
			)}`
		);
	},
} satisfies ExportedHandler<Env>;
