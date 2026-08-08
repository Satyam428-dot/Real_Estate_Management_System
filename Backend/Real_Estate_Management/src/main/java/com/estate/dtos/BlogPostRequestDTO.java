package com.estate.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    private String slug;

    @NotBlank(message = "Category is required")
    private String category;

    private String excerpt;

    @NotBlank(message = "Content is required")
    private String content;

    private String author;

    private String imageUrl;

    private boolean featured;

    private boolean published = true;

    private Integer readTime = 5;
}
