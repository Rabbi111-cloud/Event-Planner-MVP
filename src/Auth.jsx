import { useState } from "react";
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // new

  const register = async () => {
    if (!name) return alert("Please enter your name!");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Save name in Firestore for personalization
      await setDoc(doc(db, "users", user.uid), { name });
      alert(`Welcome, ${name}! Registered successfully`);
    } catch (error) {
      alert(error.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      color: "#fff",
      fontFamily: "Arial"
    }}>
      <h1 style={{ marginBottom: "20px" }}>EVENT PLANNING APP</h1>

      <div style={{ background: "rgba(255,255,255,0.1)", padding: "30px", borderRadius: "12px", width: "350px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
        <h2 style={{ marginBottom: "15px" }}>Login / Register</h2>
        <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)}
          style={{ padding: "10px", width: "100%", marginBottom: "10px", borderRadius: "6px", border: "none" }} />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          style={{ padding: "10px", width: "100%", marginBottom: "10px", borderRadius: "6px", border: "none" }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          style={{ padding: "10px", width: "100%", marginBottom: "15px", borderRadius: "6px", border: "none" }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={register} style={{ padding: "10px 15px", borderRadius: "6px", backgroundColor: "#4CAF50", border: "none", cursor: "pointer", color: "#fff" }}>Register</button>
          <button onClick={login} style={{ padding: "10px 15px", borderRadius: "6px", backgroundColor: "#2196F3", border: "none", cursor: "pointer", color: "#fff" }}>Login</button>
        </div>
      </div>
    </div>
  );
}
