import React, { useEffect, useState } from "react";
import { CheckCircle2, Edit2, Bookmark, Calendar, BookOpen, MessageSquare, ShieldCheck, Headphones, Mail, Phone, MapPin, Home, DollarSign, BriefcaseBusiness } from "lucide-react";
import { favouritesApi, profileApi } from "../../utils/buyerApi";
import { getLoggedInUser } from "../../utils/auth";
import "./MyProfile.css";

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [savedCount, setSavedCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [message, setMessage] = useState("");
  useEffect(() => {
    const jwtUser = getLoggedInUser();
    const fallback = jwtUser ? { firstName: jwtUser.firstName || "", lastName: jwtUser.lastName || "", email: jwtUser.sub || "", phone: "", createdOn: null } : null;
    if (fallback) {
      setProfile(fallback);
      setForm({ firstName: fallback.firstName, lastName: fallback.lastName, phone: "" });
    }
    profileApi.get().then(({data}) => {
      setProfile(data);
      setForm({ firstName: data.firstName || "", lastName: data.lastName || "", phone: data.phone || "" });
    }).catch(() => {
      if (!fallback) setMessage("Your session has expired. Please sign in again.");
      else setMessage("Showing your account details while the server reconnects.");
    });
    favouritesApi.ids().then(({data}) => setSavedCount(data.length)).catch(() => {});
  }, []);
  const save = async (e) => { e.preventDefault(); try { const { data } = await profileApi.update(form); setProfile(data); setEditing(false); localStorage.setItem("buyer_profile", JSON.stringify({ firstName: data.firstName, lastName: data.lastName })); window.dispatchEvent(new Event("profileUpdated")); setMessage("Profile saved successfully."); } catch { setMessage("Your profile could not be saved. Please check the fields and retry."); } };
  if (!profile) return <div className="my-profile-container"><p>{message || "Loading your profile…"}</p></div>;
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  return <div className="my-profile-container">
    <div className="profile-header"><h1>My Profile</h1><p>Manage the details attached to your buyer account.</p></div>
    {message && <p className="profile-message">{message}</p>}
    <div className="profile-layout"><div className="profile-main-content">
      <section className="profile-card hero-card"><div className="hero-banner-bg"/><div className="hero-profile-info"><div className="profile-avatar avatar-initials">{fullName.charAt(0).toUpperCase()}</div><div className="user-text-details"><div className="user-name-badge"><h2>{fullName}</h2><span className="verified-tag"><CheckCircle2 size={13}/> Verified Buyer</span></div><p className="user-email icon-line"><Mail size={15}/>{profile.email}</p><div className="user-contact-meta icon-line"><Phone size={15}/><span>{profile.phone || "Add a phone number"}</span></div><div className="user-contact-meta icon-line"><MapPin size={15}/><span>Pune, Maharashtra, India</span></div></div><button className="btn-edit-profile" onClick={() => setEditing(!editing)}><Edit2 size={14}/> {editing ? "Cancel" : "Edit Profile"}</button></div></section>
      <section className="profile-stats-grid"><Stat icon={<Bookmark size={20}/>} color="bg-red" value={savedCount} label="Saved Properties"/><Stat icon={<Calendar size={20}/>} color="bg-green" value="—" label="Scheduled Visits"/><Stat icon={<BookOpen size={20}/>} color="bg-purple" value="—" label="Bookings"/><Stat icon={<MessageSquare size={20}/>} color="bg-orange" value="—" label="Enquiries"/></section>
      <section className="profile-card details-card"><div className="card-header-row"><h3>Personal Information</h3><button className="btn-small-edit" onClick={() => setEditing(!editing)}><Edit2 size={13}/> Edit</button></div>{editing ? <form className="personal-info-grid" onSubmit={save}><Field label="First name" value={form.firstName} onChange={(v) => setForm({...form, firstName: v})}/><Field label="Last name" value={form.lastName} onChange={(v) => setForm({...form, lastName: v})}/><Field label="Phone number" value={form.phone} onChange={(v) => setForm({...form, phone: v})}/><div className="info-item"><label>Email address</label><p>{profile.email}</p></div><button className="btn-edit-profile" type="submit">Save changes</button></form> : <div className="personal-info-grid profile-info-reference"><div><Info label="Full Name" value={fullName}/><Info label="Email Address" value={profile.email}/><Info label="Phone Number" value={profile.phone || "Not provided"}/><Info label="Date of Birth" value="Not provided"/></div><div><Info label="Location" value="Pune, Maharashtra, India"/><Info label="Gender" value="Not provided"/><Info label="Occupation" value="Not provided"/><Info label="Member Since" value={profile.createdOn || "—"}/></div></div>}</section>
      <section className="profile-card preferences-card"><div className="card-header-row"><h3>Preferences</h3><button className="btn-small-edit">Edit Preferences</button></div><div className="preferences-grid"><Preference icon={<Home size={18}/>} label="Property Type" value="Apartment, Villa"/><Preference icon={<DollarSign size={18}/>} label="Budget Range" value="₹ 30 Lakh - ₹ 1.5 Cr"/><Preference icon={<MapPin size={18}/>} label="Preferred Location" value="Pune, PCMC, Wakad"/><Preference icon={<BriefcaseBusiness size={18}/>} label="Purpose" value="Buy"/></div></section>
    </div><aside className="profile-sidebar-widgets"><div className="widget-card security-widget"><div className="shield-title"><ShieldCheck size={20} className="text-blue"/><h3>Account Security</h3></div><p className="widget-sub">Use the password settings to keep your account secure.</p><button className="btn-manage-sec" onClick={() => window.alert("Password change is available from Account Settings.")}>Manage Security</button></div><div className="widget-card help-widget"><h3>Need help?</h3><p>Our support team can help with your property search.</p><a className="btn-contact-support" href="mailto:support@realestate.local"><Headphones size={16}/> Contact Support</a></div></aside></div>
  </div>;
}
function Stat({icon, color, value, label}) { return <div className="stat-card"><div className={`stat-icon-box ${color}`}>{icon}</div><div className="stat-info"><h3>{value}</h3><p>{label}</p></div></div>; }
function Info({label, value}) { return <div className="info-item"><label>{label}</label><p>{value}</p></div>; }
function Field({label, value, onChange}) { return <label className="info-item"><span>{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} required={label !== "Phone number"}/></label>; }
function Preference({icon, label, value}) { return <div className="pref-item"><div className="pref-icon icon-blue">{icon}</div><div className="pref-text"><label>{label}</label><p>{value}</p></div></div>; }
