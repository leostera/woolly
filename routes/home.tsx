import { Head } from "$fresh/runtime.ts";
import Footer from "../components/Footer.tsx";
import Home from "../islands/Home.tsx";

const defaultToots = Deno.env.get("DENO_ENV") === "prod" ? [] : [
    {
      id: 1,
      content: `
The project is small, however the project is free and open. We haven’t established a formal set of project governance yet, however I am sure we will get there in time — especially as folks show interest in the work. For now the best way to get involved is to follow the project on GitHub and read the community docs.
`,
      created_at: "Tue Nov 22 08:21:23 CET 2022",
    },
    {
      id: 1,
      content: `
<p>My apologies :) the mode needed to be <a href="https://mas.to/tags/direct" class="mention hashtag" rel="tag">#<span>direct</span></a>, not <a href="https://mas.to/tags/private" class="mention hashtag" rel="tag">#<span>private</span></a>.</p>
      `,
      spoiler_text: `example`,
      created_at: "Tue Nov 22 08:21:23 CET 2022",
    },
  ];

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
          <Home defaultToots={defaultToots} />
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
