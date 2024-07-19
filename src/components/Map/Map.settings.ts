import { ESetting, TSetting } from '@ws-ui/webform-editor';
import { BASIC_SETTINGS, DEFAULT_SETTINGS, load } from '@ws-ui/webform-editor';

const commonSettings: TSetting[] = [
  {
    key: 'zoom',
    label: 'Zoom',
    type: ESetting.NUMBER_FIELD,
    defaultValue: 10,
  },
  {
    key: 'mapDragging',
    label: 'Map dragging',
    type: ESetting.CHECKBOX,
    defaultValue: true,
  },
  {
    key: 'animation',
    label: 'Animation',
    type: ESetting.CHECKBOX,
    defaultValue: true,
  },
  {
    key: 'popup',
    label: 'Popup',
    type: ESetting.CHECKBOX,
    defaultValue: false,
  },
  {
    key: 'distance',
    label: 'Marker group distance (Km)',
    type: ESetting.NUMBER_FIELD,
    defaultValue: 100,
  },
  {
    key: 'long',
    label: 'Longitude',
    type: ESetting.TEXT_FIELD,
  },
  {
    key: 'lat',
    label: 'Latitude',
    type: ESetting.TEXT_FIELD,
  },
  {
    key: 'tooltip',
    label: 'Tooltip',
    type: ESetting.TEXT_FIELD,
  },
];

const dataAccessSettings: TSetting[] = [
  {
    key: 'datasource',
    label: 'Data Source',
    type: ESetting.DS_AUTO_SUGGEST,
  },
  {
    key: 'currentElement',
    label: 'currentPosition',
    type: ESetting.DS_AUTO_SUGGEST,
  },
  {
    key: 'serverSideRef',
    label: 'Server Side',
    type: ESetting.TEXT_FIELD,
    validateOnEnter: true,
  },
];

const Settings: TSetting[] = [
  {
    key: 'properties',
    label: 'Properties',
    type: ESetting.GROUP,
    components: commonSettings,
  },
  {
    key: 'dataAccess',
    label: 'Data Access',
    type: ESetting.GROUP,
    components: dataAccessSettings,
  },
  ...load(DEFAULT_SETTINGS).filter('style.overflow', 'font', 'background', 'dataAccess'),
];

export const BasicSettings: TSetting[] = [
  ...commonSettings,
  ...load(BASIC_SETTINGS).filter(
    'style.overflow',
    'style.fontFamily',
    'style.fontWeight',
    'style.fontSize',
    'style.textAlign',
    'style.textTransform',
    'background',
  ),
];

export default Settings;
