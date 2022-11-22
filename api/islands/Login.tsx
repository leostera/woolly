import { useEffect, useState } from "preact/hooks";

export default function Login() {
  const [loginId, setLoginId] = useState("");

  const [href, setHref] = useState("#");

  useEffect(() => {
    if (loginId !== "") setHref(`/login/${loginId}`);
  }, [loginId]);

  const [disabled, setDisabled] = useState(true);
  useEffect(() => setDisabled(href === "#"), [href]);

  return (
    <section class="max-w-screen-md mx-auto my-16 px(4 sm:6 md:8) space-y-12">
      <div class="md:flex items-center">
        <div class="flex-1 text-center">
          <input
            class="inline-flex items-center h-16 px-4 w-1/2 border(2 solid blue-400) border-l-0 border-t-0 border-r-0 outline-none text-black dark:text-white"
            onKeyDown={(e) => setLoginId(e.currentTarget.value)}
            placeholder="What is your mastodon handle?"
          >
          </input>
          <a
            disabled={disabled}
            href={href}
            class={`inline-flex items-center h-16 px-8 font-bold border(2 solid blue-400) border-l-0 border-t-0 border-r-0 ${
              disabled ? "text-gray-500" : "text-blue-500 hover:text-blue-300"
            }`}
          >
            Start Writing
          </a>
        </div>
      </div>
    </section>
  );
}
