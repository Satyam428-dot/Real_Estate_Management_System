import React, { useEffect, useMemo, useState } from "react";
import { Grid, List, Heart, Bed, Bath, Maximize, Calendar, Building2, Home } from "lucide-react";
import { favouritesApi } from "../../utils/buyerApi";
import "./SavedProperties.css";

const formatPrice = (price, listingType) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price) + (listingType === "RENT" ? " / month" : "");

export default function SavedProperties() {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(true);

  const load = () => favouritesApi.list().then(({ data }) => setItems(data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const remove = async (id) => { await favouritesApi.remove(id); setItems((current) => current.filter((item) => item.propertyId !== id)); window.dispatchEvent(new Event("savedPropertiesUpdated")); };
  const visible = useMemo(() => items.filter((item) => tab === "all" || item.listingType === tab.toUpperCase()).sort((a, b) => sort === "low" ? Number(a.price) - Number(b.price) : sort === "high" ? Number(b.price) - Number(a.price) : b.propertyId - a.propertyId), [items, tab, sort]);
  const sale = items.filter((item) => item.listingType === "SALE").length;
  const rent = items.filter((item) => item.listingType === "RENT").length;

  return <div className="saved-properties-container">
    <div className="saved-header"><h1>Saved Properties</h1><p>Your favourites are saved securely to your account.</p></div>
    <div className="saved-toolbar">
      <div className="filter-tabs">
        <button className={`tab-btn ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}><Grid size={16}/> All ({items.length})</button>
        <button className={`tab-btn ${tab === "sale" ? "active" : ""}`} onClick={() => setTab("sale")}><Building2 size={16}/> For Sale ({sale})</button>
        <button className={`tab-btn ${tab === "rent" ? "active" : ""}`} onClick={() => setTab("rent")}><Home size={16}/> For Rent ({rent})</button>
      </div>
      <div className="toolbar-actions"><select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-dropdown"><option value="recent">Recently saved</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select><div className="view-mode-toggle"><button className={`view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}><Grid size={18}/></button><button className={`view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}><List size={18}/></button></div></div>
    </div>
    {loading ? <p>Loading your saved properties…</p> : visible.length === 0 ? <div className="no-results-box"><h3>No saved properties yet</h3><p>Tap the heart on a property to keep it here.</p></div> : <div className={`saved-grid ${viewMode}-view`}>
      {visible.map((property) => <div key={property.propertyId} className="saved-card"><div className="card-image-wrapper"><img src={property.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"} alt={property.title}/><span className={`status-badge ${property.listingType === "RENT" ? "tag-rent" : "tag-sale"}`}>For {property.listingType === "RENT" ? "Rent" : "Sale"}</span><button className="favorite-btn active" onClick={() => remove(property.propertyId)} title="Remove from saved"><Heart size={16} fill="#ef4444" color="#ef4444"/></button></div><div className="card-content"><h3 className="property-title">{property.title}</h3><p className="property-location">{property.city}, {property.state}</p><div className="property-price">{formatPrice(property.price, property.listingType)}</div><div className="property-specs"><span className="spec-item"><Bed size={15}/> {property.bedrooms || 0} Beds</span><span className="spec-item"><Bath size={15}/> {property.bathrooms || 0} Baths</span><span className="spec-item"><Maximize size={15}/> {property.areaSqft || 0} sq.ft</span></div><div className="card-footer"><div className="saved-date"><Calendar size={14}/> Saved to your account</div></div></div></div>)}
    </div>}
  </div>;
}
