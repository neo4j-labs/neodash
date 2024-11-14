import React from 'react';
import { ChartProps } from '../Chart';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import URI from 'urijs';
import { replaceDashboardParameters } from '../ChartUtils';

// Sanitizes URIs
const transformUri = (uri: string): string | undefined => {
  const parsedUri = URI(uri);
  if (parsedUri.protocol() === 'http' || parsedUri.protocol() === 'https') {
    return parsedUri.toString(); // Convert URI object back to string
  }
  return undefined; // Return undefined to skip rendering of potentially unsafe URLs
};

// Define custom components for Markdown elements
const CustomTable = ({ _, ...props }) => <table {...props} className='markdown-table' />;
const CustomTh = ({ _, ...props }) => <th {...props} className='markdown-th' />;
const CustomTd = ({ _, ...props }) => <td {...props} className='markdown-td' />;
const CustomATag = ({ _, href, ...props }) => (
  // Apply URI transformation right in the anchor element for additional security
  <a href={href ? transformUri(href) : undefined} {...props} rel='noopener noreferrer' target='_blank' />
);

/**
 * Renders Markdown text provided by the user.
 */
const NeoMarkdownChart = (props: ChartProps) => {
  // Define custom components for Markdown elements
  const components = {
    table: CustomTable,
    th: CustomTh,
    td: CustomTd,
    a: CustomATag,
  };

  // Records are overridden to be a single element array with a field called 'input'.
  const { records } = props;
  const parameters = props.parameters ? props.parameters : {};
  const replaceGlobalParameters =
    props.settings && props.settings.replaceGlobalParameters !== undefined
      ? props.settings.replaceGlobalParameters
      : true;
  const markdown = records[0].input;
  const modifiedMarkdown = replaceGlobalParameters ? replaceDashboardParameters(markdown, parameters) : markdown;
  return (
    <div
      className='markdown-widget'
      style={{ marginTop: '0px', marginLeft: '15px', marginRight: '15px', marginBottom: '0px' }}
    >
      <base target='_blank' />
      <ReactMarkdown
        children={modifiedMarkdown}
        remarkPlugins={[remarkGfm]}
        components={components}
        transformLinkUri={transformUri}
      />
    </div>
  );
};

export default NeoMarkdownChart;
