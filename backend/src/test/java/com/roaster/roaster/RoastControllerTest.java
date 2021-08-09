package com.roaster.roaster;


import static org.assertj.core.api.Assertions.assertThat;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;

import org.apache.commons.io.FileUtils;
import org.junit.FixMethodOrder;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.multipart.MultipartFile;

import com.roaster.roaster.configuration.AppConfiguration;
import com.roaster.roaster.error.ApiError;
import com.roaster.roaster.file.FileAttachment;
import com.roaster.roaster.file.FileAttachmentRepository;
import com.roaster.roaster.file.FileService;
import com.roaster.roaster.roast.Roast;
import com.roaster.roaster.roast.RoastRepository;
import com.roaster.roaster.roast.RoastService;
import com.roaster.roaster.roast.vm.RoastVM;
import com.roaster.roaster.user.User;
import com.roaster.roaster.user.UserRepository;
import com.roaster.roaster.user.UserService;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")	// define the profile to run in a controlled environment
public class RoastControllerTest {
	private static final String API_1_0_ROASTS = "/api/1.0/roasts";

	@Autowired
	TestRestTemplate testRestTemplate; 

	@Autowired
	UserService userService;
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	RoastRepository roastRepository;
	
	@Autowired
	RoastService roastService; 
	
	@Autowired
	FileAttachmentRepository fileAttachmentRepository; 
	
	@Autowired
	FileService fileService; 
	
	@Autowired
	AppConfiguration appConfiguration; 
	
	@PersistenceUnit
	private EntityManagerFactory entityManagerFactory; 
	
	@BeforeEach
	public void cleanup() throws IOException {
		fileAttachmentRepository.deleteAll();
		roastRepository.deleteAll();
		userRepository.deleteAll(); 	// delete all entries of users in database
		testRestTemplate.getRestTemplate().getInterceptors().clear();
		FileUtils.cleanDirectory(new File(appConfiguration.getFullAttachmentsPath()));
	}
	
	@Test
	public void postRoast_whenRoastIsValidAndUserIsAuthorized_receiveOk() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		Roast roast = TestUtil.createValidRoast(); 
		ResponseEntity<Object> response = postRoast(roast, Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	

	@Test
	public void postRoast_whenRoastIsValidAndUserIsUnauthorized_receiveUnauthorized() {
		Roast roast = TestUtil.createValidRoast();
		ResponseEntity<Object> response = postRoast(roast, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
	}
	
	@Test
	public void postRoast_whenRoastIsValidAndUserIsUnauthorized_receiveApiError() {
		Roast roast = TestUtil.createValidRoast();
		ResponseEntity<ApiError> response = postRoast(roast, ApiError.class);
		assertThat(response.getBody().getStatus()).isEqualTo(HttpStatus.UNAUTHORIZED.value());
	}
	
	@Test
	public void postRoast_whenRoastIsValidAndUserIsAuthorized_roastSavedToDatabase() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		Roast roast = TestUtil.createValidRoast();
		postRoast(roast, Object.class);
		
		assertThat(roastRepository.count()).isEqualTo(1);
	}
	
	@Test
	public void postRoast_whenRoastIsValidAndUserIsAuthorized_roastSavedToDatabaseWithTimestamp() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		Roast roast = TestUtil.createValidRoast();
		postRoast(roast, Object.class);
		
		Roast inDB = roastRepository.findAll().get(0);
		
		assertThat(inDB.getTimestamp()).isNotNull();
	}
	
