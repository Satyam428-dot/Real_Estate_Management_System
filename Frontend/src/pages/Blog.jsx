import { JAVA_BACKEND_URL } from "../utils/config";
import { useState, useEffect } from "react";
import Navbar from "../components/jsx/Navbar";
import Footer from "../components/jsx/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Clock,
  Bookmark,
  Grid,
  List as ListIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import "./css/Blog.css";

const API_URL = `${JAVA_BACKEND_URL}`;

const categoryList = [
  "All Posts",
  "Buying Guide",
  "Investment",
  "Home Ownership",
  "Market Trends",
  "Tips & Advice",
  "Lifestyle",
];

// Helper to assign curated soft badge colors matching reference design
const getCategoryBadgeClass = (category) => {
  switch (category) {
    case "Buying Guide":
      return "badge-buying-guide";
    case "Investment":
      return "badge-investment";
    case "Home Ownership":
      return "badge-home-ownership";
    case "Market Trends":
      return "badge-market-trends";
    case "Tips & Advice":
      return "badge-tips-advice";
    case "Lifestyle":
      return "badge-lifestyle";
    default:
      return "badge-default";
  }
};

// Helper for author avatars
const getAuthorAvatar = (authorName) => {
  if (authorName?.includes("Rahul")) {
    return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80";
  }
  if (authorName?.includes("Neha") || authorName?.includes("Pooja") || authorName?.includes("Sneha")) {
    return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80";
  }
  if (authorName?.includes("Amit") || authorName?.includes("Vikram")) {
    return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80";
  }
  return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80";
};

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogData();
  }, [selectedCategory]);

  const fetchBlogData = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/blogs`;
      if (selectedCategory && selectedCategory !== "All Posts") {
        url += `?category=${encodeURIComponent(selectedCategory)}`;
      }

      const res = await axios.get(url);
      setBlogs(res.data || []);
    } catch (err) {
      console.error("Error fetching blog data:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((bId) => bId !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  // Sort logic
  const sortedBlogs = [...blogs].sort((a, b) => {
    if (sortBy === "latest") return (b.id || 0) - (a.id || 0);
    if (sortBy === "oldest") return (a.id || 0) - (b.id || 0);
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <>
      <Navbar />

      <main className="blog-page-bg py-5">
        <div className="container">
          {/* TOP CONTROL BAR: Category Pills + Sort Dropdown + View Toggle */}
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
            {/* Category Filter Pills */}
            <div className="category-scroll-wrapper">
              <div className="d-flex flex-wrap gap-2">
                {categoryList.map((cat) => (
                  <button
                    key={cat}
                    className={`cat-pill-btn ${selectedCategory === cat ? "active" : ""}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Controls: Sort & Grid/List View switch */}
            <div className="d-flex align-items-center gap-3">
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle bg-white border shadow-sm rounded-3 py-2 px-3 text-dark small fw-medium d-flex align-items-center"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Sort by: {sortBy === "latest" ? "Latest" : sortBy === "oldest" ? "Oldest" : "Title"}
                  <ChevronDown size={14} className="ms-2" />
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                  <li>
                    <button className="dropdown-item small" onClick={() => setSortBy("latest")}>
                      Sort by: Latest
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item small" onClick={() => setSortBy("oldest")}>
                      Sort by: Oldest
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item small" onClick={() => setSortBy("title")}>
                      Sort by: Title
                    </button>
                  </li>
                </ul>
              </div>

              {/* View Switch Icons */}
              <div className="btn-group bg-white p-1 border rounded-3 shadow-sm">
                <button
                  className={`btn btn-sm ${viewMode === "grid" ? "btn-primary text-white" : "btn-light text-muted"}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                >
                  <Grid size={16} />
                </button>
                <button
                  className={`btn btn-sm ${viewMode === "list" ? "btn-primary text-white" : "btn-light text-muted"}`}
                  onClick={() => setViewMode("list")}
                  title="List View"
                >
                  <ListIcon size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* LOADING STATE */}
          {loading ? (
            <div className="text-center py-5 my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading blogs...</span>
              </div>
              <p className="mt-3 text-muted">Loading articles...</p>
            </div>
          ) : sortedBlogs.length === 0 ? (
            <div className="text-center py-5 my-5 bg-white rounded-4 shadow-sm">
              <BookOpen size={48} className="text-muted mb-3" />
              <h4 className="fw-bold">No Blog Posts Found</h4>
              <p className="text-muted">No articles available under "{selectedCategory}".</p>
              <button className="btn btn-outline-primary mt-2" onClick={() => setSelectedCategory("All Posts")}>
                View All Posts
              </button>
            </div>
          ) : (
            /* BLOG CARDS GRID */
            <div className={viewMode === "grid" ? "row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" : "d-flex flex-column gap-4"}>
              {sortedBlogs.map((post) => {
                const isBookmarked = bookmarkedIds.includes(post.id);
                const badgeClass = getCategoryBadgeClass(post.category);
                const authorAvatar = getAuthorAvatar(post.author);

                return (
                  <div key={post.id} className="col">
                    <Link to={`/blog/${post.id}`} className="text-decoration-none">
                      <article className={`blog-exact-card bg-white rounded-4 shadow-sm border overflow-hidden h-100 d-flex ${viewMode === "list" ? "flex-row" : "flex-column"}`}>
                        {/* CARD THUMBNAIL WITH BOOKMARK BUTTON */}
                        <div className={`blog-exact-img-wrap position-relative ${viewMode === "list" ? "w-40" : "w-100"}`}>
                          <img
                            src={
                              post.imageUrl ||
                              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
                            }
                            alt={post.title}
                            className="blog-exact-img"
                          />
                          {/* Floating Bookmark Button */}
                          <button
                            className={`bookmark-btn position-absolute top-0 end-0 m-3 btn btn-sm rounded-circle d-flex align-items-center justify-content-center shadow-sm ${
                              isBookmarked ? "btn-dark text-warning" : "btn-dark bg-opacity-75 text-white"
                            }`}
                            onClick={(e) => toggleBookmark(post.id, e)}
                            title={isBookmarked ? "Remove Bookmark" : "Bookmark Article"}
                          >
                            <Bookmark size={15} fill={isBookmarked ? "#f59e0b" : "none"} />
                          </button>
                        </div>

                        {/* CARD CONTENT */}
                        <div className="blog-exact-body p-4 d-flex flex-column flex-grow-1">
                          {/* Category Badge Pill */}
                          <span className={`category-badge-pill ${badgeClass} mb-3 align-self-start`}>
                            {post.category}
                          </span>

                          {/* Title */}
                          <h3 className="blog-exact-title fw-bold text-dark mb-2">
                            {post.title}
                          </h3>

                          {/* Excerpt Description */}
                          <p className="blog-exact-excerpt text-secondary mb-4 flex-grow-1">
                            {post.excerpt || post.content?.substring(0, 110) + "..."}
                          </p>

                          {/* Footer Meta Row: Avatar + Name + Date + Read Time */}
                          <div className="blog-exact-meta d-flex align-items-center text-muted small mt-auto pt-3 border-top">
                            <img
                              src={authorAvatar}
                              alt={post.author || "Author"}
                              className="author-avatar rounded-circle me-2 object-fit-cover"
                              width="26"
                              height="26"
                            />
                            <span className="fw-medium text-dark me-2">
                              By {post.author || "Rahul Sharma"}
                            </span>
                            <span className="me-2">•</span>
                            <span className="me-3">
                              {post.createdOn ? new Date(post.createdOn).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "May 20, 2024"}
                            </span>
                            <span className="d-inline-flex align-items-center ms-auto">
                              <Clock size={13} className="me-1" />
                              {post.readTime || 5} min read
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* PAGINATION BAR (Matching Reference Image) */}
          <div className="d-flex justify-content-center align-items-center mt-5 pt-3">
            <nav aria-label="Blog pagination">
              <ul className="pagination custom-pagination mb-0 align-items-center gap-1">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link px-3 py-2 border rounded-3 text-secondary bg-white small d-flex align-items-center me-2">
                    <ChevronLeft size={16} className="me-1" /> Previous
                  </button>
                </li>
                <li className="page-item">
                  <button
                    className={`page-link px-3 py-2 rounded-3 border fw-semibold ${currentPage === 1 ? "bg-primary text-white border-primary" : "bg-white text-dark"}`}
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </button>
                </li>
                <li className="page-item">
                  <button
                    className={`page-link px-3 py-2 rounded-3 border fw-semibold ${currentPage === 2 ? "bg-primary text-white border-primary" : "bg-white text-dark"}`}
                    onClick={() => setCurrentPage(2)}
                  >
                    2
                  </button>
                </li>
                <li className="page-item">
                  <button className="page-link px-3 py-2 rounded-3 border bg-white text-dark fw-semibold">
                    3
                  </button>
                </li>
                <li className="page-item">
                  <button className="page-link px-3 py-2 rounded-3 border bg-white text-dark fw-semibold">
                    4
                  </button>
                </li>
                <li className="page-item disabled">
                  <span className="page-link border-0 bg-transparent text-muted px-2">...</span>
                </li>
                <li className="page-item">
                  <button className="page-link px-3 py-2 rounded-3 border bg-white text-dark fw-semibold">
                    10
                  </button>
                </li>
                <li className="page-item">
                  <button className="page-link px-3 py-2 border rounded-3 text-secondary bg-white small d-flex align-items-center ms-2">
                    Next <ChevronRight size={16} className="ms-1" />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
