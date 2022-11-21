import * as Hooks from "preact/hooks";
import { Button } from "../components/Button.tsx";


const toot = async (jwt, {status, visibility, in_reply_to_id}) => {
  let resp = await fetch("/api/toot", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      status,
      visibility, 
      in_reply_to_id,
    })
  });
  let json = await resp.json();
  return json;
}

export default function Welcome({ jwt, user }) {
  let inputRef = Hooks.useRef(null);
  let [toots, setToots] = Hooks.useState([]);
  let [action, setAction] = Hooks.useState("wait");
  let [replyId, setReplyId] = Hooks.useState(null);
  let [status, setStatus] = Hooks.useState("");

  let updateStatus = Hooks.useCallback((e) => {
    if (e.key === 'Enter' && e.shiftKey && status !== "") {
      e.preventDefault();
      setAction("send")
    } else {
      let newStatus =
          [...e.target.childNodes].map(n => {
            if (n.nodeType === 3) return n.textContent
            return n.innerText
          }).join("\n").trim();
      setStatus(newStatus);
    }
  }, [status]);

  Hooks.useEffect(async () => {
    if (action == "send") {
      setAction("wait");
      // NOTE(@ostera): cheap way of mocking the responses:
      // Promise.resolve({ id: 1, content: status })
      // toot(jwt, {status, visibility: "private", in_reply_to_id: replyId})
      toot(jwt, {status, visibility: "public", in_reply_to_id: replyId})
      .then(toot => {
        setToots(old => [...old, toot]);
        setReplyId(toot.id);
        setStatus("");
        setAction("idle");
        inputRef.current.innerText = "";
        inputRef.current.focus();
      });
    }
  }, [action]);

  Hooks.useEffect(() => {
    if (action == 'wait' && status.length > 0) {
      setAction("idle");
    }
  }, [status]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: "3rem",
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "top",
        alignItems: "top",
      }}>

        <div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>Welcome, <span style={{ fontWeight: "700" }}>{user.displayName}</span>!</div>
        </div>
        <hr />
        
        {toots.map( toot => {
          console.log(toot);
          return <div
            style={{
              width: "60vw",
              height: "100%",
              padding: "0.5rem 0",
              border: "0",
              outline: "0",
              fontFamily: "inherit",
              borderBottom: "1px solid #d7d7d7",
            }}
            dangerouslySetInnerHTML={{ __html: toot.content }}
          />;
        
        })}

        <div
          contenteditable
          ref={inputRef}
          style={{
            width: "60vw",
            height: "100%",
            padding: "1rem 0",
            border: "0",
            outline: "0",
            fontFamily: "inherit",
          }}
          onInput={e => updateStatus(e)}
          onKeyDown={e => updateStatus(e)}
        >
          what's on your mind?
        </div>
        <div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
          alignItems: "center",
        }}>
          <Button 
            style={{
              padding: "0.3rem 0.6rem",
              borderRadius: "3px",
              border: action === "wait" ? "1px solid #ababab" : "1px solid black",
              background: 0,
            }}
            disabled={action === "wait"}
            onClick={() => setAction("send")}
          >toot</Button>
        </div>

      </div>
    </div>
  );
}