	@Test
	public void postRoast_whenRoastContentNullAndUserIsAuthorized_receiveBadRequest() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		Roast roast = new Roast();
		ResponseEntity<Object> response = postRoast(roast, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	

	@Test
	public void postRoast_whenRoastContentLessThan10CharactersAndUserIsAuthorized_receiveBadRequest() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		Roast roast = new Roast();
		roast.setContent("123456789");
		ResponseEntity<Object> response = postRoast(roast, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	
	@Test
	public void postRoast_whenRoastContentIs5000CharactersAndUserIsAuthorized_receiveOk() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		Roast roast = new Roast();
		String veryLongString = IntStream.rangeClosed(1, 5000).mapToObj(i -> "x").collect(Collectors.joining());
		roast.setContent(veryLongString);
		ResponseEntity<Object> response = postRoast(roast, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	
	@Test
	public void postRoast_whenRoastContentMoreThan5000CharactersAndUserIsAuthorized_receiveBadRequest() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		Roast roast = new Roast();
		String veryLongString = IntStream.rangeClosed(1, 5001).mapToObj(i -> "x").collect(Collectors.joining());
		roast.setContent(veryLongString);
		ResponseEntity<Object> response = postRoast(roast, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	
	@Test
	public void postRoast_whenRoastContentNullAndUserIsAuthorized_receiveApiErrorWithValidationErrors() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		Roast roast = new Roast();
		ResponseEntity<ApiError> response = postRoast(roast, ApiError.class);
		Map<String, String> validationErrors = response.getBody().getValidationErrors();
		assertThat(validationErrors.get("content")).isNotNull();
	}
	
	@Test
	public void postRoast_whenRoastIsValidAndUserIsAuthorized_roastSavedWithAuthenticatedUserInfo() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		Roast roast = TestUtil.createValidRoast();
		postRoast(roast, Object.class);
		
		Roast inDB = roastRepository.findAll().get(0);
		
		assertThat(inDB.getUser().getUsername()).isEqualTo("user1");
	}
	
	@Test
	public void postRoast_whenRoastIsValidAndUserIsAuthorized_roastCanBeAccessedFromUserEntity() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		Roast roast = TestUtil.createValidRoast();
		postRoast(roast, Object.class);
		
		EntityManager entityManager = entityManagerFactory.createEntityManager();
		
		User inDBUser = entityManager.find(User.class, user.getId());
		assertThat(inDBUser.getRoasts().size()).isEqualTo(1);
		
	}
	
	@Test
	public void postRoast_whenRoastIsValidAndUserIsAuthorized_receiveRoastVM() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		Roast roast = TestUtil.createValidRoast();
		ResponseEntity<RoastVM> response = postRoast(roast, RoastVM.class);
		assertThat(response.getBody().getUser().getUsername()).isEqualTo("user1");
	}
	
	@Test
	public void postRoast_whenRoastHasFileAttachmentAndUserIsAuthorized_fileAttachmentRoastRelationIsUpdatedInDatabase() throws IOException {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		
		MultipartFile file = createFile();
		
		FileAttachment savedFile = fileService.saveAttachment(file);
		
		Roast roast = TestUtil.createValidRoast();
		roast.setAttachment(savedFile);
		ResponseEntity<RoastVM> response = postRoast(roast, RoastVM.class);
		
		FileAttachment inDB = fileAttachmentRepository.findAll().get(0);
		assertThat(inDB.getRoast().getId()).isEqualTo(response.getBody().getId());
	}

	@Test
	public void postRoast_whenRoastHasFileAttachmentAndUserIsAuthorized_roastFileAttachmentRelationIsUpdatedInDatabase() throws IOException {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		
		MultipartFile file = createFile();
		
		FileAttachment savedFile = fileService.saveAttachment(file);
		
		Roast roast = TestUtil.createValidRoast();
		roast.setAttachment(savedFile);
		ResponseEntity<RoastVM> response = postRoast(roast, RoastVM.class);
		
		Roast inDB = roastRepository.findById(response.getBody().getId()).get();
		assertThat(inDB.getAttachment().getId()).isEqualTo(savedFile.getId());
	}

	@Test
	public void postRoast_whenRoastHasFileAttachmentAndUserIsAuthorized_receiveRoastVMWithAttachment() throws IOException {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		
		MultipartFile file = createFile();
		
		FileAttachment savedFile = fileService.saveAttachment(file);
		
		Roast roast = TestUtil.createValidRoast();
		roast.setAttachment(savedFile);
		ResponseEntity<RoastVM> response = postRoast(roast, RoastVM.class);
		
		assertThat(response.getBody().getAttachment().getName()).isEqualTo(savedFile.getName());
	}

