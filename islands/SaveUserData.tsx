import * as Hooks from "preact/hooks";

export default function SaveUserData({ jwt, user }) {
  Hooks.useLayoutEffect(() => {
    window.localStorage.setItem("jwt", jwt);
    window.localStorage.setItem("user", JSON.stringify(user));
    window.location = "/home";
  }, []);
  return <div>Redirecting to home...</div>;
}
