package com.estate.config;

import com.estate.service.BlogPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BlogDataInitializer implements CommandLineRunner {

    private final BlogPostService blogPostService;

    @Override
    public void run(String... args) {
        try {
            blogPostService.seedInitialBlogsIfEmpty();
        } catch (Exception e) {
            System.err.println("Note: Could not auto-seed blog data at startup: " + e.getMessage());
        }
    }
}
