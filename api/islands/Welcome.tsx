import * as Hooks from "preact/hooks";
import { Button } from "../components/Button.tsx";

export default function Welcome({ jwt, user }) {
  const toot = async (status, visibility) => {
    let resp = await fetch("/api/toot", {
      method: "POST",
      headers: {
        "Authentication": `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        jwt,
        status,
        visibility, 
      })
    });
    let json = await resp.json();
    console.log(json)
  }
  return (
    <div>
      Welcome <span>{user.displayName}</span>!
      <Button onClick={() => toot("hello world", "public")}> Say Hello! </Button>
    </div>
  );
}
