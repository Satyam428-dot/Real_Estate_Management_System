import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/jsx/Navbar";
import Footer from "../components/jsx/Footer";
import axios from "axios";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
  Check,
  BookOpen,
  ArrowRight,
  Edit3,
} from "lucide-react";
import { toast } from "react-toastify";
import "./css/BlogDetail.css";

const API_URL = "http://localhost:8080";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser") || localStorage.getItem("user") || "{}");
  const isAdmin = loggedUser?.role === "ADMIN" || localStorage.getItem("role") === "ADMIN";

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "",
    author: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    readTime: 5,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/blogs/${id}`);
      setPost(res.data);

      if (res.data) {
        setEditFormData({
          title: res.data.title || "",
          category: res.data.category || "Market Insights",
          author: res.data.author || "PropertyHQ Contributor",
          excerpt: res.data.excerpt || "",
          content: res.data.content || "",
          imageUrl: res.data.imageUrl || "",
          readTime: res.data.readTime || 5,
        });
      }

      // Fetch related posts from same category
      if (res.data?.category) {
        const relRes = await axios.get(
          `${API_URL}/blogs?category=${encodeURIComponent(res.data.category)}`
        );
        const filtered = (relRes.data || []).filter(
          (item) => item.id !== parseInt(id)
        );
        setRelatedPosts(filtered.slice(0, 3));
      }
    } catch (err) {
      console.error("Error loading blog details:", err);
      toast.error("Failed to load blog post.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.info(!bookmarked ? "Article saved to reading list!" : "Article removed from reading list.");
  };

  const handleOpenEditModal = () => {
    if (post) {
      setEditFormData({
        title: post.title || "",
        category: post.category || "Market Insights",
        author: post.author || "PropertyHQ Contributor",
        excerpt: post.excerpt || "",
        content: post.content || "",
        imageUrl: post.imageUrl || "",
        readTime: post.readTime || 5,
      });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.put(`${API_URL}/blogs/${id}`, editFormData);
      toast.success("Article updated successfully!");
      setShowEditModal(false);
      fetchBlogPost();
    } catch (err) {
      console.error("Error updating article:", err);
      toast.error("Failed to update article.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading article...</span>
          </div>
          <p className="mt-3 text-muted">Loading article details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center my-5">
          <BookOpen size={48} className="text-muted mb-3" />
          <h2>Article Not Found</h2>
          <p className="text-muted">The blog article you are looking for does not exist or has been removed.</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate("/blog")}>
            <ArrowLeft size={16} className="me-2" /> Back to Blog
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const contentParagraphs = post.content ? post.content.split("\n\n") : [];

  return (
    <>
      <Navbar />

      <main className="blog-detail-shell bg-light pb-5">
        {/* Header Hero */}
        <section className="blog-detail-hero bg-dark text-white py-5 position-relative">
          <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <button onClick={() => navigate("/blog")} className="btn btn-outline-light btn-sm">
                <ArrowLeft size={16} className="me-2" /> Back to Articles
              </button>

              {isAdmin && (
                <button className="btn btn-warning btn-sm fw-bold d-inline-flex align-items-center" onClick={handleOpenEditModal}>
                  <Edit3 size={15} className="me-1" /> Edit Article
                </button>
              )}
            </div>

            <span className="badge bg-primary text-uppercase px-3 py-2 fs-6 mb-3 d-inline-block">
              {post.category}
            </span>

            <h1 className="display-5 fw-bold mb-3 text-white">{post.title}</h1>

            <div className="d-flex flex-wrap align-items-center gap-4 text-white-50 small fs-6">
              <span className="d-flex align-items-center">
                <User size={16} className="me-1 text-primary" /> {post.author || "PropertyHQ Team"}
              </span>
              <span className="d-flex align-items-center">
                <Calendar size={16} className="me-1 text-primary" />
                {post.createdOn ? new Date(post.createdOn).toLocaleDateString() : "Recent"}
              </span>
              <span className="d-flex align-items-center">
                <Clock size={16} className="me-1 text-primary" /> {post.readTime || 5} min read
              </span>
            </div>
          </div>
        </section>

        {/* Article Body Container */}
        <section className="container mt-n4">
          <div className="row g-4">
            <div className="col-lg-8 mx-auto">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-5">
                <img
                  src={
                    post.imageUrl ||
                    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={post.title}
                  className="blog-detail-img"
                />

                <div className="card-body p-4 p-md-5">
                  {/* Action bar */}
                  <div className="d-flex justify-content-between align-items-center pb-4 mb-4 border-bottom">
                    <span className="text-muted small italic">
                      Share, bookmark, or edit this article
                    </span>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={handleOpenEditModal}
                      >
                        <Edit3 size={15} className="me-1" /> Edit
                      </button>
                      <button
                        className={`btn btn-outline-secondary btn-sm ${copied ? "btn-success text-white" : ""}`}
                        onClick={handleShare}
                      >
                        {copied ? <Check size={16} className="me-1" /> : <Share2 size={16} className="me-1" />}
                        {copied ? "Copied!" : "Share"}
                      </button>
                      <button
                        className={`btn ${bookmarked ? "btn-warning" : "btn-outline-secondary"} btn-sm`}
                        onClick={handleBookmark}
                      >
                        <Bookmark size={16} className="me-1" />
                        {bookmarked ? "Saved" : "Save"}
                      </button>
                    </div>
                  </div>

                  {/* Excerpt callout */}
                  {post.excerpt && (
                    <div className="blog-excerpt-callout mb-4 p-4 rounded-3 bg-light border-start border-primary border-4 fs-5 text-dark fw-medium">
                      "{post.excerpt}"
                    </div>
                  )}

                  {/* Content body */}
                  <div className="blog-article-content">
                    {contentParagraphs.map((para, index) => {
                      if (para.startsWith("### ")) {
                        return (
                          <h3 key={index} className="fw-bold mt-4 mb-3 text-dark">
                            {para.replace("### ", "")}
                          </h3>
                        );
                      }
                      return (
                        <p key={index} className="fs-6 leading-relaxed mb-4 text-secondary">
                          {para}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <div className="related-articles-section mt-5 pt-4">
              <h3 className="fw-bold mb-4">Related Articles in {post.category}</h3>
              <div className="row g-4">
                {relatedPosts.map((rel) => (
                  <div className="col-md-4" key={rel.id}>
                    <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
                      <img
                        src={
                          rel.imageUrl ||
                          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80"
                        }
                        alt={rel.title}
                        style={{ height: "160px", objectFit: "cover" }}
                      />
                      <div className="card-body p-3 d-flex flex-column">
                        <span className="badge bg-light text-primary align-self-start mb-2">
                          {rel.category}
                        </span>
                        <h6 className="fw-bold mb-2">{rel.title}</h6>
                        <p className="text-muted small flex-grow-1">
                          {rel.excerpt?.substring(0, 80) + "..."}
                        </p>
                        <Link to={`/blog/${rel.id}`} className="text-primary fw-bold small text-decoration-none mt-2">
                          Read More <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="modal show d-block tab-modal-backdrop" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom px-4">
                <h5 className="modal-title fw-bold d-flex align-items-center">
                  <Edit3 size={20} className="me-2 text-primary" /> Edit Article
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSaveEdit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Article Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={editFormData.title}
                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Category *</label>
                      <select
                        className="form-select"
                        value={editFormData.category}
                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                      >
                        <option value="Market Insights">Market Insights</option>
                        <option value="Buying Guide">Buying Guide</option>
                        <option value="Property Management">Property Management</option>
                        <option value="Investment">Investment</option>
                        <option value="Architecture & Design">Architecture & Design</option>
                        <option value="Legal & Finance">Legal & Finance</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Author Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editFormData.author}
                        onChange={(e) => setEditFormData({ ...editFormData, author: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Thumbnail Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={editFormData.imageUrl}
                        onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Estimated Read Time (Minutes)</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        className="form-control"
                        value={editFormData.readTime}
                        onChange={(e) => setEditFormData({ ...editFormData, readTime: parseInt(e.target.value) || 5 })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Short Excerpt (Summary)</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={editFormData.excerpt}
                        onChange={(e) => setEditFormData({ ...editFormData, excerpt: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Full Article Content *</label>
                      <textarea
                        className="form-control"
                        rows="8"
                        required
                        value={editFormData.content}
                        onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top px-4 py-3">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
