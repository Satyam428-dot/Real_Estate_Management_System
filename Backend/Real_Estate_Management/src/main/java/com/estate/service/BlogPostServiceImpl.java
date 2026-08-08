package com.estate.service;

import com.estate.customExceptions.ResourceNotFoundException;
import com.estate.dtos.BlogPostRequestDTO;
import com.estate.dtos.BlogPostResponseDTO;
import com.estate.entities.BlogPost;
import com.estate.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BlogPostServiceImpl implements BlogPostService {

    private final BlogPostRepository blogPostRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional(readOnly = true)
    public List<BlogPostResponseDTO> getAllPublishedBlogs(String category, String search) {
        List<BlogPost> posts;

        if (search != null && !search.trim().isEmpty()) {
            posts = blogPostRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseOrCategoryContainingIgnoreCaseAndPublishedTrue(
                    search.trim(), search.trim(), search.trim());
        } else if (category != null && !category.trim().isEmpty() && !"All".equalsIgnoreCase(category.trim())) {
            posts = blogPostRepository.findByCategoryAndPublishedTrueOrderByIdDesc(category.trim());
        } else {
            posts = blogPostRepository.findByPublishedTrueOrderByIdDesc();
        }

        return posts.stream()
                .map(post -> modelMapper.map(post, BlogPostResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlogPostResponseDTO> getAllBlogsAdmin() {
        return blogPostRepository.findAll().stream()
                .map(post -> modelMapper.map(post, BlogPostResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BlogPostResponseDTO getBlogById(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
        return modelMapper.map(post, BlogPostResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public BlogPostResponseDTO getFeaturedBlog() {
        BlogPost post = blogPostRepository.findFirstByFeaturedTrueAndPublishedTrueOrderByIdDesc()
                .orElseGet(() -> {
                    List<BlogPost> published = blogPostRepository.findByPublishedTrueOrderByIdDesc();
                    return published.isEmpty() ? null : published.get(0);
                });

        if (post == null) {
            return null;
        }
        return modelMapper.map(post, BlogPostResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getCategories() {
        return blogPostRepository.findDistinctCategories();
    }

    @Override
    public BlogPostResponseDTO createBlog(BlogPostRequestDTO requestDTO) {
        BlogPost post = modelMapper.map(requestDTO, BlogPost.class);
        if (post.getSlug() == null || post.getSlug().trim().isEmpty()) {
            post.setSlug(generateSlug(post.getTitle()));
        }
        if (post.getAuthor() == null || post.getAuthor().trim().isEmpty()) {
            post.setAuthor("PropertyHQ Editorial Team");
        }
        if (post.getImageUrl() == null || post.getImageUrl().trim().isEmpty()) {
            post.setImageUrl("https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80");
        }
        if (post.isFeatured()) {
            // Un-feature previous posts if new post is featured
            List<BlogPost> previousFeatured = blogPostRepository.findAll().stream()
                    .filter(BlogPost::isFeatured)
                    .collect(Collectors.toList());
            for (BlogPost p : previousFeatured) {
                p.setFeatured(false);
                blogPostRepository.save(p);
            }
        }

        BlogPost saved = blogPostRepository.save(post);
        return modelMapper.map(saved, BlogPostResponseDTO.class);
    }

    @Override
    public BlogPostResponseDTO updateBlog(Long id, BlogPostRequestDTO requestDTO) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));

        post.setTitle(requestDTO.getTitle());
        if (requestDTO.getSlug() != null && !requestDTO.getSlug().trim().isEmpty()) {
            post.setSlug(requestDTO.getSlug());
        } else {
            post.setSlug(generateSlug(requestDTO.getTitle()));
        }
        post.setCategory(requestDTO.getCategory());
        post.setExcerpt(requestDTO.getExcerpt());
        post.setContent(requestDTO.getContent());
        post.setAuthor(requestDTO.getAuthor());
        if (requestDTO.getImageUrl() != null && !requestDTO.getImageUrl().trim().isEmpty()) {
            post.setImageUrl(requestDTO.getImageUrl());
        }
        post.setPublished(requestDTO.isPublished());
        if (requestDTO.getReadTime() != null) {
            post.setReadTime(requestDTO.getReadTime());
        }

        if (requestDTO.isFeatured() && !post.isFeatured()) {
            List<BlogPost> previousFeatured = blogPostRepository.findAll().stream()
                    .filter(BlogPost::isFeatured)
                    .collect(Collectors.toList());
            for (BlogPost p : previousFeatured) {
                p.setFeatured(false);
                blogPostRepository.save(p);
            }
        }
        post.setFeatured(requestDTO.isFeatured());

        BlogPost updated = blogPostRepository.save(post);
        return modelMapper.map(updated, BlogPostResponseDTO.class);
    }

    @Override
    public void deleteBlog(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
        blogPostRepository.delete(post);
    }

    @Override
    public BlogPostResponseDTO toggleFeatured(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));

        boolean newFeaturedState = !post.isFeatured();
        if (newFeaturedState) {
            List<BlogPost> previousFeatured = blogPostRepository.findAll().stream()
                    .filter(BlogPost::isFeatured)
                    .collect(Collectors.toList());
            for (BlogPost p : previousFeatured) {
                p.setFeatured(false);
                blogPostRepository.save(p);
            }
        }
        post.setFeatured(newFeaturedState);

        BlogPost saved = blogPostRepository.save(post);
        return modelMapper.map(saved, BlogPostResponseDTO.class);
    }

    @Override
    public void seedInitialBlogsIfEmpty() {
        if (blogPostRepository.count() > 0) {
            return;
        }

        BlogPost post1 = new BlogPost();
        post1.setTitle("10 Things to Check Before Buying Your Dream Home");
        post1.setSlug("10-things-to-check-before-buying-your-dream-home");
        post1.setCategory("Buying Guide");
        post1.setExcerpt("A complete checklist to evaluate a property and make a smart buying decision.");
        post1.setContent("Purchasing your dream home is a momentous milestone. Before making a final commitment, systematic due diligence ensures your investment remains secure and comfortable for years to come.\n\n### 1. Verify Property Title and Ownership Records\nEnsure the seller holds clear, marketable title rights with zero ongoing legal disputes or encumbrances.\n\n### 2. Conduct a Structural & Plumbing Inspection\nInspect foundation walls, roof integrity, plumbing pressure, and electrical wiring systems to identify hidden repair costs.");
        post1.setAuthor("Rahul Sharma");
        post1.setImageUrl("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80");
        post1.setFeatured(true);
        post1.setPublished(true);
        post1.setReadTime(6);
        blogPostRepository.save(post1);

        BlogPost post2 = new BlogPost();
        post2.setTitle("Real Estate Investment: A Smart Way to Build Wealth");
        post2.setSlug("real-estate-investment-a-smart-way-to-build-wealth");
        post2.setCategory("Investment");
        post2.setExcerpt("Learn why real estate is a reliable investment option and how you can get started.");
        post2.setContent("Real estate remains one of the most resilient wealth creation vehicles globally. Combining passive rental yields with long-term capital appreciation offers unmatched financial security.\n\n### Strategic Neighborhood Selection\nTarget developing corridors located near major infrastructure investments, transit hubs, and commercial complexes.");
        post2.setAuthor("Neha Verma");
        post2.setImageUrl("https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80");
        post2.setFeatured(false);
        post2.setPublished(true);
        post2.setReadTime(5);
        blogPostRepository.save(post2);

        BlogPost post3 = new BlogPost();
        post3.setTitle("Top Real Estate Trends to Watch in 2026");
        post3.setSlug("top-real-estate-trends-to-watch-in-2026");
        post3.setCategory("Market Trends");
        post3.setExcerpt("Stay ahead with the latest real estate trends shaping the future of property.");
        post3.setContent("The urban property market is evolving rapidly with smart home technology, green building standards, and hybrid work lifestyles driving buyer priorities.");
        post3.setAuthor("Amit Patel");
        post3.setImageUrl("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80");
        post3.setFeatured(false);
        post3.setPublished(true);
        post3.setReadTime(4);
        blogPostRepository.save(post3);

        BlogPost post4 = new BlogPost();
        post4.setTitle("First-Time Home Buyer? Avoid These Common Mistakes");
        post4.setSlug("first-time-home-buyer-avoid-these-common-mistakes");
        post4.setCategory("Home Ownership");
        post4.setExcerpt("Don't make costly mistakes. Here are key things every first-time buyer should know.");
        post4.setContent("First-time buyers often overlook total acquisition costs such as registration fees, stamp duty, maintenance deposits, and interior furnishing expenses.");
        post4.setAuthor("Pooja Iyer");
        post4.setImageUrl("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80");
        post4.setFeatured(false);
        post4.setPublished(true);
        post4.setReadTime(5);
        blogPostRepository.save(post4);

        BlogPost post5 = new BlogPost();
        post5.setTitle("Home Loan Basics: Everything You Need to Know");
        post5.setSlug("home-loan-basics-everything-you-need-to-know");
        post5.setCategory("Tips & Advice");
        post5.setExcerpt("Understand home loans, interest rates, eligibility, and how to get the best deal.");
        post5.setContent("Understanding fixed vs floating interest rates, loan tenure, EMI calculations, and processing fees will save you lakhs over your mortgage lifespan.");
        post5.setAuthor("Vikram Singh");
        post5.setImageUrl("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80");
        post5.setFeatured(false);
        post5.setPublished(true);
        post5.setReadTime(6);
        blogPostRepository.save(post5);

        BlogPost post6 = new BlogPost();
        post6.setTitle("Small Balcony Decorating Ideas to Inspire You");
        post6.setSlug("small-balcony-decorating-ideas-to-inspire-you");
        post6.setCategory("Lifestyle");
        post6.setExcerpt("Make the most of your small balcony with these creative and budget-friendly ideas.");
        post6.setContent("Transform compact outdoor balconies into tranquil relaxation spaces with vertical planter walls, weatherproof seating, and warm string lighting.");
        post6.setAuthor("Sneha Reddy");
        post6.setImageUrl("https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80");
        post6.setFeatured(false);
        post6.setPublished(true);
        post6.setReadTime(4);
        blogPostRepository.save(post6);
    }

    private String generateSlug(String title) {
        if (title == null) return "blog-post";
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");
    }
}
