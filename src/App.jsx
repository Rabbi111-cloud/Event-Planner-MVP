import { Routes, Route } from "react-router-dom";
import Auth from "./Auth.jsx";
import Dashboard from "./Dashboard.jsx";
import ViewEvent from "./ViewEvent.jsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase.js";

export default function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial" }}>
      <p>Loading...</p>
    </div>
  );

  return (
    <Routes>
      {/* Root route: show Dashboard if logged in, Auth if not */}
      <Route path="/" element={user ? <Dashboard /> : <Auth />} />

      {/* Dynamic route for shared events */}
      <Route path="/event/:shareId" element={<ViewEventWrapper />} />

      {/* Optional fallback route */}
      <Route path="*" element={<p style={{ textAlign: "center", marginTop: "50px" }}>Page Not Found</p>} />
    </Routes>
  );
}

// Wrapper component to extract shareId from URL
import { useParams } from "react-router-dom";
function ViewEventWrapper() {
  const { shareId } = useParams();
  return <ViewEvent shareId={shareId} />;
}
