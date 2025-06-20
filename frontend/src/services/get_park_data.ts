const packageId = "cbea3a67-9168-4c6d-8186-16ac1a795b5b";

const fetchJSON = async (url: string): Promise<any> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch error ${res.status}: ${res.statusText}`);
  }
  return res.json();
};

const getPackage = async () => {
  const url = `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=${packageId}`;
  const response = await fetchJSON(url);
  return response.result;
};

const getDatastoreResource = async (resource: any): Promise<any> => {
  const url = `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?id=${resource.id}`;
  const response = await fetchJSON(url);
  return response.result.records;
};

export const main = async () => {
  const pkg = await getPackage();
  const datastoreResources = pkg.resources.filter(
    (r: any) => r.datastore_active,
  );
  const allParkData = [];
  for (const r of datastoreResources) {
    const data = await getDatastoreResource(r);
    allParkData.push(data);
  }
  return allParkData;
};
