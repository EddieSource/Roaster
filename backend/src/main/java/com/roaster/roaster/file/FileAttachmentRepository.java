package com.roaster.roaster.file;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FileAttachmentRepository extends JpaRepository<FileAttachment, Long>{
	List<FileAttachment> findByDateBeforeAndRoastIsNull(Date date);
}
