import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function PageHeader({ title = 'NeoDash - Neo4j Dashboard Builder' }) {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
}
