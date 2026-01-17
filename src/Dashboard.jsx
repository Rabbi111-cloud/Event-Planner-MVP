import { useState, useEffect } from "react";
import { db, auth } from "./firebase.js";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [userName, setUserName] = useState("");

  const user = auth.currentUser;

  // Fetch user events & name
  const fetchEvents = async () => {
    if (!user) return;

    // Get user name
    try {
      const userDoc = await getDocs(query(collection(db, "users"), where("__name__", "==", user.uid)));
      if (!userDoc.empty) setUserName(userDoc.docs[0].data().name);
    } catch (err) {
      console.log("User fetch error:", err);
    }

    // Get events
    const q = query(collection(db, "events"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    list.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    setEvents(list);
  };

  useEffect(() => { fetchEvents(); }, [user]);

  // Create Event
  const createEvent = async () => {
    if (!title || !datetime) return alert("Title and Date/Time required");
    const shareId = crypto.randomUUID();
    await addDoc(collection(db, "events"), {
      uid: user.uid,
      title,
      description,
      datetime,
      location,
      category,
      shareId,
      attendees: []
    });
    setTitle(""); setDescription(""); setDatetime(""); setLocation(""); setCategory("");
    fetchEvents();
  };

  // Delete Event
  const deleteEvent = async (id) => {
    await deleteDoc(doc(db, "events", id));
    fetchEvents();
  };

  // Copy share link
  const copyLink = (shareId) => {
    navigator.clipboard.writeText(`${window.location.origin}/event/${shareId}`);
    alert("Link copied!");
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    alert("Logged out!");
  };

  // Countdown timer
  const getCountdown = (eventDate) => {
    const now = new Date();
    const diff = new Date(eventDate) - now;
    if (diff <= 0) return "Event passed";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m left`;
  };

  return (
    <div style={{
      fontFamily: "Arial",
      padding: "20px",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      minHeight: "100vh"
    }}>
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <h1 style={{ color: "#333" }}>EVENT PLANNING APP</h1>
        <button onClick={logout} style={{
          padding: "10px 15px",
          backgroundColor: "#f44336",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}>Logout</button>
      </header>

      <h2 style={{ color: "#555", marginBottom: "20px" }}>Welcome, {userName || user.email}!</h2>

      {/* Create Event Form */}
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}>
        <h3>Create New Event</h3>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}
          style={{ padding: "10px", width: "100%", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}
          style={{ padding: "10px", width: "100%", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
        <input type="datetime-local" value={datetime} onChange={e => setDatetime(e.target.value)}
          style={{ padding: "10px", width: "100%", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
        <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)}
          style={{ padding: "10px", width: "100%", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
        <select value={category} onChange={e => setCategory(e.target.value)}
          style={{ padding: "10px", width: "100%", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc" }}>
          <option value="">Select Category</option>
          <option value="Work">Work</option>
          <option value="Party">Party</option>
          <option value="Meeting">Meeting</option>
          <option value="Other">Other</option>
        </select>
        <button onClick={createEvent} style={{
          padding: "10px 15px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}>Create Event</button>
      </div>

      {/* Event List */}
      <h3 style={{ color: "#555", marginBottom: "15px" }}>Your Events:</h3>
      {events.length === 0 && <p style={{ color: "#888" }}>No events yet.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {events.map(ev => (
          <li key={ev.id} style={{
            background: "#fff",
            padding: "15px",
            marginBottom: "12px",
            borderRadius: "12px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap"
          }}>
            <div>
              <strong style={{ fontSize: "16px" }}>{ev.title}</strong> [{ev.category || "No Category"}]<br />
              {ev.description && <span>{ev.description}<br /></span>}
              <span>{new Date(ev.datetime).toLocaleString()} - {ev.location}<br /></span>
              <em>{new Date(ev.datetime) > new Date() ? getCountdown(ev.datetime) : "Event passed"}</em>
            </div>
            <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
              <button onClick={() => copyLink(ev.shareId)} style={{
                padding: "6px 10px",
                borderRadius: "6px",
                backgroundColor: "#2196F3",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}>Copy Link</button>
              <button onClick={() => deleteEvent(ev.id)} style={{
                padding: "6px 10px",
                borderRadius: "6px",
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
