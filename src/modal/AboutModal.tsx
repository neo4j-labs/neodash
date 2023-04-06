import React, { PropsWithChildren } from 'react';
import { Button, Dialog, TextLink, Typography } from '@neo4j-ndl/react';
import { BookOpenIconOutline, BeakerIconOutline } from '@neo4j-ndl/react/icons';

const SectionTitle = ({ children }: PropsWithChildren) => <Typography variant='h5'>{children}</Typography>;
const Description = ({ children }: PropsWithChildren) => <Typography variant='body-medium'>{children}</Typography>;
const Section = ({ children }: PropsWithChildren) => (
  <div className='n-py-4 n-flex n-flex-col n-gap-token-4'>{children}</div>
);

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
          <div className='n-flex n-flex-col n-gap-token-4 n-divide-y n-divide-light-neutral-border-strong'>
            <Section>
              <SectionTitle>NeoDash is a dashboard builder for the Neo4j graph database.</SectionTitle>
              <Description>If you can write Cypher queries, you can build a dashboard in minutes.</Description>
            </Section>
            <Section>
              <SectionTitle>Core Features</SectionTitle>
              <Description>
                <ul className='n-list-disc n-pl-token-8'>
                  <li>
                    An editor to write and execute&nbsp;
                    <a target='_blank' href='https://neo4j.com/developer/cypher/'>
                      Cypher
                    </a>
                    &nbsp;queries.
                  </li>
                  <li>
                    Use results of your Cypher queries to create tables, bar charts, graph visualizations, and more.
                  </li>
                  <li>Style your reports, group them together in pages, and add interactivity between reports.</li>
                  <li>Save and share your dashboards with your friends.</li>
                </ul>
                No connectors or data pre-processing needed, it works directly with Neo4j!
              </Description>
            </Section>
            <Section>
              <SectionTitle>Getting Started</SectionTitle>
              <Description>
                You will automatically start with an empty dashboard when starting up NeoDash for this first time.
                <br />
                Click the{' '}
                <strong>
                  (<BookOpenIconOutline className='icon-base icon-inline text-r' /> Documentation)
                </strong>
                &nbsp;button to see some example queries and visualizations.
              </Description>
            </Section>
            <Section>
              <SectionTitle>Extending NeoDash</SectionTitle>
              <Description>
                NeoDash is built with React and&nbsp;
                <TextLink externalLink target='_blank' href='https://github.com/adam-cowley/use-neo4j'>
                  use-neo4j
                </TextLink>
                , It uses{' '}
                <TextLink externalLink target='_blank' href='https://github.com/neo4j-labs/charts'>
                  charts
                </TextLink>{' '}
                to power some of the visualizations, and&nbsp;
                <TextLink externalLink target='_blank' href='https://www.openstreetmap.org/'>
                  openstreetmap
                </TextLink>{' '}
                for the map view.
                <br />
                You can also extend NeoDash with your own visualizations. Check out the developer guide in the{' '}
                <TextLink externalLink target='_blank' href='https://github.com/neo4j-labs/neodash/'>
                  project repository
                </TextLink>
                .
              </Description>
            </Section>
            <Section>
              <SectionTitle>Contact</SectionTitle>
              <Description>
                For suggestions, feature requests and other feedback: create an issue on the&nbsp;
                <TextLink externalLink target='_blank' href='https://github.com/neo4j-labs/neodash'>
                  GitHub repository
                </TextLink>{' '}
                , or the
                <TextLink
                  externalLink
                  href={
                    'https://community.neo4j.com/t5/forums/filteredbylabelpage/board-id/integrations/label-name/neodash'
                  }
                >
                  Neo4j Community Forums
                </TextLink>
                .
              </Description>
            </Section>
          </div>
          <div className='n-flex n-flex-row n-justify-between n-mt-token-8'>
            <div>
              <Button onClick={downloadDebugFile} fill='outlined' color='neutral' size='small'>
                Debug Report
                <BeakerIconOutline className='btn-icon-sm-r' />
              </Button>
            </div>
            <div>
              <i style={{ float: 'right', fontSize: '11px' }}>v{version}</i>
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  );
};

export default NeoAboutModal;
