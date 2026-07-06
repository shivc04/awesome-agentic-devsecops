import Atlas from "../components/Atlas";
import data from "../../data/agents.json";
import stars from "../../data/stars.json";

export default function Home() {
  return <Atlas data={data} stars={stars} />;
}
