package com.estate.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "blog_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class BlogPost extends BaseClass {

    @Column(nullable = false, length = 255)
    private String title;

    @Column(length = 255)
    private String slug;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(length = 500)
    private String excerpt;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String content;

    @Column(length = 100)
    private String author;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean featured = false;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private boolean published = true;

    @Column(name = "read_time")
    private Integer readTime = 5;
}
