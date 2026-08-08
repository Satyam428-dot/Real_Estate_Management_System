package com.estate.repository;

import com.estate.entities.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {

    List<BlogPost> findByPublishedTrueOrderByCreatedOnDesc();

    List<BlogPost> findByPublishedTrueOrderByIdDesc();

    List<BlogPost> findByCategoryAndPublishedTrueOrderByIdDesc(String category);

    Optional<BlogPost> findFirstByFeaturedTrueAndPublishedTrueOrderByIdDesc();

    List<BlogPost> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseOrCategoryContainingIgnoreCaseAndPublishedTrue(
            String title, String content, String category);

    @Query("SELECT DISTINCT b.category FROM BlogPost b WHERE b.published = true")
    List<String> findDistinctCategories();
}
