import React from 'react';
import { SELECTION_TYPES } from '../../config/CardConfig';
import NeoForm from './chart/NeoForm';
import NeoFormCardSettings from './chart/NeoFormCardSettings';

export const FORMS = {
  forms: {
    label: 'Form',
    component: NeoForm,
    settingsComponent: NeoFormCardSettings,
    textOnly: true, // this makes sure that no query is executed, input of the report gets passed directly to the renderer.
    helperText: (
      <div>
        A form lets users specify multiple parameters, which can then be used to run a custom Cypher query on demand.
      </div>
    ),
    maxRecords: 1,
    settings: {
      runButtonText: {
        label: 'Form Button Text',
        type: SELECTION_TYPES.TEXT,
        default: 'Send',
      },
      description: {
        label: 'Report Description',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Enter markdown here...',
      },
    },
  },
};
