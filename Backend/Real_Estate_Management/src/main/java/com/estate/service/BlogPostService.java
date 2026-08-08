package com.estate.service;

import com.estate.dtos.BlogPostRequestDTO;
import com.estate.dtos.BlogPostResponseDTO;

import java.util.List;

public interface BlogPostService {

    List<BlogPostResponseDTO> getAllPublishedBlogs(String category, String search);

    List<BlogPostResponseDTO> getAllBlogsAdmin();

    BlogPostResponseDTO getBlogById(Long id);

    BlogPostResponseDTO getFeaturedBlog();

    List<String> getCategories();

    BlogPostResponseDTO createBlog(BlogPostRequestDTO requestDTO);

    BlogPostResponseDTO updateBlog(Long id, BlogPostRequestDTO requestDTO);

    void deleteBlog(Long id);

    BlogPostResponseDTO toggleFeatured(Long id);

    void seedInitialBlogsIfEmpty();
}
