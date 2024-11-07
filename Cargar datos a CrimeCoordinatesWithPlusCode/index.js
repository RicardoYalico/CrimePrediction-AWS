
const axios = require('axios');
const { readFileSync } = require('fs');

const data = readFileSync('./dataset.json');
const body = JSON.parse(data);

let items = []
// URL de la API en AWS
let url = 'https://7k1nhkx21d.execute-api.us-east-1.amazonaws.com/dev/'

while (body.length > 0) {
    let temp = []

    for (var i = 0;
      (i < 25 && i < body.length + temp.length); i++) {
      temp.push(body.shift())
    }
    items.push(temp)
  }

console.log(items[0].length)

function wait(ms) {
    return new Promise( (resolve) => {setTimeout(resolve, ms)});
}

const axiosFunc = async () =>  {

    let i = 0;
    for (const item of items) {
        i++;
        console.log('before axios')
        console.log('item ' + i + ' of ' + items.length)
        axios({
            url: url,
            method: 'post',
            data: item
        }).then( await  wait(2000))
    }
};

axiosFunc()