	private MultipartFile createFile() throws IOException {
		ClassPathResource imageResource = new ClassPathResource("profile.png");
		byte[] fileAsByte = FileUtils.readFileToByteArray(imageResource.getFile());
		
		MultipartFile file = new MockMultipartFile("profile.png", fileAsByte);
		return file;
	}

	
	@Test
	public void getRoasts_whenThereAreNoRoasts_receiveOk() {
		ResponseEntity<Object> response = getRoasts(new ParameterizedTypeReference<Object>() {});
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	@Test
	public void getRoasts_whenThereAreNoRoasts_receivePageWithZeroItems() {
		ResponseEntity<TestPage<Object>> response = getRoasts(new ParameterizedTypeReference<TestPage<Object>>() {});
		assertThat(response.getBody().getTotalElements()).isEqualTo(0);
	}

	@Test
	public void getRoasts_whenThereAreRoasts_receivePageWithItems() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		
		ResponseEntity<TestPage<Object>> response = getRoasts(new ParameterizedTypeReference<TestPage<Object>>() {});
		assertThat(response.getBody().getTotalElements()).isEqualTo(3);
	}
	
	@Test
	public void getRoasts_whenThereAreRoasts_receivePageWithRoastVM() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		roastService.save(user, TestUtil.createValidRoast());
		
