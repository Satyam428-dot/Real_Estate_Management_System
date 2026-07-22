import { useState } from "react";
import Navbar from "../components/jsx/Navbar";
import Footer from "../components/jsx/Footer";
import "./css/Properties.css";

import indianLuxuryVilla from "../assets/indian_luxury_villa.png";
import indianTechApartment from "../assets/indian_tech_apartment.png";
import indianSeafacingPenthouse from "../assets/indian_seafacing_penthouse.png";
import indianHeritageBungalow from "../assets/indian_heritage_bungalow.png";


const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Imperial Residency Villa",
    price: 85000000,
    address: "Plot No. 12, Gulmohar Road, Juhu, Mumbai, MH 400049",
    city: "Mumbai",
    type: "House",
    beds: 4,
    baths: 5,
    area: 4200,
    status: "For Sale",
    image: indianLuxuryVilla,
    gradient: "linear-gradient(135deg, #2c3e50, #bdc3c7)",
    description: "Experience the epitome of luxury living in this spectacular modern villa at Juhu. Designed by premium architects, this home offers soaring ceilings, private landscaping, and a state-of-the-art kitchen. Features a private plunge pool and stunning view of the city skyline.",
    features: ["Plunge Pool", "Modular Kitchen", "Home Theater", "Smart Home", "Private Garden"],
    agent: {
      name: "Rajesh Sharma",
      phone: "+91 98200 12345",
      email: "rajesh@propertyhq.com"
    }
  },
  {
    id: 2,
    title: "Sleek Tech Loft",
    price: 45000, 
    address: "Flat 402, Sunshine Heights, Indiranagar, Bangalore, KA 560038",
    city: "Bangalore",
    type: "Apartment",
    beds: 1,
    baths: 1.5,
    area: 950,
    status: "For Rent",
    image: indianTechApartment,
    gradient: "linear-gradient(135deg, #1f4068, #162447)",
    description: "Stunning modern apartment in Bangalore's prime Indiranagar location. Boasts high ceilings, open-concept design, and dual balconies. Fully furnished with high-speed internet capability and close access to local metro stations.",
    features: ["Metro Connectivity", "Balcony View", "Fully Furnished", "Gated Security", "Clubhouse Access"],
    agent: {
      name: "Priya Patel",
      phone: "+91 98100 54321",
      email: "priya@propertyhq.com"
    }
  },
  {
    id: 3,
    title: "Marine Drive Penthouse",
    price: 42000000, 
    address: "15th Floor, Sea Breeze Apartments, Marine Drive, Mumbai, MH 400020",
    city: "Mumbai",
    type: "Condo",
    beds: 2,
    baths: 2,
    area: 1400,
    status: "For Sale",
    image: indianSeafacingPenthouse,
    gradient: "linear-gradient(135deg, #0f8b8d, #ec9a29)",
    description: "Wake up to breathtaking sea views in this premium Marine Drive condo. Features include polished Italian marble flooring, false ceiling, direct balcony facing the sea, and round-the-clock concierge services.",
    features: ["Sea View", "Italian Marble", "Concierge Service", "24/7 Security", "Valet Parking"],
    agent: {
      name: "Rajesh Sharma",
      phone: "+91 98200 12345",
      email: "rajesh@propertyhq.com"
    }
  },
  {
    id: 4,
    title: "Elegant Green Meadows",
    price: 18000000, 
    address: "Villa 24, Clover Greens, Koregaon Park, Pune, MH 411001",
    city: "Pune",
    type: "House",
    beds: 3,
    baths: 2.5,
    area: 2100,
    status: "For Sale",
    image: indianLuxuryVilla,
    gradient: "linear-gradient(135deg, #512b58, #2c786c)",
    description: "Nestled in Pune's peaceful Koregaon Park, this gorgeous independent home blends classic brick elevations with modern spaces. Includes a separate study, private parking space, and private lawn backyard.",
    features: ["Private Lawn", "Study Room", "Gated Society", "Independent Villa", "Power Backup"],
    agent: {
      name: "Amit Verma",
      phone: "+91 98300 98765",
      email: "amit@propertyhq.com"
    }
  },
  {
    id: 5,
    title: "Skyline Premium Suite",
    price: 125000000, 
    address: "Block C, Amrapali Towers, Connaught Place, New Delhi, DL 110001",
    city: "Delhi",
    type: "Apartment",
    beds: 3,
    baths: 3.5,
    area: 3800,
    status: "For Sale",
    image: indianSeafacingPenthouse,
    gradient: "linear-gradient(135deg, #111111, #434343)",
    description: "A colossal luxury penthouse right in Central Delhi. High-end wood flooring, central air conditioning, floor-to-ceiling windows with panoramic views of the city, private terrace deck, and custom modular woodwork.",
    features: ["Connaught Place View", "Private Terrace", "Central AC", "Elevator Access", "Dedicated Servant Quarter"],
    agent: {
      name: "Amit Verma",
      phone: "+91 98300 98765",
      email: "amit@propertyhq.com"
    }
  },
  {
    id: 6,
    title: "Cozy Heritage Bungalow",
    price: 35000, 
    address: "House No. 89, Jubilee Hills Road No. 10, Hyderabad, TS 500033",
    city: "Hyderabad",
    type: "Townhouse",
    beds: 2,
    baths: 2,
    area: 1250,
    status: "For Rent",
    image: indianHeritageBungalow,
    gradient: "linear-gradient(135deg, #4b5d67, #322f3d)",
    description: "Charmingly renovated heritage-style home with traditional accents. Offers a quiet courtyard garden, modern kitchen block, and two spacious bedrooms. Prime proximity to top IT parks and cafes.",
    features: ["Courtyard Garden", "Traditional Pillars", "Renovated Kitchen", "Car Parking", "Pet Friendly"],
    agent: {
      name: "Priya Patel",
      phone: "+91 98100 54321",
      email: "priya@propertyhq.com"
    }
  }
];

