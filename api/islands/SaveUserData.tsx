import * as Hooks from "preact/hooks";
import { Button } from "../components/Button.tsx";

export default function SaveUserData({ jwt, user }) {
  Hooks.useLayoutEffect(() => {
    window.localStorage.setItem("jwt", jwt);
    window.localStorage.setItem("user", JSON.stringify(user));
    window.location = "/";
  }, []);
  return <div> Redirecting to home... </div>;
}
