package com.roaster.roaster.roast;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.roaster.roaster.file.FileAttachment;
import com.roaster.roaster.file.FileAttachmentRepository;
import com.roaster.roaster.user.User;
import com.roaster.roaster.user.UserService;

@Service
public class RoastService {
	RoastRepository roastRepository;
	UserService userService; 
	FileAttachmentRepository fileAttachmentRepository; 
	
	public RoastService(RoastRepository roastRepository, UserService userService, FileAttachmentRepository fileAttachmentRepository) {
		super();
		this.roastRepository = roastRepository;
		this.userService = userService; 
		this.fileAttachmentRepository = fileAttachmentRepository; 
	} 
	
	public Roast save(User user, Roast roast) {
		roast.setTimestamp(new Date());
		roast.setUser(user);
		if(roast.getAttachment() != null) {
			FileAttachment inDB = fileAttachmentRepository.findById(roast.getAttachment().getId()).get(); 
			inDB.setRoast(roast);
			roast.setAttachment(inDB);
		}
		return roastRepository.save(roast); 
	}

	public Page<Roast> getAllRoasts(Pageable pageable) {
		return roastRepository.findAll(pageable);
	}

	public Page<Roast> getRoastsOfUser(String username, Pageable pageable) {
		User inDB = userService.getByUsername(username); 
		return roastRepository.findByUser(inDB, pageable); 
	}

	public Page<Roast> getOldRoasts(long id, String username, Pageable pageable) {
		Specification<Roast> spec = Specification.where(idLessThan(id));
		if(username != null) {			
			User inDB = userService.getByUsername(username);
			spec = spec.and(userIs(inDB)); // combine specifications
		}
		return roastRepository.findAll(spec, pageable);
	}


	public List<Roast> getNewRoasts(long id, String username, Pageable pageable) {
		Specification<Roast> spec = Specification.where(idGreaterThan(id));
		if(username != null) {			
			User inDB = userService.getByUsername(username);
			spec = spec.and(userIs(inDB));
		}
		return roastRepository.findAll(spec, pageable.getSort());
	}

	public long getNewRoastsCount(long id, String username) {
		Specification<Roast> spec = Specification.where(idGreaterThan(id));
		if(username != null) {			
			User inDB = userService.getByUsername(username);
			spec = spec.and(userIs(inDB));
		}
		return roastRepository.count(spec);
	}

	private Specification<Roast> userIs(User user){
		return (root, query, criteriaBuilder) -> {
			return criteriaBuilder.equal(root.get("user"), user);
		};
	}

	private Specification<Roast> idLessThan(long id){
		return (root, query, criteriaBuilder) -> {
			return criteriaBuilder.lessThan(root.get("id"), id);
		};
	}

	private Specification<Roast> idGreaterThan(long id){
		return (root, query, criteriaBuilder) -> {
			return criteriaBuilder.greaterThan(root.get("id"), id);
		};
	}
}
