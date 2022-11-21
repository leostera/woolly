import { Head } from "$fresh/runtime.ts";
import Index from "../islands/Index.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Woolly</title>
      </Head>
      <div>
        <Index />
      </div>
    </>
  );
}
