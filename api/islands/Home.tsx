import { useEffect, useState } from "preact/hooks";
import Editor from "./Editor.tsx";
import Gibberish from "./Gibberish.tsx";

export default function Index() {
  const [jwt, setJwt] = useState(null);
  const [user, setUser] = useState(null);
  const [step, setStep] = useState("loading");

  useEffect(() => {
    setJwt(window.localStorage.getItem("jwt"));
    setUser(JSON.parse(window.localStorage.getItem("user") || "null"));
  }, []);

  useEffect(() => {
    if (jwt !== null && user !== null) return setStep("welcome");
    const tId = setTimeout(() => window.location.href = "/", 500);
    return () => clearTimeout(tId);
  }, [jwt, user]);

  if (step === "welcome") {
    return (
      <div>
        <Editor jwt={jwt} user={user} />
      </div>
    );
  }
  return (
    <div>
      <Gibberish />
    </div>
  );
}
