import { Routes, Route } from "react-router-dom";
import Auth from "./Auth.jsx";
import Dashboard from "./Dashboard.jsx";
import ViewEvent from "./ViewEvent.jsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase.js";
import { useParams } from "react-router-dom";

export default function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial" }}>
      <p>Loading...</p>
    </div>
  );

  return (
    <Routes>
      {/* Root route */}
      <Route path="/" element={user ? <Dashboard /> : <Auth />} />

      {/* Dynamic route for shared events */}
      <Route path="/event/:shareId" element={<ViewEventWrapper />} />

      {/* Fallback route */}
      <Route path="*" element={<p style={{ textAlign: "center", marginTop: "50px" }}>Page Not Found</p>} />
    </Routes>
  );
}

// Extract shareId from URL for ViewEvent
function ViewEventWrapper() {
  const { shareId } = useParams();
  return <ViewEvent shareId={shareId} />;
}
