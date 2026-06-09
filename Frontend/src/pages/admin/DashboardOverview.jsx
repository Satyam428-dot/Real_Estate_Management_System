import { useEffect, useState } from "react";

export default function DashboardOverview() {
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser && loggedInUser.role === "ADMIN") {
      setAdminName(loggedInUser.name);
    }
  }, []);

  return (
    <>
      <h1>Welcome {adminName}</h1>
      <p>Dashboard Statistics will be shown here.</p>
    </>
  );
}
