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
			String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "img.jpg";
			return new UploadResult("properties/" + propertyId + "/" + originalFilename, "mock_property_public_id");
		}

		Map<?, ?> response = cloudinary().uploader().upload(file.getBytes(), ObjectUtils.asMap(
				"folder", "real_estate_management/properties/property_" + propertyId,
				"resource_type", "image"));
		return new UploadResult((String) response.get("secure_url"), (String) response.get("public_id"));
	}

	public UploadResult uploadVerificationFile(MultipartFile file, Long ownerId, String subFolder) throws IOException {
		if (cloudName.isBlank() || apiKey.isBlank() || apiSecret.isBlank()) {
			String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "doc.jpg";
			return new UploadResult("verifications/" + subFolder + "/owner" + ownerId + "_" + originalFilename, "mock_verif_public_id");
		}

		Map<?, ?> response = cloudinary().uploader().upload(file.getBytes(), ObjectUtils.asMap(
				"folder", "real_estate_management/owner_verifications/owner_" + ownerId + "/" + subFolder,
				"resource_type", "auto"));
		return new UploadResult((String) response.get("secure_url"), (String) response.get("public_id"));
	}

	public UploadResult uploadPropertyDoc(MultipartFile file, Long propertyId, String docType) throws IOException {
		if (cloudName.isBlank() || apiKey.isBlank() || apiSecret.isBlank()) {
			String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "doc.jpg";
			return new UploadResult("properties/" + propertyId + "/docs/" + docType + "_" + originalFilename, "mock_prop_doc_public_id");
		}

		Map<?, ?> response = cloudinary().uploader().upload(file.getBytes(), ObjectUtils.asMap(
				"folder", "real_estate_management/properties/property_" + propertyId + "/docs/" + docType,
				"resource_type", "auto"));
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
