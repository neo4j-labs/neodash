// import * as mqtt from 'precompiled-mqtt';
// import mqtt from 'precompiled-mqtt';
import * as mqtt from 'mqtt';
import { Kafka } from 'kafkajs';

// Kafka setup
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],  // replace with your Kafka brokers
});


const producer = kafka.producer();

// MQTT setup
const client = mqtt.connect('mqtt://public.mqtthq.com');  // replace with your MQTT broker address

client.on('connect', function () {
  client.subscribe('whatever/topic/it/is', function (err) {  // replace with your MQTT topic
    if (!err) {
      console.log("Successfully subscribed to MQTT topic.");
    }
  })
})

client.on('message', function (topic, message) {
  // when a message is received from MQTT, send it to Kafka
  console.log(message.toString());

  producer.connect()
    .then(() => {
      return producer.send({
        topic: 'kafka_test',  // replace with your Kafka topic
        messages: [
          { value: message.toString() },
        ],
      })
    })
    .then(() => producer.disconnect())
    .catch(console.error);
});


