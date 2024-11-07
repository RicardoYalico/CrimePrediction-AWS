import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event, context) => {

// console.log(event)
// console.log(event.body)
// const body = JSON.parse(event);
// const body = JSON.parse(event);

const body = event

  var CUSTOMEPOCH = 1300000000000; // artificial epoch
  function generateRowId(shardId /* range 0-64 for shard/slot */) {
    var ts = new Date().getTime() - CUSTOMEPOCH; // limit to recent
    var randid = Math.floor(Math.random() * 512);
    ts = (ts * 64);   // bit-shift << 6
    ts = ts + shardId;
    return (ts * 512) + randid;
  }
  var newPrimaryHashKey = generateRowId(4)+"";

  const params = {
    TableName: "UserReports",
    Item: {
      ID: randomUUID() + "", // Asegúrate de que `body.ID` y otros campos existen en el evento
      date: body.date,
      title: body.title,
      description: body.description,
      latitude: body.latitude,
      longitude: body.longitude,
      plus_code: body.plus_code,
      distrito: body.distrito,
    }
  };
  
  
  
  

  try {
    await docClient.send(new PutCommand(params));
    const response = {
      statusCode: 200,
            headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify('Success: Item added'),
    };
    return response;
  } catch (err) {
    console.error("Error", err);
    const response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify('Error: Could not add item'),
    };
    return response;
  }
  
  
  //   const response = {
  //   statusCode: 200,
  //   body: event
  // }
  
  // return response;
  
  
};
