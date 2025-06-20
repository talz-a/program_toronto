const wifiPackageId = "city-of-toronto-free-public-wifi";

const fetchJSON = async (url: string): Promise<any> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch error ${res.status}: ${res.statusText}`);
  }
  return res.json();
};

const getWifiPackage = async () => {
  const url = `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=${wifiPackageId}`;
  const response = await fetchJSON(url);
  return response.result;
};

const getDatastoreResource = async (resource: any): Promise<any> => {
  const url = `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?id=${resource.id}`;
  const response = await fetchJSON(url);
  return response.result.records;
};

export type WifiAsset = {
  _id: number;
  NAME: string;
  ADDRESS: string;
  LATITUDE: string;
  LONGITUDE: string;
  PROVIDER: string;
  LOCATION_TYPE: string;
  geometry?: string;
  // Add or modify fields as needed based on actual dataset structure
};

export const getWifiData = async (): Promise<Array<WifiAsset>> => {
  const pkg = await getWifiPackage();
  const datastoreResources = pkg.resources.filter((r: any) => r.datastore_active);
  const allWifiData = [];
  for (const r of datastoreResources) {
    const data = await getDatastoreResource(r);
    allWifiData.push(...data); // spread to flatten
  }
  return allWifiData as Array<WifiAsset>;
;
