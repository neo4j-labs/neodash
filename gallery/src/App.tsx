import React from 'react';
import './App.css';
import { Button, TextInput, HeroIcon, Tag } from '@neo4j-ndl/react';

// These are the read-only credentials of the public database where the gallery exists.
const uri = "neo4j+s://acb5b6ae.databases.neo4j.io"
const user = "gallery";
const password = "gallery";

async function loadDashboards(setResults: any) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const neo4j = require('neo4j-driver');
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();

  try {
    const result = await session.run(
      'MATCH (n:_Neodash_Dashboard) RETURN properties(n) as entry ORDER BY entry.index ASC',
    );
    setResults(
      result.records.map((r: { _fields: any }) => {
        return r._fields[0];
      }),
    );
  } finally {
    await session.close();
  }
  await driver.close();
}
function App() {
  const [searchText, setSearchText] = React.useState('');
  const [list, setList] = React.useState([]);
  if (list.length == 0) {
    loadDashboards(setList);
  }

  const filteredList = list.filter(
    (item: { title: string; author: string; description: string; keywords: any }) =>
      item.keywords &&
      `${item.title} ${item.author} ${item.description} ${item.keywords}`
        .toLowerCase()
        .includes(searchText.toLowerCase()),
  );

  return (
    <div className="n-bg-neutral-20 h-100">
      {/* Header */}
      <div className="n-bg-neutral-10">
        <div className="md:container md:mx-auto m-5 p-8 ">
          <h3 className="flex item-center justify-center">NeoDash Dashboard Gallery 🎨</h3>
          <p className="flex item-center justify-center">
            This page contains a set of sample NeoDash dashboards built on public data.{' '}
          </p>
          <p className="flex item-center justify-center">
            This gallery is created and maintained by the NeoDash community.
          </p>
          <div className="flex item-center justify-center p-2">
            <TextInput
              label=""
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              leftIcon={<HeroIcon iconName="SearchIcon" />}
              placeholder="Filter Dashboards..."
              rightIcon={<HeroIcon className="n-cursor-pointer" iconName="XIcon" />}
            />
          </div>
        </div>
      </div>
      {/* Grid */}
      <div className="md:container md:mx-auto n-bg-neutral-00">
        <div className="grid grid-cols-3 grid-flow-row gap-2">
          {filteredList.map((item) => {
            return (
              <div className="m-4 n-bg-neutral-10 n-shadow-l4">
                <div className="">
                  <h4 className="p-3 float-right">
                    {item.language}
                    {item.logo ? (
                      <a target="_blank" href={item.authorURL}>
                        <img style={{ width: 30 }} src={item.logo}></img>
                      </a>
                    ) : (
                      <></>
                    )}
                  </h4>
                  <h4 className="p-3">{item.title}</h4>
                  <p className="p-3">
                    {item.description}
                    <br />
                    <span className="n-text-neutral-70">
                      Author:{' '}
                      <a className="underline" target="_blank" href={item.authorURL}>
                        {item.author}
                      </a>
                    </span>
                  </p>
                  <span className="mx-2">
                    {`${item.keywords}`.split(' ').map((k) => (
                      <Tag className="mx-1">{k}</Tag>
                    ))}
                  </span>
                  <img width="1000" height="350" className="p-3" src={item.image}></img>
                  <div className="m-2 flex item-center justify-center">
                    <a target="_blank" href={item.url}>
                      <Button>Load</Button>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {list.length == 0 ? <p className="item-center flex justify-center n-text-neutral-60"> Loading... </p> : <></>}
        {list.length != 0 && filteredList.length == 0 ? (
          <p className="item-center flex justify-center n-text-neutral-60"> No results. </p>
        ) : (
          <></>
        )}
      </div>
      {/* Footer */}
      <div className="n-bg-neutral-10">
        <div className="md:container md:mx-auto m-5 p-8 ">
          <p className="flex item-center justify-center n-text-neutral-60">
            Want to add a dashboard to this gallery? Check out the
            <ul>
              <a className="mx-1 underline" href="https://github.com/neo4j-labs/neodash/tree/master/gallery">
                Guidelines
              </a>
            </ul>{' '}
            on GitHub.
          </p>
          <br />
          <code className='flex item-center justify-center n-text-neutral-40'> {"-- neodash-gallery v0.2 --"} </code>
        </div>
      </div>
    </div>
  );
}

export default App;
