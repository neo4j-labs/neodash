import { AggregationFunction } from '@neode/querybuilder';
import React, { useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { aggregateFunctions, Condition, conditions } from '../constants';
import {
  addPredicate,
  addRelationship,
  addReturn,
  removeNode,
  removePredicate,
  removeRelationship,
  removeReturn,
} from '../state/QueryBuilderActions';
import Tab from '../tab';
import { getCurrentQuery } from '../state/QueryBuilderSelectors';

function ToolbarHeader({ text }) {
  return (
    <div className='toolbar-header bg-white p-4 font-bold text-gray-700 text-lg border-b border-gray-400'>{text}</div>
  );
}

// function ToolbarSubheader({ text }) {
//     return <div className="toolbar-subheader bg-white p-4 font-bold text-gray-600 border-b border-gray-200 mb-4">{text}</div>
// }

function ToolbarRelationship(props) {
  const dispatch = useDispatch();
  const handleRelationshipClick = () => dispatch(addRelationship(props));

  const text = `(${props.from})${props.direction === 'in' ? '<' : ''}-[:${props.type}]-${
    props.direction === 'out' ? '>' : ''
  }(:${props.label})`;

  return (
    <button
      onClick={handleRelationshipClick}
      className='text-left w-full bg-gray-100 text-gray-700 rounded-md px-2 py-2 mb-2 font-bold'
    >
      <span className='inline-block px-2 text-xs rounded-md bg-green-300 text-green-800 mr-2'>+</span>
      {text}
    </button>
  );
}

function ExistingPredicate(props) {
  const dispatch = useDispatch();
  const { id, name, condition, negative, value } = props;

  const handleRemoveClick = () => {
    dispatch(removePredicate(id));
  };

  return (
    <div className='flex flex-row justify-between p-2 mb-2 border-b border-gray-300'>
      <div className='flex flex-grow-1'>{name}</div>
      <div className='flex flex-grow-1'>
        {negative ? 'NOT' : 'IS'} {condition}
      </div>
      <pre className='flex flex-grow-1'>{value}</pre>
      <button
        className='p-2 rounded-sm border border-red-600 text-red-600 font-bold leading-none'
        onClick={handleRemoveClick}
      >
        x
      </button>
    </div>
  );
}

function Predicates({ id, query }) {
  const {predicates} = query;

  const thesePredicates = predicates
    .filter((p) => p.alias === id)
    .map((row) => (
      <ExistingPredicate
        key={[row.id, row.name, row.negative ? 'NOT' : 'IS', row.condition, row.value].join('||')}
        {...row}
      />
    ));

  if (!thesePredicates.length) {
    return null;
  }

  return <div className='p-4 flex flex-col'>{thesePredicates}</div>;
}

function AddPredicateForm({ id, properties }) {
  const dispatch = useDispatch();

  const [name, setName] = useState<string>();
  const [value, setValue] = useState<string>('');
  const [negative, setNegative] = useState<boolean>(false);
  const [condition, setCondition] = useState<Condition>(conditions[0]);

  const handleAddPredicate = () => {
    if (name && value !== '') {
      const thisProperty = properties[name];

      dispatch(addPredicate({ alias: id, name, condition, negative, type: thisProperty.type, value }));

      setValue('');
      setCondition(conditions[0]);
    }
  };

  return (
    <div className='p-4 flex flex-col'>
      <select
        className='p-2 rounded-md border border-gray-400 mb-2'
        value={name}
        onChange={(e) => setName(e.target.value)}
      >
        <option></option>
        {Object.keys(properties).map((key) => (
          <option key={key} value={key}>
            {key} ({properties[key].type})
          </option>
        ))}
      </select>
      <div>
        <input id='negative' type='checkbox' checked={negative} onChange={(e) => setNegative(e.target.checked)} />
        <label className='ml-2 inline-block font-bold text-xs mb-2 leading-none' htmlFor='negative'>
          NOT
        </label>
      </div>
      <select
        className='p-2 rounded-md border border-gray-400 mb-2'
        value={condition}
        onChange={(e) => setCondition(e.target.value as Condition)}
      >
        <option></option>
        {conditions.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <input
        className='p-2 rounded-md border border-gray-400 mb-2'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className='px-4 py-2 rounded-md border font-bold border-blue-600 text-blue-600'
        onClick={handleAddPredicate}
      >
        Add Predicate
      </button>
    </div>
  );
}

function ReturnFields({ id }) {
  const dispatch = useDispatch();

  const output = useSelector((state: RootState) => state.currentQuery.output);
  const handleRemoveClick = (id: string) => dispatch(removeReturn(id));

  const theseFields = output
    .filter((p) => p.alias === id)
    .map((row) => (
      <div className='flex justify-between' key={row.id}>
        <div>
          {row.aggregate && <span className='text-blue-700'>{row.aggregate}(</span>}
          <span className='font-bold'>{row.name}</span>
          {row.aggregate && <span className='text-blue-600'>)</span>}
          {row.as && <span className='text-green-600'> AS {row.as}</span>}
        </div>
        <button
          className='p-2 rounded-sm border border-red-600 text-red-600 font-bold leading-none'
          onClick={() => handleRemoveClick(row.id)}
        >
          x
        </button>
      </div>
    ));

  if (!theseFields.length) {
    return null;
  }

  return <div className='p-4 flex flex-col'>{theseFields}</div>;
}

function AddReturnForm({ id, properties }) {
  const dispatch = useDispatch();

  const [name, setName] = useState<string>(Object.keys(properties)[0]);
  const [aggregate, setAggregate] = useState<AggregationFunction | ''>('');
  const [as, setAs] = useState<string>('');

  const handleAddReturn = () => {
    if (name) {
      dispatch(addReturn({ alias: id, name, as, aggregate: aggregate !== '' ? aggregate : undefined }));

      setAs('');
      setAggregate('');
    }
  };

  return (
    <div className='p-4 flex flex-col'>
      <select
        className='p-2 rounded-md border border-gray-400 mb-2'
        value={name}
        onChange={(e) => setName(e.target.value)}
      >
        {Object.keys(properties).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <input
        className='p-2 rounded-md border border-gray-400 mb-2'
        value={as}
        onChange={(e) => setAs(e.target.value)}
        placeholder='Alias Field?'
      />
      <select
        className='p-2 rounded-md border border-gray-400 mb-2'
        value={aggregate}
        onChange={(e) => setAggregate(e.target.value as AggregationFunction)}
      >
        <option value=''>Aggregate?</option>
        {aggregateFunctions.map(({ key, value, text }) => (
          <option key={key} value={value}>
            {text}
          </option>
        ))}
      </select>
      <button className='px-4 py-2 rounded-md border font-bold border-blue-600 text-blue-600' onClick={handleAddReturn}>
        Add Return
      </button>
    </div>
  );
}

function ToolbarTabs({ tabs }) {
  return (
    <div className='flex flex-row px-2 pt-4 mb-2 border-b border-gray-300'>
      {tabs.map((tab, index) => (
        <Tab key={index} text={tab.text} active={tab.active} onClick={tab.onClick} />
      ))}
    </div>
  );
}

function NodeToolbar(props) {
  const dispatch = useDispatch();
  const {selected} = props.currentQuery;
  const {nodes} = props.currentQuery;
  const thisNode = nodes.find((node) => node.id === selected);
  const [tab, setTab] = useState<string>('relationships');

  const thisLabel = thisNode && props.labels.find((label) => label.label === thisNode!.label);

  if (!selected || !thisNode || !thisLabel) {
    return <div></div>;
  }

  const handleRemoveClick = () => dispatch(removeNode(thisNode!.id));

  const tabs = [
    { text: 'Relationships', active: tab === 'relationships', onClick: () => setTab('relationships') },
    { text: 'Where', active: tab === 'predicates', onClick: () => setTab('predicates') },
    { text: 'Return', active: tab === 'return', onClick: () => setTab('return') },
  ];

  let activeTab = <div></div>;

  if (tab === 'predicates') {
    activeTab = (
      <div className='toolbar-predicates'>
        {/* <ToolbarSubheader text="Predicates" /> */}
        <Predicates id={thisNode.id} query={props.currentQuery} />
        <AddPredicateForm id={thisNode.id} properties={thisLabel.properties} />
      </div>
    );
  } else if (tab === 'return') {
    activeTab = (
      <div className='toolbar-predicates'>
        {/* <ToolbarSubheader text="Return Fields" /> */}
        <ReturnFields id={thisNode.id} />
        <AddReturnForm id={thisNode.id} properties={thisLabel.properties} />
      </div>
    );
  } else if (tab === 'relationships') {
    const addRelationshipOptions = thisLabel.relationships
      .map((rel) =>
        rel.labels.map((label) => ({
          key: `${rel.type}||${rel.direction}||${label}`,
          label,
          ...rel,
        }))
      )
      .reduce((acc, next) => acc.concat(next), [])
      .map((rel) => <ToolbarRelationship key={rel.key} from={selected} {...rel} />);

    activeTab = (
      <div className='pt-2'>
        {/* <ToolbarSubheader text="Add Relationship" /> */}
        <div className='px-2'>{addRelationshipOptions}</div>
      </div>
    );
  }

  return (
    <div
      className='toolbar flex-grow flex-shrink-0 node-toolbar h-full flex flex-col bg-white border-l border-gray-300'
      style={{ width: '420px' }}
    >
      <ToolbarHeader text={`(${thisNode?.id}:${thisNode?.label})`} />

      <ToolbarTabs tabs={tabs} />

      <div className='toolbar-scrollable flex flex-col flex-shrink flex-grow overflow-auto'>{activeTab}</div>
      <ToolbarFooter handleRemoveClick={handleRemoveClick} removeText='Remove Node' />
    </div>
  );
}

function RelationshipToolbar(props) {
  const dispatch = useDispatch();

  const {selected} = props.currentQuery;
  const {nodes} = props.currentQuery;
  const {relationships} = props.currentQuery;
  const thisRelationship = relationships.find((r) => r.id === selected);
  const thisType = props.types.find((type) => type.type === thisRelationship?.type);
  const [tab, setTab] = useState<string>('predicates');

  const tabs = [
    { text: 'Predicates', active: tab === 'predicates', onClick: () => setTab('predicates') },
    { text: 'Return', active: tab === 'return', onClick: () => setTab('return') },
  ];

  if (!thisType) {
    return <div></div>;
  }

  const handleRemoveClick = () => dispatch(removeRelationship(thisRelationship!.id));

  const startNode = nodes.find((node) => node.id === thisRelationship?.from);
  const endNode = nodes.find((node) => node.id === thisRelationship?.to);

  const text = `(${startNode?.id}:${startNode?.label})${thisRelationship?.direction === 'in' ? '<' : ''}-[${
    thisRelationship?.id
  }:${thisRelationship?.type}]-${thisRelationship?.direction === 'out' ? '>' : ''}(${endNode?.id}:${endNode?.label})`;

  let activeTab = <div></div>;

  if (tab === 'predicates') {
    activeTab = Object.keys(thisType.properties).length ? (
      <div>
        {/* <ToolbarSubheader text="Predicates" /> */}
        <Predicates id={thisRelationship!.id} query={props.currentQuery} />
        <AddPredicateForm id={thisRelationship!.id} properties={thisType.properties} />
      </div>
    ) : (
      <div className='p-4'>There are no properties on this relationship</div>
    );
  } else if (tab === 'return') {
    activeTab = Object.keys(thisType.properties).length ? (
      <div>
        {/* <ToolbarSubheader text="Return Fields" /> */}
        <ReturnFields id={thisRelationship!.id} />
        <AddReturnForm id={thisRelationship!.id} properties={thisType.properties} />
      </div>
    ) : (
      <div className='p-4'>There are no properties to return this relationship</div>
    );
  }

  return (
    <div
      className='toolbar flex-grow flex-shrink-0 node-toolbar h-full flex flex-col bg-white border-l border-gray-300'
      style={{ width: '420px' }}
    >
      <ToolbarHeader text={text} />
      <ToolbarTabs tabs={tabs} />
      <div className='toolbar-scrollable flex flex-col flex-shrink flex-grow overflow-auto'>{activeTab}</div>
      <ToolbarFooter handleRemoveClick={handleRemoveClick} removeText='Remove Relationship' />
    </div>
  );
}

function ToolbarFooter({ handleRemoveClick, removeText }) {
  return (
    <div className='toolbar-footer p-4 border-t border-gray-400'>
      <button
        className='block w-full p-4 rounded-md border border-red-600 text-red-600 font-bold leading-none active:bg-red-100 focus:outline-none'
        onClick={handleRemoveClick}
      >
        {removeText}
      </button>
    </div>
  );
}

const Toolbar = (props) => {
  const selected = props.currentQuery?.selected || false;

  if (selected && selected.startsWith('n')) {
    return <NodeToolbar {...props} />;
  } else if (selected && selected.startsWith('r')) {
    return <RelationshipToolbar {...props} />;
  }

  return <div></div>;
};

const mapStateToProps = (state) => ({
  currentQuery: getCurrentQuery(state),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
