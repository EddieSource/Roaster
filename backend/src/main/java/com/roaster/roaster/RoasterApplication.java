package com.roaster.roaster;

import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class RoasterApplication {

	public static void main(String[] args) {
		SpringApplication.run(RoasterApplication.class, args);
	}
	
	

}
