import { useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";

export default function Login(props) {
  const [loginId, setLoginId] = useState("@leostera@mas.to");
  return (
    <div>
      <input value={loginId} onChange={setLoginId}> </input>
      <Button onClick={() =>
        window.location.pathname = `/login/${loginId}`
      }> login </Button>
    </div>
  );
}
