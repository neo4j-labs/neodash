import * as React from 'react';
import { useEffect, useState } from 'react';
import mqtt from "precompiled-mqtt";


function SimpleList(props: { messages: string[] }) {
  const messages = props.messages;
  const listItems = messages.map((msg) =>
    <li> {msg} </li>
  )
  return (
    <ul>{listItems}</ul>
  )
}

export interface MqttListProperties {
  endpoint: string;
  topic: string;
}

export const MqttList = (props: MqttListProperties) => {

  const [clientExisted, setClientExisted] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  const pushOneMessage = (message: string) => {
    setMessages(msgs=>[message, ...msgs.slice(0,4)])
  }

  useEffect(() => {
    if(! clientExisted){
      const client = mqtt.connect(props.endpoint, { clientId:`client_${Date.now().toString()}`, keepalive: 0 })
      
      client.on('connect', () => {
        pushOneMessage(`connected to ${props.endpoint}`)
        client.subscribe(props.topic);
      });
      client.on('error', (err) => {
        alert(err.message)
        pushOneMessage(err.message)
        client.end();
      });
      client.on('reconnect', () => {
        pushOneMessage('reconnecting')
      });
      client.on('message', (topic, message) => {
        pushOneMessage(message.toString())
      });

      setClientExisted(true)
      pushOneMessage(`one instance: ${client.options.toString()}`)
    }
 
  });

  return (
    <SimpleList messages={messages} />
  )
};
