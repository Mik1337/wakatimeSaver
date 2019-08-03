const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fetch = require('node-fetch');

const config = require('../config');

const { wakatimeUrl, database, } = config;
const { host, user, pass, name, port } = database;

const client = new MongoClient(`mongodb://${user}:${pass}@${host}:${port}/${name}`, { useNewUrlParser: true });

// connects to server and inserts data from wakatime plugin for previous day
client.connect(async(err) => {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db(name);
  const collection = db.collection('data');
  const data = await getData();
  collection.insertOne(data, (err, result) => {
    console.log("Inserted the documents into the collection");
  });
});

// gets data from wakatime plugin
const getData = () => {
  return fetch(wakatimeUrl).then(data => data.json())
  .then(json => {
    const data = json.data;
    return data.map(i => {
      if (i.range.text === 'Yesterday') {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return {time: i.grand_total,date: date.toDateString()};
      }
    }).filter(i => i);
  })
  .then(data => data[0])
  .catch(error => console.log(`error ${error}`));
  return data;
}
