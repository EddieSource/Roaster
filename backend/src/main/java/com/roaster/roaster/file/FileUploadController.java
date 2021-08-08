package com.roaster.roaster.file;

import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/1.0")
@CrossOrigin(origins = "http://localhost:3000")
public class FileUploadController {
	
	@Autowired
	FileService fileService; 
	
	@PostMapping("/roasts/upload")
	FileAttachment uploadForRoast(MultipartFile file) {
		return fileService.saveAttachment(file); 
	}
}
