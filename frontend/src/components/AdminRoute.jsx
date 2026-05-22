import {
  Navigate
} from "react-router-dom";

function AdminRoute({
  children
}) {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const isAdmin =
    user?.role === "admin" ||
    user?.role === "superadmin";

  if (!isAdmin) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );

  }

  return children;
}

export default AdminRoute;