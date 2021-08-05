package com.roaster.roaster.user.vm;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.roaster.roaster.shared.ProfileImage;

import lombok.Data;

@Data
public class UserUpdateVM {
	// no need to pass password to server for info update, use this class instead
	
	@NotNull
	@Size(min=4, max=255)
	private String displayName; 
	
	@ProfileImage
	private String image;
}
