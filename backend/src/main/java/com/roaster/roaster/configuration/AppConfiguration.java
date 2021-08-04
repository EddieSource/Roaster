package com.roaster.roaster.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix="roaster")
@Data
public class AppConfiguration {
	
	String uploadPath;
	
	String profileImagesFolder = "profile"; 
	
	String attachmentsFolder = "attachment"; 
	
	public String getFullProfileImagesPath() {
		return this.uploadPath + "/" + this.profileImagesFolder; 
	}
	public String getFullAttachmentsPath() {
		return this.uploadPath + "/" + this.attachmentsFolder;
	} 
	
}
