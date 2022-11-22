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

export default function Editor({ jwt, user }) {
  const inputRef = Hooks.useRef(null);
  const [toots, setToots] = Hooks.useState([
    {
      id: 1,
      content: "hello world! this is a fake toot",
      created_at: "Tue Nov 22 08:21:23 CET 2022",
    },
    {
      id: 1,
      content: `
<p>My apologies :) the mode needed to be <a href="https://mas.to/tags/direct" class="mention hashtag" rel="tag">#<span>direct</span></a>, not <a href="https://mas.to/tags/private" class="mention hashtag" rel="tag">#<span>private</span></a>.</p>
      `,
      created_at: "Tue Nov 22 08:21:23 CET 2022",
    },
  ]);
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

  Hooks.useEffect(async () => {
    if (action == "send") {
      setAction("wait");
      // NOTE(@ostera): cheap way of mocking the responses:
      // Promise.resolve({ id: 1, content: status })
        toot(jwt, {status, visibility: "direct", in_reply_to_id: replyId})
        // toot(jwt, { status, visibility, in_reply_to_id: replyId })
        .then((toot) => {
          setToots((old) => [...old, toot]);
          setVisibility("unlisted");
          setReplyId(toot.id);
          setStatus("");
          setAction("ready");
          inputRef.current.value = "";
          inputRef.current.focus();
        });
    }
  }, [action]);

  Hooks.useEffect(() => {
    if (action === "wait" && status.length > 0) {
      setAction("ready");
    }
  }, [status]);

  Hooks.useEffect(() => {
    if (action === "ready" && status.length === 0) {
      setAction("wait");
    }
  }, [status]);

  Hooks.useEffect(() => {
    const tId = setTimeout(() => {
      if (inputRef.current) {
        console.log(inputRef.current);
        inputRef.current.focus();
      }
    }, 0);
    return () => clearTimeout(tId);
  }, [inputRef]);

  return (
    <div class="flex flex-col max-w-full w-1/2 justify-center align-center p-3 mx-auto">
      <div class="flex flex-row justify-between py-4">
        <Welcome user={user} />
        <Button
          class={`
            py-2
            px-5
            rounded
            font-bold
            border(2 solid blue-500)
            text-blue-500
          `}
          onClick={() => setAction("new")}
        >
          New Thread 📝
        </Button>
      </div>

      {toots.map((toot, idx) => {
        console.log(toot);
        return (
          <div
            class={`
                w-full
                max-h-screen
                p-4
                my-2
                rounded
                border(1 solid gray-500)
                flex
                flex-col
            `}
          >
            <div dangerouslySetInnerHTML={{ __html: toot.content }} />
            <div class={`pt-3 flex flex-row justify-end text-gray-500`}>
              <a href={toot.url} target="_blank">
                #{idx + 1}
              </a>
            </div>
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
            rounded
            border(1 solid gray-500)
          `}
        onInput={(e) => updateStatus(e)}
        onKeyDown={(e) => updateStatus(e)}
        rows={10}
        placeholder="what's on your mind?"
      >
      </textarea>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        <Button
          class={`
            py-2
            px-5
            rounded
            font-bold
            border(2 solid ${action === "ready" ? "blue-500" : "gray-900"})
            ${action === "ready" ? "text-blue-500" : "text-gray-900"}
            ${action === "ready" ? "opacity-100" : "opacity-30"}
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
