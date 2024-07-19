import { EComponentKind, T4DComponentConfig } from '@ws-ui/webform-editor';
import { Settings } from '@ws-ui/webform-editor';
import { MdOutlineTextSnippet } from 'react-icons/md';

import MapSettings, { BasicSettings } from './Map.settings';

export default {
  craft: {
    displayName: 'Map',
    kind: EComponentKind.BASIC,
    props: {
      name: '',
      classNames: [],
      events: [],
    },
    related: {
      settings: Settings(MapSettings, BasicSettings),
    },
  },
  info: {
    displayName: 'Map',
    exposed: true,
    icon: MdOutlineTextSnippet,
    events: [
      {
        label: 'On Click',
        value: 'onclick',
      },
      {
        label: 'On Blur',
        value: 'onblur',
      },
      {
        label: 'On Focus',
        value: 'onfocus',
      },
      {
        label: 'On MouseEnter',
        value: 'onmouseenter',
      },
      {
        label: 'On MouseLeave',
        value: 'onmouseleave',
      },
      {
        label: 'On KeyDown',
        value: 'onkeydown',
      },
      {
        label: 'On KeyUp',
        value: 'onkeyup',
      },
    ],
    datasources: {
      accept: ['string'],
    },
  },
  defaultProps: {
    style: { height: '400px', width: '400px' },
    zoom: 10,
    animation: true,
    popup: false,
    mapDragging: true,
    distance: 100,
  },
} as T4DComponentConfig<IMapProps>;

export interface IMapProps extends webforms.ComponentProps {
  zoom: number;
  animation: boolean;
  popup: boolean;
  mapDragging: boolean;
  long: string;
  lat: string;
  tooltip: string;
  distance: number;
}
