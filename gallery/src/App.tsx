import React from 'react';
import logo from './logo.svg';
import './App.css';


import { Button, TextInput, HeroIcon } from '@neo4j-ndl/react';

function App() {

  const [searchText, setSearchText] = React.useState("");

  const list = [
    {
      title: "Fraud Detection",
      description: "A demo dashboard that shows off fraud detection using Neo4j.",
      keywords: "fraud banking money laundering detection",
      image: "https://github.com/neo4j-labs/neodash/blob/master/public/screenshot.png?raw=true",
      link: "https://test.com"
    },
    {
      title: "Telecommunications Network",
      description: "View the status of a telco network represented in the graph.",
      keywords: "telco telecommunications network live data",
      image: "https://github.com/neo4j-labs/neodash/blob/master/public/screenshot.png?raw=true",
      link: "https://test.com"
    },
    {
      title: "Clinical Data Graph",
      description: "Inspect complex clinical data, modelled as a graph.",
      keywords: "clinical studies medical research",
      image: "https://github.com/neo4j-labs/neodash/blob/master/public/screenshot.png?raw=true",
      link: "https://test.com"
    },
    {
      title: "Logistics Dashboard",
      description: "View a global logistics network that powers the modern shipping world.",
      keywords: 'shipping global logistics freight products',
      image: "https://github.com/neo4j-labs/neodash/blob/master/public/screenshot.png?raw=true",
      link: "https://test.com"
    }
  ]

  const filteredList = list.filter(item => item.keywords.includes(searchText.toLowerCase()));
  return (

    <div className="n-bg-neutral-20 h-100" >
      <div className='n-bg-neutral-10'>
        <div className="md:container md:mx-auto m-5 p-8 ">
          <h3 className='flex item-center justify-center'>NeoDash Dashboard Gallery 🎨</h3>
          <p className='flex item-center justify-center'>This page contains a set of sample NeoDash dashboards built on public data. </p>
          <div className='flex item-center justify-center p-2'>
            <TextInput
              label=""
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              leftIcon={<HeroIcon iconName="SearchIcon" />}
              placeholder="Filter Dashboards..."
              rightIcon={<HeroIcon className="n-cursor-pointer" iconName="XIcon" />}
            />
          </div>
        </div>
      </div>
      <div className="md:container md:mx-auto n-bg-neutral-00">
        <div className="grid grid-cols-3 grid-flow-row gap-2">
          {
            filteredList.map(item => {
              return <div className='m-4 n-bg-neutral-10 n-shadow-l4'>
                <div className="">
                  <h4 className="p-3">{item.title}</h4>
                  <p className="p-3">{item.description}</p>
                  <img className="p-3" src={item.image}></img>
                  <div className='m-2 flex item-center justify-center'>
                    <a href={item.link}><Button>Try me</Button></a>
                  </div>

                </div>
              </div>
            })
          }
      
        </div>
        {(filteredList.length == 0) ? <p className='item-center flex justify-center n-text-neutral-60'> No results. </p> : <></>}
      </div>

      <div className='n-bg-neutral-10'>
        <div className="md:container md:mx-auto m-5 p-8 ">
          <p className='flex item-center justify-center n-text-neutral-60'>Want to add a dashboard to this gallery? Check out the
            <ul>
              <a className="mx-2 underline" href='https://github.com/neo4j-labs/neodash/tree/master/gallery'>Guidelines</a>
            </ul> on GitHub.
            </p>
        </div>
      </div>
    </div >
  );
}

export default App;
