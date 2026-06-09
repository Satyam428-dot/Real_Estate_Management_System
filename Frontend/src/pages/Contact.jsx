import Navbar from "../components/jsx/Navbar";
import Footer from "../components/jsx/Footer";
import "./css/Contact.css";

const officeDetails = [
  {
    title: "Visit Our Office",
    text: "123 Real Estate Ave, San Francisco, CA 94105",
  },
  {
    title: "Call Our Team",
    text: "(123) 544-8590",
  },
  {
    title: "Email Support",
    text: "support@propertyhq.com",
  },
];

export default function Contact() {
  return (
    <>
      <Navbar />

      <main className="page-shell">
        <section className="page-hero contact-hero">
          <div className="page-hero-overlay"></div>
          <div className="page-hero-content">
            <p className="page-kicker">CONTACT PROPERTYHQ</p>
            <h1>Let&apos;s Help You Find the Right Property Faster</h1>
            <p className="page-subtext">
              Reach our team for buying, renting, listing, or property
              management support.
            </p>
          </div>
        </section>

        <section className="container contact-section">
          <div className="row g-4 align-items-stretch">
            <div className="col-lg-5">
              <div className="contact-panel h-100">
                <h2>Get In Touch</h2>
                <p className="contact-copy">
                  We&apos;re here to answer your questions and guide you through
                  every step of your real estate journey.
                </p>

                <div className="contact-info-list">
                  {officeDetails.map((detail) => (
                    <div className="contact-info-card" key={detail.title}>
                      <h3>{detail.title}</h3>
                      <p>{detail.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="contact-form-card h-100">
                <h2>Send A Message</h2>
                <form className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows="6"
                      placeholder="Tell us about your property needs"
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-primary contact-btn">
                      SEND MESSAGE
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
