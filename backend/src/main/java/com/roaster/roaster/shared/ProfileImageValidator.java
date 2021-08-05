package com.roaster.roaster.shared;

import java.util.Base64;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Autowired;

import com.roaster.roaster.file.FileService;

public class ProfileImageValidator implements ConstraintValidator<ProfileImage, String> {
	
	@Autowired
	FileService fileService; 
	
	@Override
	public boolean isValid(String value, ConstraintValidatorContext context) {
		if(value == null) {
			return true; 
		}
		byte[] decodeBytes = Base64.getDecoder().decode(value); 
		String fileType = fileService.detectType(decodeBytes); 
		if(fileType.equalsIgnoreCase("image/png") || fileType.equalsIgnoreCase("image/jpeg")){
			return true; 
		}
		return false;
	}

}
