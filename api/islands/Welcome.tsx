import * as Hooks from "preact/hooks";
import { Button } from "../components/Button.tsx";

export default function Welcome({ jwt, user }) {
  let [status, setStatus] = Hooks.useState(null);
  const toot = async (status, visibility) => {
    let resp = await fetch("/api/toot", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        status,
        visibility, 
      })
    });
    let json = await resp.json();
  }
  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
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
          <div>Welcome <span>{user.displayName}</span>!</div>
          <Button onClick={() => toot(status, "public")}> toot! </Button>
        </div>

        <textarea cols={100} rows={50} onChange={e => setStatus(e.target.value)} />

      </div>
    </div>
  );
}
