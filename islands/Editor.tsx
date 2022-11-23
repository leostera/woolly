import * as Hooks from "preact/hooks";
import Button from "../components/Button.tsx";

const toot = async (jwt, { status, visibility, in_reply_to_id }) => {
  const resp = await fetch("/api/toot", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      status,
      visibility,
      in_reply_to_id,
    }),
  });
  const json = await resp.json();
  return json;
};

export default function Editor({ jwt, user, defaultToots = [] }) {
  const inputRef = Hooks.useRef(null);
  const [error, setError] = Hooks.useState(false);

  const [toots, setToots] = Hooks.useState(defaultToots);
  const [action, setAction] = Hooks.useState("wait");
  const [replyId, setReplyId] = Hooks.useState(null);
  const [visibility, setVisibility] = Hooks.useState("public");
  const [status, setStatus] = Hooks.useState("");

  const updateStatus = Hooks.useCallback((e) => {
    if (e.key === "Enter" && e.shiftKey && status !== "") {
      e.preventDefault();
      setAction("send");
    } else {
      setStatus(e.target.value.trim());
    }
  }, [status]);

  Hooks.useEffect(() => {
    if (action === "new") {
      setToots([]);
      setVisibility("public");
      setReplyId(null);
      setStatus("");
      setAction("ready");
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }, [action]);

  Hooks.useEffect(() => {
    if (action == "send") {
      setError(false);
      setAction("wait");
      // NOTE(@ostera): cheap way of mocking the responses:
      Promise.resolve({ id: 1, content: status, spoiler_text })
        // Promise.reject("something went wrong!")
        // toot(jwt, { status, visibility: "direct", in_reply_to_id: replyId })
        // toot(jwt, { status, visibility, in_reply_to_id: replyId })
        .then((toot) => {
          if (toot.id) {
            setToots((old) => [...old, toot]);
            setVisibility("unlisted");
            setReplyId(toot.id);
            setStatus("");
            setAction("ready");
            inputRef.current.value = "";
            inputRef.current.focus();
          }
        })
        .catch((error) => {
          setError(error);
          setAction("ready");
        });
    }
  }, [action]);

  Hooks.useEffect(() => {
    if (action === "wait" && status.length > 0 && status.length < 500) {
      setAction("ready");
    }
  }, [status]);

  Hooks.useEffect(() => {
    if (action === "ready" && status.length === 0) {
      setAction("wait");
    }
    if (action === "ready" && status.length > 500) {
      setAction("wait");
    }
  }, [status]);

  Hooks.useEffect(() => {
    const tId = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
    return () => clearTimeout(tId);
  }, [inputRef]);

  return (
    <div class="flex flex-col max-w-3xl justify-center align-center p-3 mx-auto font">
      <div class="flex flex-row justify-between align-center items-center py-4">
        <Welcome user={user} />
        <Button
          class={`
            h-10
            px-4
            rounded
            font-bold
            border(2 solid blue-500)
            text-sm
            text-blue-500
            hover:text-white
            hover:bg-blue-500
          `}
          onClick={() => setAction("new")}
        >
          New Thread 📝
        </Button>
      </div>

      <div
        class={`
            toot
            text-xl
            leading-8
            font-serif
            `}
      >
        {toots.map((toot, idx) => {
          return (
            <div
              class={`
                w-full
                max-h-screen
                py-2
                px-4
                rounded
                flex
                flex-col
            `}
            >
              <div
                class={`pt-3 flex flex-row justify-end text-xl text-gray-400`}
              >
                <a href={toot.url} target="_blank">
                  #{idx + 1}
                </a>
              </div>
              <div dangerouslySetInnerHTML={{ __html: toot.content }} />
            </div>
          );
        })}

        <textarea
          tabIndex={1}
          ref={inputRef}
          class={`
            w-full
            max-h-screen
            p-4
            my-2
            outline-none
          `}
          onInput={(e) => updateStatus(e)}
          onKeyDown={(e) => updateStatus(e)}
          rows={10}
          placeholder="What's on your mind?"
        >
        </textarea>
      </div>

      {error
        ? (
          <div
            class={`w-full rounded p-5 my-2 border(1 solid red-300) text-red-700 bg-red-200`}
          >
            <div class={`float-right`}>
              <button
                class=""
                onClick={(_e) => setError(false)}
              >
                ✕
              </button>
            </div>
            <div class="my-1">
              <b>Something went wrong:</b> <span>{error}</span>
            </div>
            <div>
              Try again in a few seconds. If the problem persists, reach out to
              {" "}
              <a class="my-2" href="https://mas.to/@leostera" target="_blank">
                <b>@leostera</b>
              </a>{" "}
              on Mastodon for help or file an issue in Woolly's{" "}
              <a href="https://github.com/ostera/woolly/issues">
                <b>Issue Tracker</b>
              </a>
            </div>
          </div>
        )
        : null}

      <div class="flex flex-row justify-end align-center items-center">
        <Button
          class={`
            h-10
            py-2
            px-4
            rounded
            text-sm
            font-bold
            border(2 solid ${action === "ready" ? "blue-500" : "gray-900"})
            ${action === "ready" ? "text-blue-500" : "text-gray-900"}
            ${action === "ready" ? "opacity-100" : "opacity-30"}
            ${action === "ready" ? "hover:text-white hover:bg-blue-500" : ""}
          `}
          disabled={action === "wait"}
          onClick={() => setAction("send")}
        >
          Toot 📬
        </Button>
      </div>
    </div>
  );
}

function Welcome({ user }) {
  return (
    <div class="flex flex-row justify-start align-center items-center">
      <picture class="px-2">
        <img
          src={user.avatar}
          class="w-12 max-w-12 mx-auto rounded-full"
          alt={`your avatar, ${user.displayName}`}
        />
      </picture>
      <span>
        Welcome,
        <b class="mx-1">{user.displayName} 👋</b>
      </span>
    </div>
  );
}
