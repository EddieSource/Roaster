package com.roaster.roaster.user;

import java.beans.Transient;
import java.util.Collection;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.roaster.roaster.roast.Roast;

import lombok.Data;

@Entity
@Data	//create template for setters,getters,equal,hashcode
//@Table(uniqueConstraints = @UniqueConstraint(columnNames = "username"))
// one user can have multiple roles in terms of 
public class User implements UserDetails {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -609347966617943881L;

	@Id
	@GeneratedValue
	private long id; 
	
	// set constraint
	@NotNull(message = "{roaster.constraints.username.NotNull.message}")
	@Size(min = 4, max=255)
	@UniqueUsername
	private String username; 
	
	@NotNull
	@Size(min = 4, max=255)
	private String displayName; 
	
	@NotNull(message = "{roaster.constraints.password.NotNull.message}")
	@Size(min = 8, max=255)
	private String password;
	
	private String image; 
	
	@OneToMany(mappedBy = "user", fetch=FetchType.EAGER)
	private List<Roast> roasts; 
	
	@Override
	@Transient
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return AuthorityUtils.createAuthorityList("Role_User");
	}

	@Override
	@Transient
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	@Transient
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	@Transient
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	@Transient
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	} 
}
