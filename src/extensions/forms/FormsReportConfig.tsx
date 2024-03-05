import React from 'react';
import { SELECTION_TYPES } from '../../config/CardConfig';
import NeoForm from './chart/NeoForm';
import NeoFormCardSettings from './settings/NeoFormCardSettings';

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
      backgroundColor: {
        label: 'Background Color',
        type: SELECTION_TYPES.COLOR,
        default: '#fafafa',
      },
      runButtonText: {
        label: 'Form Button Text',
        type: SELECTION_TYPES.TEXT,
        default: 'Submit',
      },
      confirmationMessage: {
        label: 'Confirmation Message',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Form submitted.',
      },
      resetButtonText: {
        label: 'Reset Button Text',
        type: SELECTION_TYPES.TEXT,
        default: 'Reset Form',
      },
      hasSubmitButton: {
        label: 'Has Submit Button',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      clearParametersAfterSubmit: {
        label: 'Clear parameters after submit',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      hasResetButton: {
        label: 'Has Reset Button',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      hasSubmitMessage: {
        label: 'Has Submit Message',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      refreshButtonEnabled: {
        label: 'Refreshable',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      fullscreenEnabled: {
        label: 'Fullscreen enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      downloadImageEnabled: {
        label: 'Download Image enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      description: {
        label: 'Report Description',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Enter markdown here...',
      },
    },
  },
};
