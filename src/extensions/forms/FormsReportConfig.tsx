import React from 'react';
import { SELECTION_TYPES } from '../../config/CardConfig';
import NeoForm from './chart/NeoForm';
import NeoFormCardSettings from './chart/NeoFormCardSettings';

export const FORMS = {
  forms: {
    label: 'Form',
    component: NeoForm,
    settingsComponent: NeoFormCardSettings,
    helperText: (
      <div>
        A form lets users specify multiple parameters, which can then be used to run a custom Cypher query on demand.
      </div>
    ),
    maxRecords: 1,
    settings: {
      description: {
        label: 'Report Description',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Enter markdown here...',
      },
    },
  },
};
