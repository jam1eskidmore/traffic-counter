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
      endMinuteHelper < 10
        ? (endMinute = `0${endMinuteHelper}`)
        : (endMinute = endMinuteHelper.toString());

      countArray.push(`
                <count>
                    <startTime>${randomStartHour}:${randomStartMinute}:00</startTime>
                    <endTime>${randomStartHour}:${endMinute}:00</endTime>
                    <enters>${randomEntersValue}</enters>
                    <exits>${randomExitsValue}</exits>
                    <status>0</status>
                </count>
            `);
    }
    return countArray.join("");
  };

  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <metrics>
      <siteId>665</siteId>
      <siteName>International Plaza (665)</siteName>
      <deviceId>SD-01</deviceId>
      <deviceName>Entrance</deviceName>
      <properties>
        <macAddress>00:b0:9d:c8:63:96</macAddress>
        <ipAddress>10.10.81.100</ipAddress>
        <hostName>Cam-13132694</hostName>
        <hwPlatform>2300</hwPlatform>
        <timezone>-5</timezone>
        <dst>1</dst>
        <deviceType>0</deviceType>
        <serialNumber>13132694</serialNumber>
      </properties>
      <reportData>
        <interval>1</interval>
        <report>
          <date>2025-11-18</date>
          <object>
            <id>0</id>
            <deviceId>SD-01</deviceId>
            <deviceName>Entrance</deviceName>
            <objectType>0</objectType>
            <name>Entrance</name>
            ${generateCountArray()}
          </object>
        </report>
      </reportData>
    </metrics>
  `.trim();
};
