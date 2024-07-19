import { DataLoader, useRenderer, useSources } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { IMapProps } from './Map.config';
import { updateEntity } from './hooks/useDsChangeHandler';
import { getLocationIndex, getValueByPath, getNearbyCoordinates } from './utils';

type LoactionAndPopup = {
  longitude: number;
  latitude: number;
  popupMessage?: HTMLElement | null;
};

const Map: FC<IMapProps> = ({
  popup,
  zoom,
  animation,
  mapDragging,
  distance,
  long,
  lat,
  tooltip,
  style,
  className,
  classNames = [],
}) => {
  const { connect } = useRenderer();
  const [value, setValue] = useState<datasources.IEntity[]>(() => []);
  const [val, setVal] = useState<LoactionAndPopup[]>(() => []);
  const [size, setSize] = useState({ width: style?.width, height: style?.height });
  const ref = useRef<HTMLElement | null>(null);

  const {
    sources: { datasource: ds, currentElement: ce },
  } = useSources();

  const currentDsNewPosition = async () => {
    if (!ce) {
      return;
    }
    switch (ce.type) {
      case 'entity': {
        console.log('entitu');

        setVal(
          value.map((item) => ({
            longitude: item[long as keyof typeof item] as number,
            latitude: item[lat as keyof typeof item] as number,
            popupMessage: item[tooltip as keyof typeof item] as any,
          })),
        );
        break;
      }
      case 'scalar': {
        console.log('array');

        if (!ds || ds.dataType !== 'array') {
          return;
        }
        const v = await ds.getValue<LoactionAndPopup[]>();
        if (v) {
          setVal(
            v.map((value) => ({
              longitude: +getValueByPath(value, long),
              latitude: +getValueByPath(value, lat),
              popupMessage: getValueByPath(value, tooltip),
            })),
          );
        }
        break;
      }
    }
  };

  const loader = useMemo<DataLoader | null>(() => {
    if (!ds) {
      return null;
    }
    return DataLoader.create(ds, [
      lat as string,
      long as string,
      tooltip ? (tooltip as string) : '',
    ]);
  }, [lat, long, ds]);
  const updateFromLoader = useCallback(() => {
    if (!loader) {
      return;
    }
    setValue(loader.page);
  }, [loader]);
  useEffect(() => {
    if (!loader || !ds) {
      return;
    }
    loader.sourceHasChanged().then(() => updateFromLoader());
  }, [loader]);

  useEffect(() => {
    if (!loader || !ds) {
      return;
    }
    const dsListener = () => {
      loader.sourceHasChanged().then(() => {
        updateFromLoader();
        currentDsNewPosition();
      });
    };
    ds.addListener('changed', dsListener);
    return () => {
      ds.removeListener('changed', dsListener);
    };
  }, [ds]);

  useEffect(() => {
    const updatePosition = async () => {
      await currentDsNewPosition();
    };
    updatePosition();
  }, [ds, value]);

  // if (ds.type === 'scalar') {
  //   useEffect(() => {
  //     if (!ds) return;
  //     const listener = async (/* event */) => {
  //       const v = await ds.getValue<LoactionAndPopup[]>();
  //       if (v) {
  //         setVal(
  //           v.map((value) => ({
  //             longitude: +getValueByPath(value, long),
  //             latitude: +getValueByPath(value, lat),
  //             popupMessage: getValueByPath(value, tooltip),
  //           })),
  //         );
  //       }
  //     };
  //     listener();
  //     ds.addListener('changed', listener);
  //     return () => {
  //       ds.removeListener('changed', listener);
  //     };
  //   }, [ds]);
  // } else {
  //   const loader = useMemo<DataLoader | null>(() => {
  //     if (!ds) {
  //       return null;
  //     }
  //     return DataLoader.create(ds, [
  //       lat as string,
  //       long as string,
  //       tooltip ? (tooltip as string) : '',
  //     ]);
  //   }, [lat, long, ds]);
  //   const updateFromLoader = useCallback(() => {
  //     if (!loader) {
  //       return;
  //     }
  //     setValue(loader.page);
  //   }, [loader]);
  //   useEffect(() => {
  //     if (!loader || !ds) return;
  //     loader.sourceHasChanged().then(updateFromLoader);
  //   }, []);

  //   useEffect(() => {
  //     setVal(
  //       value.map((item) => ({
  //         longitude: item[long as keyof typeof item] as number,
  //         latitude: item[lat as keyof typeof item] as number,
  //         popupMessage: item[tooltip as keyof typeof item] as any,
  //       })),
  //     );
  //   }, [value, long, lat]);
  // }

  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  var defaultIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/rihab-ze/qodly_map/develop/public/marker-icon.png',
    iconSize: [26, 42],
    iconAnchor: [13, 43],
    popupAnchor: [0, -36],
  });
  useEffect(() => {
    if (mapRef.current) {
      map.current = L.map(mapRef.current, { dragging: mapDragging }).setView(
        [+val[0].latitude, +val[0].longitude],
        zoom,
        { animate: animation },
      );
      mapRef.current.addEventListener('mousedown', (event) => {
        event.stopPropagation();
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map.current);
      const markers: L.MarkerClusterGroup[] = [];
      const groups = getNearbyCoordinates(val, distance);
      for (let i = 0; i < groups.length; i++) {
        markers[i] = L.markerClusterGroup();
        for (let j = 0; j < groups[i].length; j++) {
          const marker = L.marker([+groups[i][j]?.latitude, +groups[i][j]?.longitude], {
            icon: defaultIcon,
          });
          marker.on('click', (event) => {
            const { lat, lng } = (event as L.LeafletMouseEvent).latlng;
            const index = getLocationIndex(lat, lng, val);
            handleSelectedElementChange({ index, forceUpdate: true });
          });
          if (groups[i][j].popupMessage && popup) {
            const popupMessage = groups[i][j].popupMessage as HTMLElement;
            marker.bindPopup(popupMessage);
          }
          markers[i].addLayer(marker);
        }
        map.current.addLayer(markers[i]);
      }
    }
    // cleanUP

    return () => {
      if (map) map.current?.remove();
    };
  }, [zoom, map, mapDragging, lat, long, val]);

  const handleSelectedElementChange = async ({
    index,
    fireEvent = true,
  }: {
    index: number;
    forceUpdate?: boolean;
    fireEvent?: boolean;
  }) => {
    if (!ds || !ce) {
      return;
    }

    switch (ce.type) {
      case 'entity': {
        await updateEntity({ index, datasource: ds, currentElement: ce, fireEvent });
        break;
      }
      case 'scalar': {
        if (ds.dataType !== 'array') {
          return;
        }
        const value = await ds.getValue();
        await ce.setValue(null, value[index]);
        break;
      }
    }
  };

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);
  return (
    <div
      ref={(R) => {
        connect(R);
        ref.current = R;
      }}
      style={style}
      className={cn(className, classNames)}
    >
      {isDataValid(val) ? (
        <div ref={mapRef} style={size} />
      ) : (
        <div
          className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow-md"
          role="alert"
        >
          <div className="flex items-center">
            <strong className="font-bold text-red-700">Error!</strong>
          </div>
          <span className="block sm:inline mt-1 ">
            Datasource does not match the expected format.
          </span>
        </div>
      )}
    </div>
  );
};

export default Map;

function isDataValid(arr: LoactionAndPopup[]): arr is LoactionAndPopup[] {
  return (
    arr.length > 1 && arr.every((obj) => typeof obj === 'object' && obj.longitude && obj.latitude)
  );
}
