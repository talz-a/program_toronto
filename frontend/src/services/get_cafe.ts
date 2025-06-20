// services/get_green_streets_data.ts

const greenStreetsPackageId = "green-streets";

const fetchJSON = async (url: string): Promise<any> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch error ${res.status}: ${res.statusText}`);
  }
  return res.json();
};

const getGreenStreetsPackage = async () => {
  const url = `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=${greenStreetsPackageId}`;
  const response = await fetchJSON(url);
  return response.result;
};

const getDatastoreResource = async (resource: any): Promise<any> => {
  const url = `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?id=${resource.id}`;
  const response = await fetchJSON(url);
  return response.result.records;
};

// Update this type based on the actual fields in green-streets data
export type GreenStreetAsset = {
  _id: number;
  STREET_NAME?: string;
  STATUS?: string;
  // ...add any other fields from the dataset as needed
  geometry?: string;
};

export const getGreenStreetsData = async (): Promise<Array<GreenStreetAsset>> => {
  const pkg = await getGreenStreetsPackage();
  const datastoreResources = pkg.resources.filter((r: any) => r.datastore_active);
  const allGreenStreetsData = [];
  for (const r of datastoreResources) {
    const data = await getDatastoreResource(r);
    allGreenStreetsData.push(...data); // flatten
  }
  return allGreenStreetsData as Array<GreenStreetAsset>;
};

