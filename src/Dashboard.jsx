import { useState, useEffect } from "react";
import { db, auth } from "./firebase.js";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");

  const user = auth.currentUser;

  // Fetch user-specific events
  const fetchEvents = async () => {
    if (!user) return;
    const q = query(collection(db, "events"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEvents(list);
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  // Create new event
  const createEvent = async () => {
    if (!title) return;
    const shareId = crypto.randomUUID();
    await addDoc(collection(db, "events"), {
      uid: user.uid,
      title,
      shareId
    });
    setTitle("");
    fetchEvents();
  };

  // Copy link to clipboard
  const copyLink = (shareId) => {
    const url = `${window.location.origin}/event/${shareId}`;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto", fontFamily: "Arial" }}>
      <h2>Welcome, {user.email}</h2>

      <div style={{ margin: "20px 0" }}>
        <input
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "10px", width: "70%", marginRight: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button
          onClick={createEvent}
          style={{ padding: "10px 15px", borderRadius: "6px", backgroundColor: "#4CAF50", color: "#fff", border: "none", cursor: "pointer" }}
        >
          Create Event
        </button>
      </div>

      <h3>Your Events:</h3>
      {events.length === 0 && <p style={{ color: "#888" }}>No events yet. Create one above!</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {events.map(ev => (
          <li key={ev.id} style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "6px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{ev.title}</span>
            <button
              onClick={() => copyLink(ev.shareId)}
              style={{ padding: "6px 10px", borderRadius: "6px", backgroundColor: "#2196F3", color: "#fff", border: "none", cursor: "pointer" }}
            >
              Copy Link
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
