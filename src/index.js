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
  const date = new Date();
  date.setDate(date.getDate() - 1);
  collection.find({"date":date.toDateString()}).toArray(async (err, items) => {
    const data = await getData();
    if (!items.length) {
      const data = await getData();
      // console.log(typeof data);
      collection.insertMany(data, (err, result) => {
        console.log("Inserted the documents into the collection");
      });
    } else {
        console.log("nothing to do here");
    }
  });
});

// gets data from wakatime plugin
const getData = () => {
  return fetch(wakatimeUrl).then(data => data.json())
  .then(json => {
    const data = json.data;
    return data.map(i => {
      const date = new Date();
      const ObjArray = []
      if (i.range.text === 'Yesterday') {
        const data = json.data;
        date.setDate(date.getDate() - 1);
        return {time: i.grand_total, date: date.toDateString()};
      }
      // load all data except todays
      // else if (i.range.text === 'Today') {
      //   console.log('nothing to do here yet');
      // }
      // else {
      //   return {time: i.grand_total, date: i.range.text.replace(/rd|th|st/g, '')};
      // }
    }).filter(i => i);
  })
  .catch(error => console.log(`error ${error}`));
  return data;
}
