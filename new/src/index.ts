import { fakeDataDirect, writeToFakeDb, type DataDirectRow } from './fakeDb';
import { generateFakeSensorData } from './fakeRequest';
import { parseStringPromise } from 'xml2js';
import * as z from 'zod';

// need to come up with solution for store ID

const CountSchema = z.object({
	$: z.object({
		StartTime: z.string(),
		// EndTime: z.string(),
		// UnixStartTime: z.string(),
		Enters: z.coerce.number(),
		Exits: z.coerce.number(),
		// Status: z.string(),
	}),
});

const CountArraySchema = z
	.union([CountSchema, z.array(CountSchema)])
	.transform((countData) => (Array.isArray(countData) ? countData : [countData]));

const TrafficDataSchema = z.object({
	Metrics: z.object({
		$: z.object({
			SiteId: z.string(),
			// Sitename: z.string(),
			// DeviceId: z.string(),
			// Devicename: z.string(),
		}),
		// Properties: z.object({
		// 	Version: z.string(),
		// 	TransmitTime: z.string(),
		// 	MacAddress: z.string(),
		// 	IpAddress: z.string(),
		// 	HostName: z.string(),
		// 	HttpPort: z.string(),
		// 	HttpsPort: z.string(),
		// 	Timezone: z.string(),
		// 	TimezoneName: z.string(),
		// 	DST: z.string(),
		// 	HwPlatform: z.string(),
		// 	SerialNumber: z.string(),
		// 	DeviceType: z.string(),
		// 	SwRelease: z.string(),
		// }),
		ReportData: z.object({
			// $: z.object({ Interval: z.string() }),
			Report: z.object({
				$: z.object({ Date: z.string() }),
				Object: z.object({
					// $: z.object({
					// 	Id: z.string(),
					// 	DeviceId: z.string(),
					// 	DeviceName: z.string(),
					// 	ObjectType: z.string(),
					// 	Name: z.string(),
					// }),
					Count: CountArraySchema,
				}),
			}),
		}),
	}),
});

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const xmlTrafficData = generateFakeSensorData();

		const jsonTrafficData = await parseStringPromise(xmlTrafficData, { explicitArray: false });

		// insert logging step here
		console.log('start');

		const validatedTrafficData = TrafficDataSchema.safeParse(jsonTrafficData);
		console.log(validatedTrafficData.data?.Metrics.ReportData);
		console.log('-------------------------------');
		console.log(validatedTrafficData.data?.Metrics.ReportData.Report);
		console.log('-------------------------------');

		console.log(validatedTrafficData.data?.Metrics.ReportData.Report.Object);
		console.log('done');

		if (validatedTrafficData.data) {
			const storeId = validatedTrafficData.data.Metrics.$.SiteId;
			storeId.replace(' LUSH', '');

			const storeDate = validatedTrafficData.data.Metrics.ReportData.Report.$.Date;

			// const insertedData: DataDirectRow[] = [];
			const count = validatedTrafficData.data.Metrics.ReportData.Report.Object.Count;

			let insertedData: DataDirectRow[] = [];

			count.forEach((e: any) => {
				const dataToInsert = {
					storeId: +storeId,
					entrances: e.$.Enters,
					exits: e.$.Exits,
					whenstamp: `${storeDate} ${e.$.StartTime}`,
				} satisfies DataDirectRow;

				writeToFakeDb(dataToInsert);
				insertedData.push(dataToInsert);
			});

			return new Response(
				`Data saved!\n\nThe following new data was added to the fakeDb:\n${JSON.stringify(insertedData)}\n\nFull data:\n${JSON.stringify(
					fakeDataDirect
				)}`
			);
		}

		return new Response('Sorry, invalid request');
	},
} satisfies ExportedHandler<Env>;
