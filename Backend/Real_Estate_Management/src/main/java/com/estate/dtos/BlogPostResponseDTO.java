package com.estate.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostResponseDTO {

    private long id;
    private String title;
    private String slug;
    private String category;
    private String excerpt;
    private String content;
    private String author;
    private String imageUrl;
    private boolean featured;
    private boolean published;
    private Integer readTime;
    private LocalDate createdOn;
}
