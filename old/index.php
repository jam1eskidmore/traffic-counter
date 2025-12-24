<?php

// accesses db
include 'db.inc.php'; // $link is defined here
mysql_selectdb('nomi',$link);

// helper function checks if a certain attribute exists, returns it
function xml_attribute($object, $attribute)
{
    if(isset($object[$attribute]))
        return (string) $object[$attribute];
}

// parses incoming XML data sent as post request from traffic sensor
$xmlcontent = file_get_contents('php://input');

// appends incoming XML data to local log file
$fp=fopen("out_new.xml","a+");
fputs($fp,$xmlcontent);
fclose($fp);

// converts incoming XML data into an object
$xml=simplexml_load_string($xmlcontent);

// correctly formats store id for sql statement
$store_id=xml_attribute($xml,'SiteId');
$store_id=str_replace(" LUSH","",$store_id);

$storedate=xml_attribute($xml->ReportData->Report,'Date');

// loops through traffic report (array of count object containing traffic data)
// each count object contains 1 minute worth of traffic data
foreach($xml->ReportData->Report->Object->Count as $count) {

$thetime=xml_attribute($count,'StartTime');
$enters=xml_attribute($count,'Enters');
$exits=xml_attribute($count,'Exits');

// prepares query
$sql="INSERT into data_direct (store_id,entrances,exits,whenstamp) values ('$store_id','$enters','$exits','$storedate $thetime');";

// sends data to db
$done=mysql_query($sql,$link);
}
?>
