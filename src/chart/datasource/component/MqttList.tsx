import * as React from 'react';
import { useEffect, useState } from 'react';
import mqtt from "precompiled-mqtt";


function SimpleList(props: { messages: string[] }) {
  const messages = props.messages
  const listItems = messages.map((msg) =>
    <li> {msg} </li>
  )
  return (
    <ul>{listItems}</ul>
  )
}

export interface MqttListProperties {
  host: string;
  topic: string;
  port: number;
}

export const MqttList = (props: MqttListProperties) => {

  const [clientExisted, setClientExisted] = useState(false)
  const [messages, setMessages] = useState<string[]>([])

  const pushOneMessage = (message: string) => {
    // alert(messages)
    const latestMessages: string[] = []
    latestMessages.push(message.toString())
    // alert(messages)
    messages.forEach(x => {
      if (latestMessages.length < 5) {
        latestMessages.push(x)
      }
    })
    
    setMessages(latestMessages)
  }

  useEffect(() => {
    if(! clientExisted){
      const client = mqtt.connect({
        host: props.host,
        port: props.port, 
        connectTimeout: 10 * 1000
      })
      
      client.on('connect', () => {
        alert('connected')
        pushOneMessage(`connected to ${props.host}`)
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
      pushOneMessage(`one instance: ${client.reconnecting}`)
    }
 
  });

  return (
    <SimpleList messages={messages} />
  )
};
