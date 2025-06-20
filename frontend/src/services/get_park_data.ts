import https from "https";

const packageId = "cbea3a67-9168-4c6d-8186-16ac1a795b5b";

const httpsGetJSON = (url: string): Promise<any> =>
  new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const dataChunks: any[] = [];
      response
        .on("data", (chunk: any) => dataChunks.push(chunk))
        .on("end", () => {
          try {
            const data = Buffer.concat(dataChunks).toString();
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        })
        .on("error", reject);
    });
  });

const getPackage = async (): Promise<any> => {
  const url = `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=${packageId}`;
  const response: any = await httpsGetJSON(url);
  return response.result;
};

const getDatastoreResource = async (resource: any): Promise<any> => {
  const url = `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?id=${resource.id}`;
  const response: any = await httpsGetJSON(url);
  return response.result.records;
};

export const main = async (): Promise<void> => {
  try {
    const pkg: any = await getPackage();
    const datastoreResources: any[] = pkg.resources.filter(
      (r: any) => r.datastore_active,
    );
    if (datastoreResources.length === 0) {
      console.log("No active datastore resources found.");
      return;
    }
    const resourceData: any = await getDatastoreResource(datastoreResources[0]);
    console.log(resourceData);
  } catch (error: any) {
    console.error("Error:", error);
  }
};
