import Navbar from "../components/jsx/Navbar";
import Footer from "../components/jsx/Footer";
import AgentCard from "../components/jsx/AgentCard";
import "./css/Agents.css";

const agentsData = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Senior Property Consultant",
    location: "Pune, Maharashtra",
    rating: 4.8,
    reviews: 120,
    badge: null,
    specializations: ["Residential", "Luxury", "Apartments"],
    properties: 128,
    experience: "6+ Years Exp.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 2,
    name: "Neha Verma",
    role: "Property Advisor",
    location: "Mumbai, Maharashtra",
    rating: 4.7,
    reviews: 98,
    badge: "Verified Agent",
    badgeType: "verified",
    specializations: ["Residential", "Villas", "Investments"],
    properties: 96,
    experience: "5+ Years Exp.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "Property Consultant",
    location: "Bengaluru, Karnataka",
    rating: 4.6,
    reviews: 85,
    badge: "Verified Agent",
    badgeType: "verified",
    specializations: ["Commercial", "Office Space", "Retail"],
    properties: 74,
    experience: "4+ Years Exp.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 4,
    name: "Pooja Iyer",
    role: "Real Estate Advisor",
    location: "Hyderabad, Telangana",
    rating: 4.9,
    reviews: 110,
    badge: "Top Rated",
    badgeType: "top-rated",
    specializations: ["Residential", "Plots", "Villas"],
    properties: 101,
    experience: "7+ Years Exp.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 5,
    name: "Vikram Singh",
    role: "Property Consultant",
    location: "Delhi NCR",
    rating: 4.5,
    reviews: 70,
    badge: null,
    specializations: ["Residential", "Apartments", "Investments"],
    properties: 82,
    experience: "5+ Years Exp.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 6,
    name: "Sneha Reddy",
    role: "Property Advisor",
    location: "Chennai, Tamil Nadu",
    rating: 4.6,
    reviews: 60,
    badge: null,
    specializations: ["Residential", "Villas", "Luxury"],
    properties: 67,
    experience: "4+ Years Exp.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 7,
    name: "Arjun Mehta",
    role: "Senior Property Consultant",
    location: "Ahmedabad, Gujarat",
    rating: 4.7,
    reviews: 95,
    badge: null,
    specializations: ["Commercial", "Retail", "Investments"],
    properties: 90,
    experience: "6+ Years Exp.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 8,
    name: "Kavya Nair",
    role: "Property Advisor",
    location: "Kochi, Kerala",
    rating: 4.8,
    reviews: 75,
    badge: null,
    specializations: ["Residential", "Plots", "Apartments"],
    properties: 58,
    experience: "3+ Years Exp.",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80"
  }
];

export default function Agents() {
  return (
    <>
      <Navbar />

      <main className="agents-page-wrapper">
        <div className="agents-container">
          <div className="agents-header">
            <h1>Property Agents</h1>
            <p>Connect with our experienced agents for expert guidance and personalized assistance.</p>
          </div>

          <div className="agents-grid">
            {agentsData.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}