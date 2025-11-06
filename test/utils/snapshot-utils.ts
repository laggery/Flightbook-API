export function removeIds(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeIds);
  } else if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key !== 'id' && key !== 'gliderId' && key !== 'startId' && key !== 'landingId') {
        result[key] = removeIds(value);
      }
    }
    return result;
  }
  return obj;
}