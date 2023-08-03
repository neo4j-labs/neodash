"use strict";
exports.__esModule = true;
// import * as mqtt from 'precompiled-mqtt';
// import mqtt from 'precompiled-mqtt';
var mqtt = require("mqtt");
var kafkajs_1 = require("kafkajs");
// Kafka setup
var kafka = new kafkajs_1.Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});
var producer = kafka.producer();
// MQTT setup
var client = mqtt.connect('mqtt://public.mqtthq.com'); // replace with your MQTT broker address
client.on('connect', function () {
    client.subscribe('whatever/topic/it/is', function (err) {
        if (!err) {
            console.log("Successfully subscribed to MQTT topic.");
        }
    });
});
client.on('message', function (topic, message) {
    // when a message is received from MQTT, send it to Kafka
    console.log(message.toString());
    producer.connect()
        .then(function () {
        return producer.send({
            topic: 'kafka_test',
            messages: [
                { value: message.toString() },
            ]
        });
    })
        .then(function () { return producer.disconnect(); })["catch"](console.error);
});
