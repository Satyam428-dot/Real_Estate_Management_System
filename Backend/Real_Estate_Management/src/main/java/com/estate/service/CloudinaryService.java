package com.estate.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {

	@Value("${cloudinary.cloud-name:}")
	private String cloudName;

	@Value("${cloudinary.api-key:}")
	private String apiKey;

	@Value("${cloudinary.api-secret:}")
	private String apiSecret;

	public UploadResult uploadPropertyImage(MultipartFile file, Long propertyId) throws IOException {
		if (cloudName.isBlank() || apiKey.isBlank() || apiSecret.isBlank()) {
			throw new IllegalStateException("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
		}

		Map<?, ?> response = cloudinary().uploader().upload(file.getBytes(), ObjectUtils.asMap(
				"folder", "real-estate/properties/" + propertyId,
				"resource_type", "image"));
		return new UploadResult((String) response.get("secure_url"), (String) response.get("public_id"));
	}

	public void deleteImage(String publicId) throws IOException {
		if (!cloudName.isBlank() && !apiKey.isBlank() && !apiSecret.isBlank()) {
			cloudinary().uploader().destroy(publicId, ObjectUtils.emptyMap());
		}
	}

	private Cloudinary cloudinary() {
		return new Cloudinary(ObjectUtils.asMap("cloud_name", cloudName, "api_key", apiKey,
				"api_secret", apiSecret, "secure", true));
	}

	public record UploadResult(String secureUrl, String publicId) {
	}
}
