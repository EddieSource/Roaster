package com.roaster.roaster;


import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.test.context.ActiveProfiles;

import com.roaster.roaster.error.ApiError;
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
	
	@PersistenceUnit
	private EntityManagerFactory entityManagerFactory; 
	
	@BeforeEach
	public void cleanup() {
		roastRepository.deleteAll();
		userRepository.deleteAll(); 	// delete all entries of users in database
		testRestTemplate.getRestTemplate().getInterceptors().clear();
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

	
	public <T> ResponseEntity<T> getRoasts(ParameterizedTypeReference<T> responseType){
		return testRestTemplate.exchange(API_1_0_ROASTS, HttpMethod.GET, null, responseType);
	}
	
	private <T> ResponseEntity<T> postRoast(Roast roast, Class<T> responseType) {
		return testRestTemplate.postForEntity(API_1_0_ROASTS, roast, responseType);
	}
	
	private void authenticate(String username) {
		testRestTemplate.getRestTemplate()
			.getInterceptors().add(new BasicAuthenticationInterceptor(username, "P4ssword"));
	}
	
	
}
