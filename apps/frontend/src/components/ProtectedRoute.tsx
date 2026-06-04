import { Navigate } from "react-router-dom";

interface ProtecedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtecedRouteProps) {
    // Check if the access token exists in the browser's local storage
    const token = localStorage.getItem('access_token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
}