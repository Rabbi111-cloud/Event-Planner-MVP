import { useState, useEffect } from "react";
import { db, auth } from "./firebase.js";
import { 
  collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc 
} from "firebase/firestore";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const user = auth.currentUser;

  // Fetch events for this user
  const fetchEvents = async () => {
    if (!user) return;
    const q = query(collection(db, "events"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort upcoming events first
    list.sort((a,b) => new Date(a.datetime) - new Date(b.datetime));
    setEvents(list);
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  // Create a new event
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

  // Delete event
  const deleteEvent = async (id) => {
    await deleteDoc(doc(db, "events", id));
    fetchEvents();
  };

  // Copy share link
  const copyLink = (shareId) => {
    const url = `${window.location.origin}/event/${shareId}`;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  // Countdown for event
  const getCountdown = (eventDate) => {
    const now = new Date();
    const diff = new Date(eventDate) - now;
    if (diff <= 0) return "Event passed";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m left`;
  };

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto", fontFamily: "Arial" }}>
      <h2>Welcome, {user.email}</h2>

      {/* CREATE EVENT */}
      <div style={{ margin: "20px 0", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3>Create Event</h3>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} style={{ padding:"8px", width:"100%", marginBottom:"10px" }}/>
        <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} style={{ padding:"8px", width:"100%", marginBottom:"10px" }} />
        <input type="datetime-local" value={datetime} onChange={e=>setDatetime(e.target.value)} style={{ padding:"8px", width:"100%", marginBottom:"10px" }} />
        <input placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} style={{ padding:"8px", width:"100%", marginBottom:"10px" }} />
        <select value={category} onChange={e=>setCategory(e.target.value)} style={{ padding:"8px", width:"100%", marginBottom:"10px" }}>
          <option value="">Select Category</option>
          <option value="Work">Work</option>
          <option value="Party">Party</option>
          <option value="Meeting">Meeting</option>
          <option value="Other">Other</option>
        </select>
        <button onClick={createEvent} style={{ padding:"10px 15px", backgroundColor:"#4CAF50", color:"#fff", border:"none", borderRadius:"6px", cursor:"pointer" }}>Create Event</button>
      </div>

      {/* EVENT LIST */}
      <h3>Your Events:</h3>
      {events.length===0 && <p style={{color:"#888"}}>No events yet.</p>}
      <ul style={{ listStyle:"none", padding:0 }}>
        {events.map(ev=>(
          <li key={ev.id} style={{ padding:"12px", border:"1px solid #ccc", borderRadius:"6px", marginBottom:"10px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap" }}>
            <div>
              <strong>{ev.title}</strong> [{ev.category}]<br/>
              {ev.description && <span>{ev.description}<br/></span>}
              <span>{new Date(ev.datetime).toLocaleString()} - {ev.location}<br/></span>
              <em>{getCountdown(ev.datetime)}</em>
            </div>
            <div style={{ display:"flex", gap:"5px", marginTop:"5px" }}>
              <button onClick={()=>copyLink(ev.shareId)} style={{ padding:"6px 10px", borderRadius:"6px", backgroundColor:"#2196F3", color:"#fff", border:"none", cursor:"pointer" }}>Copy Link</button>
              <button onClick={()=>deleteEvent(ev.id)} style={{ padding:"6px 10px", borderRadius:"6px", backgroundColor:"#f44336", color:"#fff", border:"none", cursor:"pointer" }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
