import "../css/AgentCard.css";

function AgentCard({ image, name, role }) {
  return (
    <div className="agent-card">
      <img src={image} alt="agent" />

      <h3>{name}</h3>
      <p>{role}</p>

      <button>Contact Agent</button>
    </div>
  );
}

export default AgentCard;