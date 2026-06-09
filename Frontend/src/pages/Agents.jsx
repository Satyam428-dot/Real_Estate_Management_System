import Navbar from "../components/jsx/Navbar";
import AgentCard from "../components/jsx/AgentCard";

function Agents() {

  const agents = [
    {
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "John Smith",
      role: "Senior Property Dealer"
    },
    {
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      name: "Emma Watson",
      role: "Luxury Home Specialist"
    },
    {
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      name: "David Miller",
      role: "Commercial Agent"
    }
  ];

  return (
    <>
      <Navbar />

      <div className="section">
        <h1>Our Agents</h1>

        <div className="agent-grid">
          {agents.map((agent, index) => (
            <AgentCard key={index} {...agent} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Agents;