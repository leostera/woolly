import { Head } from "$fresh/runtime.ts";
import Gibberish from "../islands/Gibberish.tsx";
import Footer from "../components/Footer.tsx";
import Login from "../islands/Login.tsx";

export default function Home() {
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
      </Head>
      <div class="flex flex-col min-h-screen">
        <StatusBar />
        <Hero />
        <div class="flex-1">
          <Intro />
          <Login />
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

function Hero() {
  return (
    <>
      <div class="flex justify-end items-center">
        <a
          href="https://github.com/ostera/woolly"
          class="inline-flex items-center h-10 px-4 m-4 text-black bg-transparent rounded hover:bg-white"
        >
        </a>
      </div>
      <section class="w-full flex justify-center items-center flex-col">
        <Gibberish />
      </section>
    </>
  );
}

function Intro() {
  return (
    <section class="max-w-screen-md mx-auto my-16 px(4 sm:6 md:8) space-y-12">
      <div class="md:flex items-center s:flex-reverse">
        <div class="flex-1 text-center md:text-left">
          <h2 class="py-2 text(5xl sm:5xl lg:5xl gray-900) sm-tracking-tight sm:leading-[1.1]! font-extrabold">
            The Mastodon client for <span class="text-blue-500">writing.</span>
          </h2>
          <p class="mt-4 text-gray-600">
            Built for writing delightful threads. No pesky notifications.
          </p>
        </div>
        <picture class="block w-60 mx-auto mt-4 md:mt-0">
          <img
            src="/handwriting.svg"
            class="w-40 max-w-40 mx-auto"
            width={800}
            height={678}
            alt="deno is drinking fresh lemon squash"
          />
        </picture>
      </div>
    </section>
  );
}
