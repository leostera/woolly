import { Head } from "$fresh/runtime.ts";
import Footer from "../components/Footer.tsx";
import Home from "../islands/Home.tsx";

export default function HomeRoute() {
  return (
    <>
      <Head>
        <title>Woolly</title>
        <script
          defer
          data-domain="woolly.deno.dev"
          src="https://plausible.io/js/script.outbound-links.js"
        >
        </script>
        <link rel="stylesheet" href="/editor.css" />
      </Head>
      <div class="flex flex-col min-h-screen">
        <StatusBar />
        <div class="flex-1">
          <Home />
        </div>
        <Footer />
      </div>
    </>
  );
}

function StatusBar() {
  return (
    <span class="bg-blue-400 text-black border(b blue-500) p-3 text-center group">
      <a href="https://mas.to/tags/woolly" target="_blank">
        <b>#Woolly</b>
      </a>{" "}
      is super duper beta, so if it crashes please let{" "}
      <a href="https://mas.to/@leostera" target="_blank">
        <b>@leostera</b>
      </a>{" "}
      know.
    </span>
  );
}