		ResponseEntity<TestPage<RoastVM>> response = getRoasts(new ParameterizedTypeReference<TestPage<RoastVM>>() {});
		RoastVM storedRoast = response.getBody().getContent().get(0);
		assertThat(storedRoast.getUser().getUsername()).isEqualTo("user1");
	}

	@Test
	public void getRoastsOfUser_whenUserExists_receiveOk() {
		userService.save(TestUtil.createValidUser("user1"));
		ResponseEntity<Object> response = getRoastsOfUser("user1", new ParameterizedTypeReference<Object>() {});
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	@Test
	public void getRoastsOfUser_whenUserDoesNotExist_receiveNotFound() {
		ResponseEntity<Object> response = getRoastsOfUser("unknown-user", new ParameterizedTypeReference<Object>() {});
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
	}
	
	
	@Test
	public void getRoastsOfUser_whenUserExists_receivePageWithZeroRoasts() {
		userService.save(TestUtil.createValidUser("user1"));
		ResponseEntity<TestPage<Object>> response = getRoastsOfUser("user1", new ParameterizedTypeReference<TestPage<Object>>() {});
		assertThat(response.getBody().getTotalElements()).isEqualTo(0);
	}
	
	@Test
	public void getRoastsOfUser_whenUserExistWithRoast_receivePageWithRoastVM() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		roastService.save(user, TestUtil.createValidRoast());
		
		ResponseEntity<TestPage<RoastVM>> response = getRoastsOfUser("user1", new ParameterizedTypeReference<TestPage<RoastVM>>() {});
		RoastVM storedRoast = response.getBody().getContent().get(0);
		assertThat(storedRoast.getUser().getUsername()).isEqualTo("user1");
	}
	
	@Test
	public void getRoastsOfUser_whenUserExistWithMultipleRoasts_receivePageWithMatchingRoastsCount() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		
		ResponseEntity<TestPage<RoastVM>> response = getRoastsOfUser("user1", new ParameterizedTypeReference<TestPage<RoastVM>>() {});
		assertThat(response.getBody().getTotalElements()).isEqualTo(3);
	}
	
	@Test
	public void getRoastsOfUser_whenMultipleUserExistWithMultipleRoasts_receivePageWithMatchingRoastsCount() {
		User userWithThreeRoasts = userService.save(TestUtil.createValidUser("user1"));
		IntStream.rangeClosed(1, 3).forEach(i -> {
			roastService.save(userWithThreeRoasts, TestUtil.createValidRoast());	
		});
		
		User userWithFiveRoasts = userService.save(TestUtil.createValidUser("user2"));
		IntStream.rangeClosed(1, 5).forEach(i -> {
			roastService.save(userWithFiveRoasts, TestUtil.createValidRoast());	
		});
		
		
		ResponseEntity<TestPage<RoastVM>> response = getRoastsOfUser(userWithFiveRoasts.getUsername(), new ParameterizedTypeReference<TestPage<RoastVM>>() {});
		assertThat(response.getBody().getTotalElements()).isEqualTo(5);
	}

	@Test
	public void getOldRoasts_whenThereAreNoRoasts_receiveOk() {
		ResponseEntity<Object> response = getOldRoasts(5, new ParameterizedTypeReference<Object>() {});
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	@Test
	public void getOldRoasts_whenThereAreRoasts_receivePageWithItemsBeforeProvidedId() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		Roast fourth = roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		
		ResponseEntity<TestPage<Object>> response = getOldRoasts(fourth.getId(), new ParameterizedTypeReference<TestPage<Object>>() {});
		assertThat(response.getBody().getTotalElements()).isEqualTo(3);
	}
	
	@Test
	public void getOldRoasts_whenThereAreRoasts_receivePageWithRoastVMBeforeProvidedId() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		Roast fourth = roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		
		ResponseEntity<TestPage<RoastVM>> response = getOldRoasts(fourth.getId(), new ParameterizedTypeReference<TestPage<RoastVM>>() {});
		assertThat(response.getBody().getContent().get(0).getDate()).isGreaterThan(0);
	}
	
	@Test
	public void getOldRoastsOfUser_whenUserExistThereAreNoRoasts_receiveOk() {
		userService.save(TestUtil.createValidUser("user1"));
		ResponseEntity<Object> response = getOldRoastsOfUser(5, "user1", new ParameterizedTypeReference<Object>() {});
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	@Test
	public void getOldRoastsOfUser_whenUserExistAndThereAreRoasts_receivePageWithItemsBeforeProvidedId() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		Roast fourth = roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		
		ResponseEntity<TestPage<Object>> response = getOldRoastsOfUser(fourth.getId(), "user1", new ParameterizedTypeReference<TestPage<Object>>() {});
		assertThat(response.getBody().getTotalElements()).isEqualTo(3);
	}
	
	
	@Test
	public void getOldRoastsOfUser_whenUserExistAndThereAreRoasts_receivePageWithRoastVMBeforeProvidedId() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		Roast fourth = roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		
		ResponseEntity<TestPage<RoastVM>> response = getOldRoastsOfUser(fourth.getId(), "user1", new ParameterizedTypeReference<TestPage<RoastVM>>() {});
		assertThat(response.getBody().getContent().get(0).getDate()).isGreaterThan(0);
	}
	
	@Test
	public void getOldRoastsOfUser_whenUserExistAndThereAreNoRoasts_receivePageWithZeroItemsBeforeProvidedId() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		Roast fourth = roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		
		userService.save(TestUtil.createValidUser("user2"));
		
		ResponseEntity<TestPage<RoastVM>> response = getOldRoastsOfUser(fourth.getId(), "user2", new ParameterizedTypeReference<TestPage<RoastVM>>() {});
		assertThat(response.getBody().getTotalElements()).isEqualTo(0);
	}
	
	@Test
	public void getOldRoastsOfUser_whenUserDoesNotExistThereAreNoRoasts_receiveNotFound() {
		ResponseEntity<Object> response = getOldRoastsOfUser(5, "user1", new ParameterizedTypeReference<Object>() {});
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
	}
	
	@Test
	public void getNewRoasts_whenThereAreRoasts_receiveListOfItemsAfterProvidedId() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		Roast fourth = roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		
		ResponseEntity<List<Object>> response = getNewRoasts(fourth.getId(), new ParameterizedTypeReference<List<Object>>() {});
		assertThat(response.getBody().size()).isEqualTo(1);
	}

	@Test
	public void getNewRoasts_whenThereAreRoasts_receiveListOfRoastVMAfterProvidedId() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		Roast fourth = roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		
		ResponseEntity<List<RoastVM>> response = getNewRoasts(fourth.getId(), new ParameterizedTypeReference<List<RoastVM>>() {});
		assertThat(response.getBody().get(0).getDate()).isGreaterThan(0);
	}
	
	@Test
	public void getNewRoastsOfUser_whenUserExistThereAreNoRoasts_receiveOk() {
		userService.save(TestUtil.createValidUser("user1"));
		ResponseEntity<Object> response = getNewRoastsOfUser(5, "user1", new ParameterizedTypeReference<Object>() {});
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	@Test
	public void getNewRoastsOfUser_whenUserExistAndThereAreRoasts_receiveListWithItemsAfterProvidedId() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		Roast fourth = roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		
		ResponseEntity<List<Object>> response = getNewRoastsOfUser(fourth.getId(), "user1", new ParameterizedTypeReference<List<Object>>() {});
		assertThat(response.getBody().size()).isEqualTo(1);
	}
	
	@Test
	public void getNewRoastsOfUser_whenUserExistAndThereAreRoasts_receiveListWithRoastVMAfterProvidedId() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		Roast fourth = roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		
		ResponseEntity<List<RoastVM>> response = getNewRoastsOfUser(fourth.getId(), "user1", new ParameterizedTypeReference<List<RoastVM>>() {});
		assertThat(response.getBody().get(0).getDate()).isGreaterThan(0);
	}
	

	@Test
	public void getNewRoastsOfUser_whenUserDoesNotExistThereAreNoRoasts_receiveNotFound() {
		ResponseEntity<Object> response = getNewRoastsOfUser(5, "user1", new ParameterizedTypeReference<Object>() {});
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
	}

	@Test
	public void getNewRoastsOfUser_whenUserExistAndThereAreNoRoasts_receiveListWithZeroItemsAfterProvidedId() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		Roast fourth = roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		
		userService.save(TestUtil.createValidUser("user2"));
		
		ResponseEntity<List<RoastVM>> response = getNewRoastsOfUser(fourth.getId(), "user2", new ParameterizedTypeReference<List<RoastVM>>() {});
		assertThat(response.getBody().size()).isEqualTo(0);
	}

	@Test
	public void getNewRoastCount_whenThereAreRoasts_receiveCountAfterProvidedId() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		Roast fourth = roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		
		ResponseEntity<Map<String, Long>> response = getNewRoastCount(fourth.getId(), new ParameterizedTypeReference<Map<String, Long>>() {});
		assertThat(response.getBody().get("count")).isEqualTo(1);
	}


	@Test
	public void getNewRoastCountOfUser_whenThereAreRoasts_receiveCountAfterProvidedId() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		Roast fourth = roastService.save(user, TestUtil.createValidRoast());
		roastService.save(user, TestUtil.createValidRoast());
		
		ResponseEntity<Map<String, Long>> response = getNewRoastCountOfUser(fourth.getId(), "user1", new ParameterizedTypeReference<Map<String, Long>>() {});
		assertThat(response.getBody().get("count")).isEqualTo(1);
	}
	
	public <T> ResponseEntity<T> getNewRoastCount(long roastId, ParameterizedTypeReference<T> responseType){
		String path = API_1_0_ROASTS + "/" + roastId +"?direction=after&count=true";
		return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
	}
	
	public <T> ResponseEntity<T> getNewRoastCountOfUser(long roastId, String username, ParameterizedTypeReference<T> responseType){
		String path = "/api/1.0/users/" + username + "/roasts/" + roastId +"?direction=after&count=true";
		return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
	}
	
	public <T> ResponseEntity<T> getNewRoasts(long roastId, ParameterizedTypeReference<T> responseType){
		String path = API_1_0_ROASTS + "/" + roastId +"?direction=after&sort=id,desc";
		return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
	}

	public <T> ResponseEntity<T> getNewRoastsOfUser(long roastId, String username, ParameterizedTypeReference<T> responseType){
		String path = "/api/1.0/users/" + username + "/roasts/" + roastId +"?direction=after&sort=id,desc";
		return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
	}
	
	
	public <T> ResponseEntity<T> getOldRoasts(long roastId, ParameterizedTypeReference<T> responseType){
		String path = API_1_0_ROASTS + "/" + roastId +"?direction=before&page=0&size=5&sort=id,desc";
		return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
	}

	public <T> ResponseEntity<T> getOldRoastsOfUser(long roastId, String username, ParameterizedTypeReference<T> responseType){
		String path = "/api/1.0/users/" + username + "/roasts/" + roastId +"?direction=before&page=0&size=5&sort=id,desc";
		return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
	}
	
	public <T> ResponseEntity<T> getRoasts(ParameterizedTypeReference<T> responseType){
		return testRestTemplate.exchange(API_1_0_ROASTS, HttpMethod.GET, null, responseType);
	}
	
	public <T> ResponseEntity<T> getRoastsOfUser(String username, ParameterizedTypeReference<T> responseType){
		String path = "/api/1.0/users/" + username + "/roasts";
		return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
	}

	private <T> ResponseEntity<T> postRoast(Roast roast, Class<T> responseType) {
		return testRestTemplate.postForEntity(API_1_0_ROASTS, roast, responseType);
	}

	
	private void authenticate(String username) {
		testRestTemplate.getRestTemplate()
			.getInterceptors().add(new BasicAuthenticationInterceptor(username, "P4ssword"));
	}
	
	@AfterEach
	public void cleanupAfter() {
		fileAttachmentRepository.deleteAll(); 
		roastRepository.deleteAll();
	}
	
	
}
