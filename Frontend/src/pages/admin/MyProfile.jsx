// import "./MyProfile.css";
// import { useState } from "react";

// export default function MyProfile() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);

//   const [user, setUser] = useState({
//     id: 1, // TODO: replace with the logged-in admin's real user_id (e.g. from auth context)
//     firstName: "Ayush",
//     lastName: "Behera",
//     email: "ayush@gmail.com",
//     phone: "9876543210",
//     role: "ADMIN",
//   });

//   // Keeps a snapshot of the values before editing started, so Cancel can
//   // restore them if the user backs out without saving.
//   const [draft, setDraft] = useState(user);

//   const handleChange = (e) => {
//     setDraft({
//       ...draft,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleEdit = () => {
//     setDraft(user);
//     setIsEditing(true);
//   };

//   const handleCancel = () => {
//     setDraft(user);
//     setIsEditing(false);
//   };

//   const handleSave = async () => {
//     setIsSaving(true);

//     try {
//       // ------------------------------------------------------------
//       // 🔌 API CALL — PUT /users/admin/{id}
//       // Matches UserController.updateAdmin(id, User user) on the backend.
//       // Note: password and userRoles are intentionally left out — the
//       // backend ignores/rejects changes to those from this endpoint.
//       // ------------------------------------------------------------
//       const res = await fetch(`/users/admin/${user.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           firstName: draft.firstName,
//           lastName: draft.lastName,
//           email: draft.email,
//           phone: draft.phone,
//         }),
//       });

//       if (!res.ok) {
//         const message = await res.text();
//         throw new Error(message || "Failed to update profile");
//       }

//       const updatedAdmin = await res.json();
//       setUser(updatedAdmin);
//       setIsEditing(false);
//     } catch (err) {
//       console.error(err);
//       // TODO: surface an error toast/message to the user
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const values = isEditing ? draft : user;

//   return (
//     <div className="profile-page">
//       <div className="profile-card">
//         <div className="profile-header">
//           <div className="avatar">
//             {values.firstName.charAt(0)}
//             {values.lastName.charAt(0)}
//           </div>
//           <div>
//             <h2>
//               {values.firstName} {values.lastName}
//             </h2>
//             <span className="role-badge">{values.role}</span>
//           </div>

//           {!isEditing && (
//             <button className="edit-btn" onClick={handleEdit} type="button">
//               <PencilIcon />
//               Edit
//             </button>
//           )}
//         </div>

//         <div className="profile-body">
//           <div className="profile-row">
//             <label htmlFor="firstName">First Name</label>
//             <input
//               id="firstName"
//               type="text"
//               name="firstName"
//               value={values.firstName}
//               onChange={handleChange}
//               readOnly={!isEditing}
//               className={isEditing ? "editable" : ""}
//             />
//           </div>

//           <div className="profile-row">
//             <label htmlFor="lastName">Last Name</label>
//             <input
//               id="lastName"
//               type="text"
//               name="lastName"
//               value={values.lastName}
//               onChange={handleChange}
//               readOnly={!isEditing}
//               className={isEditing ? "editable" : ""}
//             />
//           </div>

//           <div className="profile-row">
//             <label htmlFor="email">Email</label>
//             <input
//               id="email"
//               type="email"
//               name="email"
//               value={values.email}
//               onChange={handleChange}
//               readOnly={!isEditing}
//               className={isEditing ? "editable" : ""}
//             />
//           </div>

//           <div className="profile-row">
//             <label htmlFor="phone">Phone</label>
//             <input
//               id="phone"
//               type="text"
//               name="phone"
//               value={values.phone}
//               onChange={handleChange}
//               readOnly={!isEditing}
//               className={isEditing ? "editable" : ""}
//             />
//           </div>

//           <div className="profile-row">
//             <label htmlFor="role">Role</label>
//             <input id="role" type="text" value={values.role} readOnly />
//           </div>
//         </div>

//         {isEditing && (
//           <div className="button-group">
//             <button
//               className="cancel-btn"
//               onClick={handleCancel}
//               type="button"
//               disabled={isSaving}
//             >
//               Cancel
//             </button>
//             <button
//               className="save-btn"
//               onClick={handleSave}
//               type="button"
//               disabled={isSaving}
//             >
//               {isSaving ? "Saving…" : "Save Changes"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function PencilIcon() {
//   return (
//     <svg
//       width="14"
//       height="14"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
//     </svg>
//   );
// }

import "./MyProfile.css";
import { useEffect, useState } from "react";

export default function MyProfile() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const adminId = loggedInUser?.userId;
  const token = loggedInUser?.token;

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [user, setUser] = useState(null);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:8080/users/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();

      setUser(data);
      setDraft(data);
    } catch (err) {
      console.error(err);
      alert("Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setDraft({
      ...draft,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    setDraft(user);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(user);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const res = await fetch(`http://localhost:8080/users/admin/${adminId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: draft.firstName,
          lastName: draft.lastName,
          email: draft.email,
          phone: draft.phone,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const updatedAdmin = await res.json();

      setUser(updatedAdmin);
      setDraft(updatedAdmin);
      setIsEditing(false);

      alert("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <h2>Loading Profile...</h2>;
  }

  const values = isEditing ? draft : user;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {values.firstName.charAt(0)}
            {values.lastName.charAt(0)}
          </div>

          <div>
            <h2>
              {values.firstName} {values.lastName}
            </h2>

            <span className="role-badge">{values.userRoles}</span>
          </div>

          {!isEditing && (
            <button className="edit-btn" onClick={handleEdit}>
              <PencilIcon />
              Edit
            </button>
          )}
        </div>

        <div className="profile-body">
          <div className="profile-row">
            <label>First Name</label>

            <input
              type="text"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              readOnly={!isEditing}
              className={isEditing ? "editable" : ""}
            />
          </div>

          <div className="profile-row">
            <label>Last Name</label>

            <input
              type="text"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              readOnly={!isEditing}
              className={isEditing ? "editable" : ""}
            />
          </div>

          <div className="profile-row">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              readOnly={!isEditing}
              className={isEditing ? "editable" : ""}
            />
          </div>

          <div className="profile-row">
            <label>Phone</label>

            <input
              type="text"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              readOnly={!isEditing}
              className={isEditing ? "editable" : ""}
            />
          </div>

          <div className="profile-row">
            <label>Role</label>

            <input type="text" value={values.userRoles} readOnly />
          </div>
        </div>

        {isEditing && (
          <div className="button-group">
            <button
              className="cancel-btn"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>

            <button
              className="save-btn"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}
