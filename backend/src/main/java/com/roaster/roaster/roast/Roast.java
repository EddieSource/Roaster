package com.roaster.roaster.roast;

import java.util.Date;
import java.util.function.IntPredicate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.roaster.roaster.file.FileAttachment;
import com.roaster.roaster.user.User;

import lombok.Data;

@Data
@Entity
public class Roast {
	@Id
	@GeneratedValue
	private long id; 
	
	@NotNull
	@Size(min = 10, max = 5000)
	@Column(length = 5000)
	private String content;
	
	@Temporal(TemporalType.TIMESTAMP)
	private Date timestamp; 
	
	@ManyToOne
	private User user; 

	@OneToOne(mappedBy="roast", orphanRemoval = true)	// whenever the roast is deleted, the attachment will also be removed
	private FileAttachment attachment; 
	
}
