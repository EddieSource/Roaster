package com.roaster.roaster.configuration;

import java.io.File;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfiguration implements WebMvcConfigurer{
	
	@Autowired
	AppConfiguration appConfiguration; 
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/images/**")
			.addResourceLocations("file:" + appConfiguration.getUploadPath() + "/")
			.setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS));
	}
	
	@Bean
	CommandLineRunner createUploadFolder() {
		// will create the upload folder if necessary if each time the app starts
		return (args) -> {
			createdNonExistingFolder(appConfiguration.getUploadPath());
			createdNonExistingFolder(appConfiguration.getFullProfileImagesPath());
			createdNonExistingFolder(appConfiguration.getFullAttachmentsPath());
			
		}; 
	}


	private void createdNonExistingFolder(String path) {
		File folder = new File(path); 
		boolean uploadFolderExist = folder.exists() && folder.isDirectory(); 
		if(!uploadFolderExist) {
			folder.mkdir(); 
		}
	}
}
