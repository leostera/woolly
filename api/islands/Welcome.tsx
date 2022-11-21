import * as Hooks from "preact/hooks";
import * as Components from "../components/Button.tsx";

export default function Welcome({ jwt, user }) {
  Hooks.useEffect(() => {
    window.localStorage.setItem("jwt", JSON.stringify(jwt));
  }, []);

  return (
    <div>
      Welcome <span>{user.displayName}</span>!
    </div>
  );

}
