import React, { PropsWithChildren } from 'react';
import { Button, Dialog, Typography } from '@neo4j-ndl/react';
import { BookOpenIconOutline, BeakerIconOutline } from '@neo4j-ndl/react/icons';

const SectionTitle = ({ children }: PropsWithChildren) => <Typography variant='h5'>{children}</Typography>;

export const NeoAboutModal = ({ open, handleClose, getDebugState }) => {
  const version = '2.2.3';

  const downloadDebugFile = () => {
    const element = document.createElement('a');
    const state = getDebugState();
    state.version = version;
    const file = new Blob([JSON.stringify(state, null, 2)], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'neodash-debug-state.json';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div>
      <Dialog onClose={handleClose} open={open == true} aria-labelledby='form-dialog-title' size='large'>
        <Dialog.Header>About NeoDash</Dialog.Header>
        <Dialog.Content>
          <div>
            <SectionTitle>TestNeoDash is a dashboard builder for the Neo4j graph database.</SectionTitle>
            <br />
            If you can write Cypher queries, you can build a dashboard in minutes.
            <hr></hr>
            <h4>Core Features</h4>
            <ul>
              <li>
                An editor to write and execute&nbsp;
                <a target='_blank' href='https://neo4j.com/developer/cypher/'>
                  Cypher
                </a>
                &nbsp;queries.
              </li>
              <li>Use results of your Cypher queries to create tables, bar charts, graph visualizations, and more.</li>
              <li>Style your reports, group them together in pages, and add interactivity between reports.</li>
              <li>Save and share your dashboards with your friends.</li>
            </ul>
            No connectors or data pre-processing needed, it works directly with Neo4j!
            <hr></hr>
            <h4>Getting Started</h4>
            You will automatically start with an empty dashboard when starting up NeoDash for this first time.
            <br />
            Click the
            <strong>
              (<BookOpenIconOutline className='n-w-6 n-h-6' style={{ display: 'inline' }} /> Documentation)
            </strong>
            &nbsp;button to see some example queries and visualizations.
            <hr></hr>
            <h4>Extending NeoDash</h4>
            NeoDash is built with React and&nbsp;
            <a target='_blank' href='https://github.com/adam-cowley/use-neo4j'>
              use-neo4j
            </a>
            , It uses&nbsp;
            <a target='_blank' href='https://github.com/neo4j-labs/charts'>
              charts
            </a>
            &nbsp;to power some of the visualizations, and&nbsp;
            <a target='_blank' href='https://www.openstreetmap.org/'>
              openstreetmap
            </a>
            &nbsp;for the map view.
            <br />
            You can also extend NeoDash with your own visualizations. Check out the developer guide in the&nbsp;
            <a target='_blank' href='https://github.com/neo4j-labs/neodash/'>
              project repository
            </a>
            .<hr></hr>
            <h4>Contact</h4>
            For suggestions, feature requests and other feedback: create an issue on the&nbsp;
            <a href='https://github.com/neo4j-labs/neodash'>GitHub repository</a>, or the&nbsp;
            <a
              href={
                'https://community.neo4j.com/t5/forums/filteredbylabelpage/board-id/integrations/label-name/neodash'
              }
            >
              Neo4j Community Forums
            </a>
            .
            <br />
            <hr></hr>
            <br />
            <table style={{ width: '100%' }}>
              <tr>
                <td>
                  <Button onClick={downloadDebugFile} fill='outlined' color='neutral' size='small'>
                    Debug Report
                    <BeakerIconOutline className='n-w-6 n-h-6' />
                  </Button>
                </td>
                <td>
                  <i style={{ float: 'right', fontSize: '11px' }}>v{version}</i>
                </td>
              </tr>
            </table>
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  );
};

export default NeoAboutModal;
