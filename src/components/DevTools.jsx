import React from 'react';
import JsonFormatter from './devtools/JsonFormatter';
import JsonDiff from './devtools/JsonDiff';
import RestClient from './devtools/RestClient';

const DevTools = ({ type, content, onChange }) => {
  const data = typeof content === 'object' && content !== null ? content : {
    input1: '',
    input2: '',
    url: '',
    method: 'GET',
    output: '',
  };

  switch (type) {
    case 'json-formatter':
      return <JsonFormatter content={data} onChange={onChange} />;
    case 'json-diff':
      return <JsonDiff content={data} onChange={onChange} />;
    case 'rest-client':
      return <RestClient content={data} onChange={onChange} />;
    default:
      return null;
  }
};

export default DevTools;