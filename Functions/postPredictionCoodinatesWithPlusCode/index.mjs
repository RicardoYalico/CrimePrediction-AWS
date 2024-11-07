import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
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
  function generateRowId(shardId /* range 0-64 for shard/slot */ ) {
    var ts = new Date().getTime() - CUSTOMEPOCH; // limit to recent
    var randid = Math.floor(Math.random() * 512);
    ts = (ts * 64); // bit-shift << 6
    ts = ts + shardId;
    return (ts * 512) + randid;
  }

  let items = []
  let count = body.length;

  console.log("Longitud de " + count)



  while (body.length > 0) {
    let temp = []

    for (var i = 0;
      (i < 25 && i < body.length + temp.length); i++) {
      let bodyShift = body.shift();
      var newPrimaryHashKey = generateRowId(4) + "";
      
      temp.push({
        PutRequest: {
          Item: {
            ID: randomUUID() + "", // Asegúrate de que `body.ID` y otros campos existen en el evento
            lat: bodyShift.lat,
            lng: bodyShift.lng,
            predicted_class: bodyShift.predicted_class,
            zonas_inseguras: bodyShift.zonas_inseguras,
            zonas_seguras: bodyShift.zonas_seguras,
            plus_code: bodyShift.plus_code,
            distrito: bodyShift.distrito,
          }
        }
      })
    }
    items.push(temp)
  }


  

  // var params = {
  //   RequestItems: {
  //     CrimeCoordinatesWithPlusCode: items
  //   },
  // };

  try {

    for (var item of items) {
      var params = {
        RequestItems: {
          PredictionCoodinatesWithPlusCode: item
        },
      };
      
      
      await docClient.send(new BatchWriteCommand(params));

    }
    
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
  }
  catch (err) {
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
