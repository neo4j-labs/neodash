import React from 'react';
import { connect, useDispatch } from 'react-redux';

import { queryToCypher } from './utils';
import { selectNode, selectRelationship } from './state/QueryBuilderActions';
import { getCurrentQuery } from './state/QueryBuilderSelectors';

function TreeRelationship({ relationship }) {
  const dispatch = useDispatch();
  const handleClick = () => dispatch(selectRelationship(relationship.id));
  const handleNodeClick = () => dispatch(selectNode(relationship.to));

  return (
    <li>
      <button
        className='bg-gray-200 text-gray-700 rounded-md px-4 py-2 mb-2 font-bold mr-2 focus:outline-none'
        onClick={handleClick}
      >
        {relationship.direction === 'in' ? '<' : ''}-
        <span className='bg-gray-100 text-gray-500 px-2 py-1 inline-block ml-1'>
          {relationship.id}:{relationship.type}
        </span>
        -{relationship.direction === 'out' ? '>' : ''}
      </button>
      <button
        className='bg-gray-300 text-gray-700 rounded-full px-4 py-2 mb-2 font-bold focus:outline-none'
        onClick={handleNodeClick}
      >
        {relationship.to}
      </button>
    </li>
  );
}

function TreeNode({ node, query }) {
  const dispatch = useDispatch();
  const handleNodeClick = (id) => dispatch(selectNode(id));

  const {relationships} = query;
  const {predicates} = query;
  const {output} = query;

  const theseRels = relationships.filter((rel) => rel.from === node.id);

  const relationshipList = theseRels.length ? (
    <ul className='ml-6 mb-2'>
      {theseRels.map((rel) => (
        <TreeRelationship key={rel.id} relationship={rel} />
      ))}
    </ul>
  ) : null;

  const thesePredicates = predicates.filter((p) => p.alias === node.id).map((p) => p.name);
  const theseOutputs = output
    .filter((p) => p.alias === node.id)
    .map((p) => (p.aggregate ? `${p.aggregate}(${p.name})` : p.name));

  return (
    <li key={node.id} className='mb-4'>
      <button
        onClick={() => handleNodeClick(node.id)}
        className='bg-gray-300 text-gray-700 rounded-full px-4 py-2 mb-2 font-bold focus:outline-none'
      >
        {node.id}:<span className='bg-gray-100 text-gray-500 px-2 py-1 inline-block ml-1'>{node.label}</span>
        {thesePredicates.length ? (
          <span className='inline-block ml-2'>
            {'{'}
            {thesePredicates.join(', ')}
            {'}'}
          </span>
        ) : (
          ''
        )}
        {theseOutputs.length ? (
          <span className='inline-block ml-2 text-gray-500'>
            :: {'{'}
            {theseOutputs.join(', ')}
            {'}'}
          </span>
        ) : (
          ''
        )}
      </button>

      {relationshipList}
    </li>
  );
}

function Query({ query }) {
  const { cypher, params } = queryToCypher(query);

  const paramStatements = Object.entries(params).map(([key, value]) => (
    <pre key={key}>
      :param {key}: {value}
    </pre>
  ));

  return (
    <div className='flex-grow p-2 mt-4 leading-8 bg-blue-100 text-blue-800 w-full'>
      {paramStatements}

      <pre className='pt-2 mt-4 border-t border-gray-300'>{cypher}</pre>
    </div>
  );
}

const Graph = ({ currentQuery }) => {
  const {nodes} = currentQuery;

  // TODO: make force graph again...
  return (
    <div className='flex flex-col w-full h-full'>
      <div className='w-full flex-grow overflow-auto'>
        <ul className='p-2'>
          {nodes?.map((node) => (
            <TreeNode key={node.id} node={node} query={currentQuery} />
          ))}
        </ul>
      </div>
      <Query query={currentQuery} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentQuery: getCurrentQuery(state),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Graph);
