import { useEffect, useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";
import Login from "./Login.tsx";
import Welcome from "./Welcome.tsx";

export default function Index() {
  let [jwt, setJwt] = useState(null);
  let [user, setUser] = useState(null);
  let [step, setStep] = useState("loading")

  useEffect(() => {
    setJwt(window.localStorage.getItem("jwt"));
    setUser(JSON.parse(window.localStorage.getItem("user") || "null"));
  }, []);

  console.log(jwt, user, (jwt !== null && user !== null));

  useEffect(() => {
    if (jwt !== null && user !== null) return setStep("welcome");
    setStep("login");
  }, [jwt, user]);

  console.log(step)

  if (step === "welcome") {
    return (<div><Welcome jwt={jwt} user={user} /></div>)
  } else if (step === "login") {
    return (<div><Login /></div>)
  } else {
    return (<div> Loading ... </div>)
  }

}
