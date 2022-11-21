import { Head } from "$fresh/runtime.ts";
import Login from "../islands/Login.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <div>
        <Login />
      </div>
    </>
  );
}
