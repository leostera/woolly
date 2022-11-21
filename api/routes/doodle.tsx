import { Head } from "$fresh/runtime.ts";
import Gibberish from "../islands/Gibberish.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Woolly</title>
      </Head>
      <div>
        <Gibberish />
      </div>
    </>
  );
}
