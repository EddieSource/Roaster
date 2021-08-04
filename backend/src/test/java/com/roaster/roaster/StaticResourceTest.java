package com.roaster.roaster;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.File;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.ActiveProfiles;

import com.roaster.roaster.configuration.AppConfiguration;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@AutoConfigureMockMvc
public class StaticResourceTest {
	
	@Autowired
	AppConfiguration appConfiguration; 
	
	@Test
	public void checkStaticFolder_whenAppIsInitialized_uploadFolderMustExist() {
		File uploadFolder = new File(appConfiguration.getUploadPath());
		boolean uploadFolderExist = uploadFolder.exists() && uploadFolder.isDirectory();
		assertThat(uploadFolderExist).isTrue();
	}

	@Test
	public void checkStaticFolder_whenAppIsInitialized_profileImageSubFolderMustExist() {
		String profileImageFolderPath = appConfiguration.getFullProfileImagesPath();
		File profileImageFolder = new File(profileImageFolderPath);
		boolean profileImageFolderExist = profileImageFolder.exists() && profileImageFolder.isDirectory();
		assertThat(profileImageFolderExist).isTrue();
	}
	
	@Test
	public void checkStaticFolder_whenAppIsInitialized_attachmentsSubFolderMustExist() {
		String attachmentsFolderPath = appConfiguration.getFullAttachmentsPath();
		File attachmentsFolder = new File(attachmentsFolderPath);
		boolean attachmentsFolderExist = attachmentsFolder.exists() && attachmentsFolder.isDirectory();
		assertThat(attachmentsFolderExist).isTrue();
		
	}
	
}
