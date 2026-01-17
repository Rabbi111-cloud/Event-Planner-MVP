import { useState } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Registered!");
  };

  const login = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Logged in!");
    window.location.href = "/dashboard";
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Event Planner</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <br /><br />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <br /><br />
      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>
    </div>
  );
}
