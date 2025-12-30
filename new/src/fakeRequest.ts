export const generateFakeSensorData = () => {
	const getRandomTimeValue = (max: number): string => {
		const value = Math.floor(Math.random() * max);
		return value < 10 ? `0${value}` : value.toString();
	};

	const generateCountArray = () => {
		const numberOfEntries = Math.floor(Math.random() * 10);
		const countArray = [];

		for (let i = 0; i <= numberOfEntries; i++) {
			const randomEntersValue = Math.floor(Math.random() * 10);
			const randomExitsValue = Math.floor(Math.random() * 10);
			const randomStartHour = getRandomTimeValue(24);
			const randomStartMinute = getRandomTimeValue(59);
			let endMinuteHelper = parseInt(randomStartMinute);
			endMinuteHelper++;
			let endMinute;
			endMinuteHelper < 10 ? (endMinute = `0${endMinuteHelper}`) : (endMinute = endMinuteHelper.toString());

			countArray.push(`
        <Count StartTime="${randomStartHour}:${randomStartMinute}:00" EndTime ="${randomStartHour}:${endMinute}:00" UnixStartTime="0" Enters="${randomEntersValue}" Exits="${randomExitsValue}" Status="0"/>
        `);
		}
		return countArray.join('');
	};

	return `
    <?xml version="1.0" encoding="UTF-8"?>
    <Metrics SiteId="665" Sitename="International Plaza (665)" DeviceId="SD-01" Devicename="Entrance">
      <Properties>
        <Version>2</Version>
        <TransmitTime>1763760645</TransmitTime>
        <MacAddress>00:b0:9d:c8:63:96</MacAddress>
        <IpAddress>10.10.81.100</IpAddress>
        <HostName>Cam-13132694</HostName>
        <HttpPort>80</HttpPort>
        <HttpsPort>443</HttpsPort>
        <Timezone>-5</Timezone>
        <TimezoneName>-5</TimezoneName>
        <DST>1</DST>
        <HwPlatform>2300</HwPlatform>
        <SerialNumber>13132694</SerialNumber>
        <DeviceType>0</DeviceType>
        <SwRelease>5.6.18.554</SwRelease>
      </Properties>
      <ReportData Interval="1">
        <Report Date="2025-11-18">
          <Object Id="0" DeviceId="SD-01" DeviceName="Entrance" ObjectType="0" Name="Door 01">
            ${generateCountArray()}
          </Object>
        </Report>
      </ReportData>
    </Metrics>
  `.trim();
};
