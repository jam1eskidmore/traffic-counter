# Traffic Counter

By: Jamie Skidmore

The purpose of this project is to rearchitect the PHP application responsible for receiving, logging, and handling traffic data coming from sensors in Lush retail shops. Inside `./old` is the old server endpoint taken from the `om.lush.com` server, to use as a reference during development. Inside `./new` is the new Typescript code I have written so far (just a start, still very much a WIP :p).

Below I've written some questions that are on my mind. If you are reading this and have any thoughts to share, please send me a chat!

## Questions

### Logging

The PHP file logs requests in a local log file on the server. The new version will be serverless via Cloudflare Worker. Will we use Worker Logs or send log data somewhere else?

### GraphQL

What will be the role of GraphQL in this application? The PHP file inserts directly into the db. Is the plan to use GraphQL mutations in the new architecture, or still insert directly into db?

## Advice needed

### `explicitArray: true` default setting for xml2js:

Data comes from traffic sensors in XML format. I have chosen the xml2js library to parse the XML data.

The xml2js parser clunkily places all child elements inside arrays, even if only one of that child element is present.

I wanted to disable this feature to bypass repeated indexing when accessing nested elements. However, based on the old om server logs, the `count` element could contain one _or_ many children and therefore needs to be handled as an array. Setting `explicitArray: false` means that `count` is parsed as either an object or an array depending on the number of `count` elements in the incoming sensor data.

With `explicitArray` disabled, one solution is to manually check the type of `count` after parsing the XML, and converting `count` from an object to an array of one if necessary. Another solution is to write code for saving count data in both scenarios - `count` as object and as array - using some sort of if statement. Both of these solutions add clutter to the application.

I'm wondering what is better:

- keep `explicitArray: true` and deal with the annoying indexing
- set `explicitArray: false`, allowing `count` type to be object or array and adjusting code to accomodate both scenarios
