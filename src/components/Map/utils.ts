type LoactionAndPopup = {
  longitude: number;
  latitude: number;
  popupMessage?: HTMLElement | null;
};

export function getNearbyCoordinates(
  coordinates: LoactionAndPopup[],
  distanceThreshold: number,
): LoactionAndPopup[][] {
  const result: LoactionAndPopup[][] = [];

  function calculateDistance(coord1: LoactionAndPopup, coord2: LoactionAndPopup): number {
    const R = 6371; // Radius of the Earth in kilometers
    const lat1 = (coord1.latitude * Math.PI) / 180;
    const lat2 = (coord2.latitude * Math.PI) / 180;
    const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    return distance;
  }

  // Function to find or create a group for a coordinate
  function findOrCreateGroup(coord: LoactionAndPopup): LoactionAndPopup[] {
    for (const group of result) {
      for (const existingCoord of group) {
        if (calculateDistance(existingCoord, coord) <= distanceThreshold) {
          group.push(coord);
          return group;
        }
      }
    }
    const newGroup: LoactionAndPopup[] = [coord];
    result.push(newGroup);
    return newGroup;
  }

  // Group nearby coordinates
  coordinates.forEach((coord) => {
    findOrCreateGroup(coord);
  });

  return result;
}

export function getValueByPath(obj: any, path: string) {
  if (path) {
    let keys = path.split('.');
    function traverse(obj: any, keys: any) {
      if (keys.length === 0) {
        return obj;
      }
      if (obj && typeof obj === 'object') {
        let key = keys.shift();
        return traverse(obj[key], keys);
      } else {
        return undefined;
      }
    }
    return traverse(obj, keys);
  }
}

export const getLocationIndex = (
  lat: number,
  lon: number,
  locationArray: LoactionAndPopup[],
): number => {
  return locationArray.findIndex(
    (location) => +location.longitude === lon && +location.latitude === lat,
  );
};
