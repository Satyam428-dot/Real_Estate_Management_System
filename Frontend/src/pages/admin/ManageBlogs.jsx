import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  Star,
  Eye,
  Search,
  BookOpen,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";
import "./ManageBlogs.css";

const API_URL = "http://localhost:8080";

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Market Insights",
    excerpt: "",
    content: "",
    author: "PropertyHQ Editorial Team",
    imageUrl: "",
    featured: false,
    published: true,
    readTime: 5,
  });

  useEffect(() => {
    fetchAdminBlogs();
  }, []);

  const fetchAdminBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/blogs/admin`);
      setBlogs(res.data || []);
    } catch (err) {
      console.error("Error fetching admin blogs:", err);
      // Fallback to public endpoint if admin endpoint fails
      try {
        const pubRes = await axios.get(`${API_URL}/blogs`);
        setBlogs(pubRes.data || []);
      } catch (e) {
        toast.error("Failed to load blog posts from server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      category: "Market Insights",
      excerpt: "",
      content: "",
      author: "PropertyHQ Editorial Team",
      imageUrl: "",
      featured: false,
      published: true,
      readTime: 5,
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || "",
      category: post.category || "Market Insights",
      excerpt: post.excerpt || "",
      content: post.content || "",
      author: post.author || "PropertyHQ Editorial Team",
      imageUrl: post.imageUrl || "",
      featured: post.featured || false,
      published: post.published !== false,
      readTime: post.readTime || 5,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.content) {
      toast.error("Please fill in required fields: Title, Category, Content.");
      return;
    }

    try {
      if (editingPost) {
        await axios.put(`${API_URL}/blogs/${editingPost.id}`, formData);
        toast.success("Blog post updated successfully!");
      } else {
        await axios.post(`${API_URL}/blogs`, formData);
        toast.success("New blog post published successfully!");
      }
      setShowModal(false);
      fetchAdminBlogs();
    } catch (err) {
      console.error("Error saving blog post:", err);
      toast.error(err.response?.data?.message || "Failed to save blog post.");
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await axios.delete(`${API_URL}/blogs/${id}`);
        toast.success("Blog post deleted successfully!");
        fetchAdminBlogs();
      } catch (err) {
        console.error("Error deleting blog:", err);
        toast.error("Failed to delete blog post.");
      }
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await axios.patch(`${API_URL}/blogs/${id}/featured`);
      toast.success("Featured status updated!");
      fetchAdminBlogs();
    } catch (err) {
      console.error("Error toggling featured:", err);
      toast.error("Failed to update featured status.");
    }
  };

  const handleSeedBlogs = async () => {
    try {
      await axios.post(`${API_URL}/blogs/seed`);
      toast.success("Default sample blog posts seeded into database!");
      fetchAdminBlogs();
    } catch (err) {
      toast.error("Seed operation finished.");
      fetchAdminBlogs();
    }
  };

  const filteredBlogs = blogs.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="manage-blogs-container p-4">
      {/* Header Bar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center">
            <BookOpen size={28} className="me-2 text-primary" /> Manage Blog Posts
          </h2>
          <p className="text-muted small mb-0">
            Create, edit, feature, and delete real estate blog articles for the public site.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={handleSeedBlogs}>
            <Sparkles size={16} className="me-1" /> Seed Default Articles
          </button>
          <button className="btn btn-primary" onClick={handleOpenCreateModal}>
            <Plus size={18} className="me-1" /> Add New Blog Post
          </button>
        </div>
      </div>

      {/* Filter & Datatable Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white p-3 border-bottom d-flex justify-content-between align-items-center">
          <div className="input-group" style={{ maxWidth: "320px" }}>
            <span className="input-group-text bg-light border-end-0">
              <Search size={16} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control bg-light border-start-0"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="btn btn-light btn-sm" onClick={fetchAdminBlogs}>
            <RefreshCw size={16} className="me-1" /> Refresh
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-secondary small">
              <tr>
                <th>ID</th>
                <th>Thumbnail & Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Read Time</th>
                <th>Featured</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                    Loading blog posts...
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    No blog posts found. Click <strong>"Add New Blog Post"</strong> or <strong>"Seed Default Articles"</strong>.
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((post) => (
                  <tr key={post.id}>
                    <td className="fw-bold">#{post.id}</td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={
                            post.imageUrl ||
                            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=100&q=80"
                          }
                          alt={post.title}
                          className="rounded object-fit-cover"
                          style={{ width: "50px", height: "40px" }}
                        />
                        <div>
                          <div className="fw-bold text-dark text-truncate" style={{ maxWidth: "260px" }}>
                            {post.title}
                          </div>
                          <span className="text-muted small">
                            {post.createdOn ? new Date(post.createdOn).toLocaleDateString() : ""}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-primary border">{post.category}</span>
                    </td>
                    <td className="small">{post.author || "Editorial Team"}</td>
                    <td className="small">{post.readTime || 5} min</td>
                    <td>
                      <button
                        className={`btn btn-sm ${post.featured ? "btn-warning text-dark" : "btn-light text-muted"}`}
                        title="Toggle Featured"
                        onClick={() => handleToggleFeatured(post.id)}
                      >
                        <Star size={14} className="me-1" fill={post.featured ? "currentColor" : "none"} />
                        {post.featured ? "Featured" : "Normal"}
                      </button>
                    </td>
                    <td>
                      <span className={`badge ${post.published ? "bg-success" : "bg-secondary"}`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="btn-group btn-group-sm">
                        <a
                          href={`/blog/${post.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline-secondary"
                          title="View on site"
                        >
                          <Eye size={14} />
                        </a>
                        <button
                          className="btn btn-outline-primary"
                          title="Edit"
                          onClick={() => handleOpenEditModal(post)}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          title="Delete"
                          onClick={() => handleDelete(post.id, post.title)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="modal show d-block tab-modal-backdrop" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom px-4">
                <h5 className="modal-title fw-bold">
                  {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Article Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. 10 Essential Tips for Real Estate Investors in 2026"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Category *</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        placeholder="e.g. PropertyHQ Team"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Thumbnail Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Estimated Read Time (Minutes)</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        className="form-control"
                        value={formData.readTime}
                        onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Short Excerpt (Summary)</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Brief 1-2 sentence overview of the article..."
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Full Article Content *</label>
                      <textarea
                        className="form-control"
                        rows="8"
                        required
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Write article paragraphs here. Use ### for subheadings..."
                      ></textarea>
                    </div>

                    <div className="col-md-6">
                      <div className="form-check form-switch mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="featuredSwitch"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        />
                        <label className="form-check-label fw-semibold" htmlFor="featuredSwitch">
                          Set as Featured Article (Hero Banner)
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-check form-switch mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="publishedSwitch"
                          checked={formData.published}
                          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        />
                        <label className="form-check-label fw-semibold" htmlFor="publishedSwitch">
                          Published (Visible to public)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top px-4 py-3">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    {editingPost ? "Save Changes" : "Publish Article"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
