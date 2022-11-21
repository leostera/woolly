import * as Hooks from "preact/hooks";
import { Button } from "../components/Button.tsx";

export default function SaveUserData({ jwt = false, user }) {
  if (jwt) {
    window.localStorage.setItem("jwt", jwt);
    window.localStorage.setItem("user", JSON.stringify(user));
    window.location = "/";
  }
}
