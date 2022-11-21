import * as Hooks from "preact/hooks";
import { Button } from "../components/Button.tsx";

export default function Welcome({ jwt, user }) {
  console.log(jwt, user)
  return (
    <div>
      Welcome <span>{user.displayName}</span>!
      <Button onClick={() => console.log("hello")}> Say Hello! </Button>
    </div>
  );
}
