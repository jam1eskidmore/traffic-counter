export interface DataDirectRow {
	storeId: number;
	entrances: number;
	exits: number;
	whenstamp: string;
}

export const fakeDataDirect: DataDirectRow[] = [
	{
		storeId: 101,
		entrances: 42,
		exits: 38,
		whenstamp: '2025-01-10 09:00:00',
	},
	{
		storeId: 102,
		entrances: 42,
		exits: 38,
		whenstamp: '2025-01-10 09:00:00',
	},
];

export const writeToFakeDb = (dataToAdd: DataDirectRow) => {
	fakeDataDirect.push(dataToAdd);
	return 'success';
};
//test
