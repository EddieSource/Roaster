package com.roaster.roaster.roast;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.roaster.roaster.user.User;

public interface RoastRepository extends JpaRepository<Roast, Long>, JpaSpecificationExecutor<Roast>{
	Page<Roast> findByUser(User user, Pageable pageable);
	
}
