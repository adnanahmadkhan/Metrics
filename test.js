const request = require('request');

const options = {
    url: 'http://localhost:4000/metric/khan',
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
        'User-Agent': 'my-test-client'
    },
    form: {
      value: '1',
    }
};

async function test(times){
  for (let i = 0; i < times; i++){
    if(i%1000 == 0){
      // giving 50 ms break after each 1000 record insertion
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    request(options, function(err, res, body) {
      if(err) console.log(err)
    });
  }
}

// stress test for half a million records
test(500000);