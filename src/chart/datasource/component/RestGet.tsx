import * as React from 'react';
import { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { forEachChild } from 'typescript';
import ReactJson from 'react-json-view';

export function RestGet(props: {endpoint:string}){
  const [queryResult, setQueryResult] = useState({});

  const {endpoint} = props;

  const SimpleText = (props: {text:any}) =>{
    return <div> {props.text.toString()} </div>
  }

  useEffect(() => {
    fetch(endpoint).then((response)=>{
      response.json().then(obj => {setQueryResult(obj)})
    })
  })

  return (
        //<SimpleText text={queryResult} />
        <ReactJson src={queryResult} />
      
  );
}