import crypto from 'crypto';
import url from 'url';
import https from 'https';

export const handler = async (event, context) => {
  const body = event;
  let resp;
  let urlImage;
  let codingUrlImage;

  const clientSecret = 'GOOGLE_MAPS_CLIENT_SECRET';
  const apiKey = 'GOOGLE_MAPS_API_KEY';

  function removeWebSafe(safeEncodedString) {
    return safeEncodedString.replace(/-/g, '+').replace(/_/g, '/');
  }

  function makeWebSafe(encodedString) {
    return encodedString.replace(/\+/g, '-').replace(/\//g, '_');
  }

  function decodeBase64Hash(code) {
    return Buffer.from(code, 'base64');
  }

  function encodeBase64Hash(key, data) {
    return crypto.createHmac('sha1', key).update(data).digest('base64');
  }

  function sign(path, secret) {
    const uri = url.parse(path);
    const safeSecret = decodeBase64Hash(removeWebSafe(secret));
    const hashedSignature = makeWebSafe(encodeBase64Hash(safeSecret, uri.path));
    return url.format(uri) + '&signature=' + hashedSignature;
  }

  async function getStreetViewImage(lat, lng, heading, fov, pitch, source, outputPath) {
    const signedUrl = sign(`https://maps.googleapis.com/maps/api/streetview?size=640x640&location=${lat},${lng}&heading=${heading}&fov=${fov}&pitch=${pitch}&source=${source}&key=${apiKey}`, clientSecret);
    const _codingUrlImage = sign(`https://maps.googleapis.com/maps/api/streetview?size=640x640&location=${encodeURI(body.name)}&heading=${heading}&fov=${fov}&pitch=${pitch}&source=${source}&key=${apiKey}`, clientSecret);
    urlImage = signedUrl
    codingUrlImage = _codingUrlImage
}

getStreetViewImage(body.lat, body.lng, 360, 100, 15, 'outdoor', '').then()

  const response = {
    statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
    body: {
      urlImage: urlImage,
      codingUrlImage: codingUrlImage
    },  // Convertir el buffer a base64
    isBase64Encoded: true  // Indicar que la respuesta está codificada en base64
  };

  return response;
};
