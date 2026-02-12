// App.tsx
import { Toaster } from "react-hot-toast";
import { Router } from "./router";
import { ThemeProvider } from "./utility";
import { SocketProvider } from "./services/SocketContext";
import AuthProvider from "./AuthProvider";
import SessionExpiredDialog from "./infra/api/SessionExpiredDialog";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router /> {/* RouterProvider bên trong */}
          <Toaster position="top-right" gutter={12} />
          {/* ✅ Session Expired Dialog - Always mounted */}
          <SessionExpiredDialog />
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
