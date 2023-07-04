import React, { PropsWithChildren } from 'react';
import { Typography } from '@neo4j-ndl/react';

export const Section = ({ children }: PropsWithChildren) => (
  <div className='n-py-4 n-flex n-flex-col n-gap-token-4'>{children}</div>
);

export const SectionTitle = ({ children }: PropsWithChildren) => <Typography variant='h5'>{children}</Typography>;

export const SectionContent = ({ children }: PropsWithChildren) => (
  <Typography variant='body-medium'>{children}</Typography>
);
