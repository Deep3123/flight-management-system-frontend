package com.flight.management.proxy;

import java.util.Date;
import org.hibernate.validator.constraints.Range;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProxy {
//	@NotNull(message = "ID cannot be null.")
	private Long id;

	@NotBlank(message = "Name cannot be null.")
	@Pattern(regexp = "^[A-Za-z\\s-]+$", message = "Name can only contain alphabets, spaces, and hyphens.")
	private String name;

	@NotBlank(message = "Email-ID cannot be null.")
	@Email(regexp = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$", flags = Pattern.Flag.CASE_INSENSITIVE)
	private String emailId;

	@NotNull(message = "MobileNo cannot be null.")
	@Range(max = 9999999999L, min = 1000000000L, message = "Mobile number must be 10 digit valid number.")
	private Long mobileNo;

	@NotBlank(message = "Username cannot be null.")
	@Pattern(regexp = "^[A-Za-z0-9_]{3,15}$", message = "Username must be between 3 and 15 characters, and can only contain letters, numbers, and underscores.")
	private String username;

	@NotBlank(message = "Password cannot be null.")
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={};:'\",.<>?/\\[\\]]).{8,}$", message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character. Minimum length is 8 characters.")
	private String password;

//	@NotBlank(message = "Role cannot be null.")
	@Pattern(regexp = "^(ADMIN|USER|GUEST)$", message = "Role must be one of: ADMIN, USER, GUEST.")
	private String role = "USER";

	@Past(message = "Created date cannot be in the future.")
	private Date createdAt;

	@PastOrPresent(message = "Updated date cannot be in the future.")
	private Date updatedAt;
}
