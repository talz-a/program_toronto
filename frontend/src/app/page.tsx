import { getParkData } from "../services/get_park_data";

export default async function Home() {
  const data = await getParkData();
  data.forEach((d) => {
    console.log(d);
  });
  return (
    <>
      <div>Hello</div>
      {data.map((d, i) => (
        <div key={i}>
          {/* {JSON.stringify(d)} {/* show the raw object */} */
          <br />
          {d.ASSET_NAME || "Unnamed Park"}
        </div>
      ))}
    </>
  );
}
