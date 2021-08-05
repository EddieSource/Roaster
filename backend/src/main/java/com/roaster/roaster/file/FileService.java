package com.roaster.roaster.file;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

import org.apache.commons.io.FileUtils;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;

import com.roaster.roaster.configuration.AppConfiguration;

@Service
public class FileService {
	
	AppConfiguration appConfiguration; 
	
	// to detect the file(byte arr) type
	Tika tika; 
	
	public FileService(AppConfiguration appConfiguration) {
		super();
		this.appConfiguration = appConfiguration;
		tika = new Tika(); 
	}
	
	public String saveProfileImage(String base64Image) throws IOException {
		String imageName = getRandomName();
		// decode the string to byte array to store byte to target file
		byte[] decodedBytes = Base64.getDecoder().decode(base64Image);
		File target = new File(appConfiguration.getFullProfileImagesPath() + "/" + imageName);
		FileUtils.writeByteArrayToFile(target, decodedBytes);
		return imageName;
	}
	
	private String getRandomName() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}

	public String detectType(byte[] fileArr) {
		Tika tika = new Tika(); 
		return tika.detect(fileArr); 
	}

	public void deleteProfileImage(String image) {
		try {
			Files.deleteIfExists(Paths.get(appConfiguration.getFullProfileImagesPath()+"/"+image)); 
		}
		catch (IOException e) {
			e.printStackTrace();
		}
		
		
		
	}
}
