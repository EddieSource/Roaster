package com.roaster.roaster.file;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/1.0")
@CrossOrigin(origins = "http://localhost:3000")
public class FileUploadController {

	@PostMapping("/roasts/upload")
	void uploadForRoast() {
		
	}
}