export default function Properties() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedBeds, setSelectedBeds] = useState("All");
  const [priceFilter, setPriceFilter] = useState(150000000); // Max budget (15 Cr)
  const [favorites, setFavorites] = useState([]);
  // No modal details page state needed

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };



  // Format Price to Indian Rupees (INR) format (Lakhs and Crores)
  const formatPrice = (price, status) => {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    });
    return status === "For Rent" ? `${formatter.format(price)}/mo` : formatter.format(price);
  };

  // Filter Properties
  const filteredProperties = MOCK_PROPERTIES.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = selectedType === "All" || property.type === selectedType;
    const matchesLocation = selectedLocation === "All" || property.city === selectedLocation;
    const matchesBeds = 
      selectedBeds === "All" || 
      (selectedBeds === "4+" ? property.beds >= 4 : property.beds === parseInt(selectedBeds));

    // Handle rent prices vs sale prices appropriately for max filter
    const matchesPrice = property.price <= priceFilter;

    return matchesSearch && matchesType && matchesLocation && matchesBeds && matchesPrice;
  });

  return (
    <div className="properties-page-wrapper">
      <Navbar />

      {/* Hero Header */}
      <header className="properties-hero text-center py-5 mb-5 text-white">
        <div className="container">
          <h1 className="display-4 fw-bold">Explore Our Properties</h1>
          <p className="lead opacity-75">Discover premium homes, luxury apartments, and modern condos tailored to your lifestyle.</p>
        </div>
      </header>

      <main className="container pb-5">
        <div className="row g-4">
          {/* Filters Column */}
          <aside className="col-lg-4">
            <div className="filter-card shadow-sm p-4 rounded-4 bg-white border border-light">
              <h4 className="fw-bold mb-4 d-flex justify-content-between align-items-center">
                <span>Filters</span>
                <button 
                  className="btn btn-sm btn-link text-decoration-none text-muted" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("All");
                    setSelectedLocation("All");
                    setSelectedBeds("All");
                    setPriceFilter(150000000);
                  }}
                >
                  Reset All
                </button>
              </h4>

              {/* Search */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-muted">Search Address / Title</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0 text-muted"><i className="bi bi-search"></i></span>
                  <input
                    type="text"
                    className="form-control bg-light border-0"
                    placeholder="Enter keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-muted">Property Type</label>
                <select 
                  className="form-select bg-light border-0" 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                </select>
              </div>

              {/* Location */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-muted">City / Location</label>
                <select 
                  className="form-select bg-light border-0" 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="All">All Locations</option>
                  <option value="Mumbai">Mumbai, MH</option>
                  <option value="Delhi">Delhi, DL</option>
                  <option value="Bangalore">Bangalore, KA</option>
                  <option value="Pune">Pune, MH</option>
                  <option value="Hyderabad">Hyderabad, TS</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-muted">Bedrooms</label>
                <select 
                  className="form-select bg-light border-0" 
                  value={selectedBeds}
                  onChange={(e) => setSelectedBeds(e.target.value)}
                >
                  <option value="All">Any Bedrooms</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4+">4+ Bedrooms</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <div className="d-flex justify-content-between">
                  <label className="form-label fw-semibold text-muted">Max Budget</label>
                  <span className="text-primary fw-bold">
                    {priceFilter >= 150000000 ? "Any Price" : formatPrice(priceFilter, "For Sale")}
                  </span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="10000"
                  max="150000000"
                  step="500000"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(parseInt(e.target.value))}
                />
                <div className="d-flex justify-content-between text-muted fs-7">
                  <span>₹10k</span>
                  <span>₹7.5 Cr</span>
                  <span>₹15 Cr+</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Properties Grid */}
          <section className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <p className="text-muted mb-0">Found <span className="fw-semibold text-dark">{filteredProperties.length}</span> properties</p>
              <div className="d-flex gap-2">
                <span className="badge bg-light text-dark p-2 border">Grid View</span>
              </div>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="text-center py-5 bg-white shadow-sm rounded-4 border border-light">
                <div className="text-muted fs-1 mb-3">🔍</div>
                <h5 className="fw-bold">No Properties Found</h5>
                <p className="text-muted">Try adjusting your filters or search keywords.</p>
              </div>
            ) : (
              <div className="row g-4">
                {filteredProperties.map(property => (
                  <div className="col-md-6" key={property.id}>
                    <div 
                      className="card h-100 property-card border-0 shadow-sm rounded-4 overflow-hidden"
                    >
                      {/* Image Area */}
                      <div 
                        className="property-image-container" 
                        style={{ backgroundImage: property.image ? `url(${property.image})` : property.gradient }}
                      >
                        <span className={`badge-status ${property.status === "For Rent" ? "bg-info" : "bg-primary"}`}>
                          {property.status}
                        </span>
                        <span className="badge-type">{property.type}</span>
                        <button 
                          className={`btn-fav ${favorites.includes(property.id) ? "active" : ""}`}
                          onClick={(e) => toggleFavorite(property.id, e)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill={favorites.includes(property.id) ? "#ef476f" : "currentColor"} viewBox="0 0 16 16">
                            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                          </svg>
                        </button>
                      </div>

                      {/* Content Area */}
                      <div className="card-body p-4 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title fw-bold text-dark mb-0 text-truncate" style={{maxWidth: "75%"}}>
                            {property.title}
                          </h5>
                          <span className="text-primary fw-bold fs-5">
                            {formatPrice(property.price, property.status)}
                          </span>
                        </div>
                        <p className="card-text text-muted mb-3 fs-7 text-truncate">
                          <i className="bi bi-geo-alt-fill text-danger me-1"></i> {property.address}
                        </p>

                        {/* Specs Grid */}
                        <div className="property-specs d-flex gap-3 mt-auto text-muted">
                          <span className="d-flex align-items-center gap-1">
                            <i className="bi bi-door-open"></i> {property.beds} Bed
                          </span>
                          <span className="d-flex align-items-center gap-1">
                            <i className="bi bi-droplet"></i> {property.baths} Bath
                          </span>
                          <span className="d-flex align-items-center gap-1">
                            <i className="bi bi-arrows-angle-expand"></i> {property.area} sqft
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>



      <Footer />
    </div>
  );
}
