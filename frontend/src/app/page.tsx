import { getParkData } from "../services/get_park_data";

export default async function Home() {
  const dataArrays = await getParkData(); // array of arrays
  // flatten the array if you want all parks in a single array:
  const flatData = dataArrays.flat();

  return (
    <>
      <div>Hello</div>
      {flatData.map((d, i) => (
        <div key={i}>
          {d.ASSET_NAME || "Unnamed Park"}
        </div>
      ))}
    </>
  );
}
