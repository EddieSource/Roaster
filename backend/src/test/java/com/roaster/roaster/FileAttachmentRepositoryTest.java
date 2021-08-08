package com.roaster.roaster;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import com.roaster.roaster.file.FileAttachment;
import com.roaster.roaster.file.FileAttachmentRepository;
import com.roaster.roaster.roast.Roast;

@DataJpaTest
@ActiveProfiles("test")
public class FileAttachmentRepositoryTest {

	@Autowired
	TestEntityManager testEntityManager;
	
	@Autowired
	FileAttachmentRepository fileAttachmentRepository;
	
	@Test
	public void findByDateBeforeAndRoastIsNull_whenAttachmentsDateOlderThanOneHour_returnsAll() {
		testEntityManager.persist(getOneHourOldFileAttachment());
		testEntityManager.persist(getOneHourOldFileAttachment());
		testEntityManager.persist(getOneHourOldFileAttachment());
		Date oneHourAgo = new Date(System.currentTimeMillis() - (60*60*1000));
		List<FileAttachment> attachments = fileAttachmentRepository.findByDateBeforeAndRoastIsNull(oneHourAgo);
		assertThat(attachments.size()).isEqualTo(3);
	}
	
	@Test
	public void findByDateBeforeAndRoastIsNull_whenAttachmentsDateOlderThanOneHorButHaveRoast_returnsNone() {
		Roast roast1 = testEntityManager.persist(TestUtil.createValidRoast());
		Roast roast2 = testEntityManager.persist(TestUtil.createValidRoast());
		Roast roast3 = testEntityManager.persist(TestUtil.createValidRoast());
		
		testEntityManager.persist(getOldFileAttachmentWithRoast(roast1));
		testEntityManager.persist(getOldFileAttachmentWithRoast(roast2));
		testEntityManager.persist(getOldFileAttachmentWithRoast(roast3));
		Date oneHourAgo = new Date(System.currentTimeMillis() - (60*60*1000));
		List<FileAttachment> attachments = fileAttachmentRepository.findByDateBeforeAndRoastIsNull(oneHourAgo);
		assertThat(attachments.size()).isEqualTo(0);
	}

	@Test
	public void findByDateBeforeAndRoastIsNull_whenAttachmentsDateWithinOneHour_returnsNone() {
		testEntityManager.persist(getFileAttachmentWithinOneHour());
		testEntityManager.persist(getFileAttachmentWithinOneHour());
		testEntityManager.persist(getFileAttachmentWithinOneHour());
		Date oneHourAgo = new Date(System.currentTimeMillis() - (60*60*1000));
		List<FileAttachment> attachments = fileAttachmentRepository.findByDateBeforeAndRoastIsNull(oneHourAgo);
		assertThat(attachments.size()).isEqualTo(0);
	}

	@Test
	public void findByDateBeforeAndRoastIsNull_whenSomeAttachmentsOldSomeNewAndSomeWithRoast_returnsAttachmentsWithOlderAndNoRoastAssigned() {
		Roast roast1 = testEntityManager.persist(TestUtil.createValidRoast());
		testEntityManager.persist(getOldFileAttachmentWithRoast(roast1));
		testEntityManager.persist(getOneHourOldFileAttachment());
		testEntityManager.persist(getFileAttachmentWithinOneHour());
		Date oneHourAgo = new Date(System.currentTimeMillis() - (60*60*1000));
		List<FileAttachment> attachments = fileAttachmentRepository.findByDateBeforeAndRoastIsNull(oneHourAgo);
		assertThat(attachments.size()).isEqualTo(1);
	}
	private FileAttachment getOneHourOldFileAttachment() {
		Date date = new Date(System.currentTimeMillis() - (60*60*1000) - 1);
		FileAttachment fileAttachment = new FileAttachment();
		fileAttachment.setDate(date);
		return fileAttachment;
	}
	private FileAttachment getFileAttachmentWithinOneHour() {
		Date date = new Date(System.currentTimeMillis() - (60*1000));
		FileAttachment fileAttachment = new FileAttachment();
		fileAttachment.setDate(date);
		return fileAttachment;
	}
	
	private FileAttachment getOldFileAttachmentWithRoast(Roast roast) {
		FileAttachment fileAttachment = getOneHourOldFileAttachment();
		fileAttachment.setRoast(roast);
		return fileAttachment;
	}
}