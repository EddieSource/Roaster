package com.roaster.roaster.shared;

import java.lang.annotation.Target;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

import javax.validation.Constraint;
import javax.validation.Payload;

@Constraint(validatedBy = ProfileImageValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ProfileImage {
	String message() default "{roaster.constraints.image.ProfileImage.message}";

	Class<?>[] groups() default { };

	Class<? extends Payload>[] payload() default { };
}
