import Atlas from "../components/Atlas";
import data from "../../data/agents.json";

export default function Home() {
  return <Atlas data={data} />;
}
