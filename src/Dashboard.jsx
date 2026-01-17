import { useState, useEffect } from "react";
import { db, auth } from "./firebase.js";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");

  const user = auth.currentUser;

  // Fetch user-specific events from Firestore
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

  // Create a new event with a unique share ID
  const createEvent = async () => {
    if (!title) return;

    // Generate a unique ID for sharing
    const shareId = crypto.randomUUID();

    await addDoc(collection(db, "events"), {
      uid: user.uid,
      title,
      shareId
    });

    setTitle("");
    fetchEvents(); // refresh event list
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Welcome, {user.email}</h2>

      {/* Event creation */}
      <div style={{ margin: "20px 0" }}>
        <input
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "8px", width: "70%", marginRight: "10px" }}
        />
        <button onClick={createEvent} style={{ padding: "8px 12px" }}>
          Create Event
        </button>
      </div>

      {/* Event list */}
      <h3>Your Events:</h3>
      {events.length === 0 && <p>No events yet.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {events.map((ev) => (
          <li
            key={ev.id}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              marginBottom: "10px"
            }}
          >
            <strong>{ev.title}</strong>
            <br />
            <a
              href={`/event/${ev.shareId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue" }}
            >
              Share Link
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
