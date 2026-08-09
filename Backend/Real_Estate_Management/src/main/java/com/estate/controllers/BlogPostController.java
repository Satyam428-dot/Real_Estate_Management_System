package com.estate.controllers;

import com.estate.dtos.BlogPostRequestDTO;
import com.estate.dtos.BlogPostResponseDTO;
import com.estate.service.BlogPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/blogs")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BlogPostController {

    private final BlogPostService blogPostService;

    @GetMapping
    public ResponseEntity<List<BlogPostResponseDTO>> getAllPublishedBlogs(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(blogPostService.getAllPublishedBlogs(category, search));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<BlogPostResponseDTO>> getAllBlogsAdmin() {
        return ResponseEntity.ok(blogPostService.getAllBlogsAdmin());
    }

    @GetMapping("/featured")
    public ResponseEntity<BlogPostResponseDTO> getFeaturedBlog() {
        BlogPostResponseDTO featured = blogPostService.getFeaturedBlog();
        if (featured == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(featured);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(blogPostService.getCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogPostResponseDTO> getBlogById(@PathVariable Long id) {
        return ResponseEntity.ok(blogPostService.getBlogById(id));
    }

    @PostMapping
    public ResponseEntity<BlogPostResponseDTO> createBlog(@Valid @RequestBody BlogPostRequestDTO requestDTO) {
        BlogPostResponseDTO created = blogPostService.createBlog(requestDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogPostResponseDTO> updateBlog(
            @PathVariable Long id,
            @Valid @RequestBody BlogPostRequestDTO requestDTO) {
        return ResponseEntity.ok(blogPostService.updateBlog(id, requestDTO));
    }

    @PatchMapping("/{id}/featured")
    public ResponseEntity<BlogPostResponseDTO> toggleFeatured(@PathVariable Long id) {
        return ResponseEntity.ok(blogPostService.toggleFeatured(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBlog(@PathVariable Long id) {
        blogPostService.deleteBlog(id);
        return ResponseEntity.ok(Map.of("message", "Blog post deleted successfully"));
    }

    @PostMapping("/seed")
    public ResponseEntity<Map<String, String>> seedBlogs() {
        blogPostService.seedInitialBlogsIfEmpty();
        return ResponseEntity.ok(Map.of("message", "Initial blogs seeded successfully if table was empty"));
    }
}
