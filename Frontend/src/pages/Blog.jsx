import Navbar from "../components/jsx/Navbar";
import Footer from "../components/jsx/Footer";
import { Link } from "react-router-dom";
import "./css/Blog.css";

const featuredPost = {
  category: "Market Insights",
  title: "How to Choose the Right Property in a Fast-Moving Market",
  description:
    "Learn the signals that matter most when comparing neighborhoods, budgets, and long-term investment value.",
};

const blogPosts = [
  {
    category: "Buying Guide",
    title: "5 Questions Every First-Time Buyer Should Ask",
    excerpt:
      "A simple checklist to help you compare listings with more confidence before you commit.",
  },
  {
    category: "Property Management",
    title: "Ways to Keep Rental Properties Attractive to Tenants",
    excerpt:
      "Practical ideas for improving tenant satisfaction while protecting long-term property value.",
  },
  {
    category: "Investment",
    title: "What Makes a Location Strong for Real Estate Growth",
    excerpt:
      "From transit access to nearby development, here are the factors experienced investors watch closely.",
  },
];

const faqItems = [
  {
    question: "How often is the PropertyHQ blog updated?",
    answer:
      "We refresh the blog regularly with new property tips, market insights, and guidance for buyers, renters, and investors.",
  },
  {
    question: "Can I contact your team after reading a blog post?",
    answer:
      "Yes. If you want help with a listing, purchase, rental, or investment decision, you can reach our team directly from the contact page.",
  },
  {
    question: "Are the blog tips useful for first-time buyers?",
    answer:
      "Absolutely. Many of our articles are written to help first-time buyers understand budgeting, neighborhoods, financing, and property comparisons.",
  },
];

export default function Blog() {
  return (
    <>
      <Navbar />

      <main className="page-shell">
        <section className="page-hero blog-hero">
          <div className="page-hero-overlay"></div>
          <div className="page-hero-content">
            <p className="page-kicker">PROPERTYHQ BLOG</p>
            <h1>Insights, Tips, and Stories from the Property Market</h1>
            <p className="page-subtext">
              Stay updated with practical advice for buyers, sellers, renters,
              and property investors.
            </p>
          </div>
        </section>

        <section className="container blog-section">
          <div className="featured-blog-card">
            <span className="blog-badge">{featuredPost.category}</span>
            <h2>{featuredPost.title}</h2>
            <p>{featuredPost.description}</p>
            <Link to="/contact" className="btn btn-primary blog-btn">
              TALK TO AN EXPERT
            </Link>
          </div>

          <div className="row g-4 mt-1">
            {blogPosts.map((post) => (
              <div className="col-md-6 col-xl-4" key={post.title}>
                <article className="blog-card h-100">
                  <span className="blog-badge">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <Link to="/contact" className="blog-link">
                    Learn More
                  </Link>
                </article>
              </div>
            ))}
          </div>

          <section className="faq-section">
            <div className="faq-heading">
              <span className="blog-badge">FAQ</span>
              <h2>Frequently Asked Questions</h2>
              <p>
                Quick answers to common questions from readers exploring
                property advice and market updates.
              </p>
            </div>

            <div className="row g-4">
              {faqItems.map((item) => (
                <div className="col-md-6 col-xl-4" key={item.question}>
                  <article className="faq-card h-100">
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </article>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}
