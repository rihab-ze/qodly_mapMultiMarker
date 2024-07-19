import { useEnhancedNode } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { IMapProps } from './Map.config';

const Map: FC<IMapProps> = ({ popup, zoom, mapDragging, style, className, classNames = [] }) => {
  const {
    connectors: { connect },
  } = useEnhancedNode();
  const mapRef = useRef<HTMLDivElement>(null);
  var defaultIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/rihab-ze/qodly_map/develop/public/marker-icon.png',
    iconSize: [26, 42],
    iconAnchor: [13, 43],
    popupAnchor: [0, -36],
  });
  useEffect(() => {
    let map: L.Map | null = null;
    if (mapRef.current) {
      map = L.map(mapRef.current, { dragging: mapDragging }).setView([51.505, -0.09], zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);
      var markers = L.markerClusterGroup();
      markers.addLayer(L.marker([51.505, -0.09], { icon: defaultIcon }));
      markers.addLayer(L.marker([51.505, -0.13], { icon: defaultIcon }));
      markers.addLayer(L.marker([51.505, -0.2], { icon: defaultIcon }));
      map.addLayer(markers);
    }

    // cleanUP
    return () => {
      if (map) map.remove();
    };
  }, [zoom, popup, mapDragging, style]);

  return (
    <span ref={connect} style={style} className={cn(className, classNames)}>
      <div ref={mapRef} style={style}>
        {' '}
      </div>
    </span>
  );
};

export default Map;
