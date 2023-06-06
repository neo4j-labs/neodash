import React from 'react';
import { Tooltip } from '@mui/material';
import NeoCodeEditorComponent from '../component/editor/CodeEditorComponent';
import NeoReport from '../report/Report';
import { SideNavigationItem } from '@neo4j-ndl/react';
import { ChartBarIconSolid } from '@neo4j-ndl/react/icons';
import { Dialog, Typography } from '@neo4j-ndl/react';
import { Section, SectionTitle, SectionContent } from '../modal/ModalUtils';

export const NeoReportExamplesModal = ({ database, examples, extensions, navItemClass }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title='Examples' aria-label='examples' disableInteractive>
        <SideNavigationItem onClick={handleClickOpen} icon={<ChartBarIconSolid className={navItemClass} />}>
          Examples
        </SideNavigationItem>
      </Tooltip>

      {open ? (
        <Dialog open={open == true} onClose={handleClose} aria-labelledby='form-dialog-title' className='dialog-xl'>
          <Dialog.Header id='form-dialog-title'>
            <ChartBarIconSolid className='icon-base icon-inline text-r' />
            Report Examples
          </Dialog.Header>
          <Dialog.Content>
            <div className='n-flex n-flex-col n-gap-token-4 n-divide-y n-divide-light-neutral-border-strong'>
              {examples.map((example, index) => {
                return (
                  <Section key={`example-${index}`}>
                    <SectionTitle>{example.title}</SectionTitle>
                    <SectionContent>
                      <div className='n-grid n-grid-cols-3 n-gap-8'>
                        <div className='n-col-span-3'>{example.description}</div>
                        <div className='n-col-span-1'>
                          <NeoCodeEditorComponent
                            editable={false}
                            placeholder=''
                            value={example.exampleQuery}
                            language={example.type == 'iframe' ? 'url' : 'cypher'}
                          ></NeoCodeEditorComponent>
                        </div>

                        <div
                          className='n-col-span-2'
                          style={{
                            height: '355px',
                            overflow: 'hidden',
                            border: '1px solid lightgrey',
                          }}
                        >
                          <NeoReport
                            query={example.syntheticQuery}
                            database={database}
                            disabled={!open}
                            extensions={extensions}
                            selection={example.selection}
                            parameters={example.globalParameters}
                            settings={example.settings}
                            fields={example.fields}
                            dimensions={example.dimensions}
                            ChartType={example.chartType}
                            type={example.type}
                          />
                        </div>
                      </div>
                    </SectionContent>
                  </Section>
                );
              })}
            </div>
          </Dialog.Content>
        </Dialog>
      ) : (
        <></>
      )}
    </div>
  );
};

export default NeoReportExamplesModal;
