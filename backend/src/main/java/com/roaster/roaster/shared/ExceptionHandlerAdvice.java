package com.roaster.roaster.shared;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.roaster.roaster.error.ApiError;

@RestControllerAdvice
public class ExceptionHandlerAdvice {
	@ExceptionHandler({MethodArgumentNotValidException.class})
	@ResponseStatus(HttpStatus.BAD_REQUEST) // tell spring to return response code
	ApiError HandlerValidationException(MethodArgumentNotValidException exception, HttpServletRequest request) {
		ApiError apiError = new ApiError(400, "Validation error", request.getServletPath()); 
		
		BindingResult result = exception.getBindingResult(); 
		Map<String, String> validationErrors = new HashMap<>();
		// map each field error to an error message
		for(FieldError fieldError: result.getFieldErrors()) {
			validationErrors.put(fieldError.getField(), fieldError.getDefaultMessage()); 
		}
		apiError.setValidationErrors(validationErrors);		
		
		return apiError; 
	}
}
