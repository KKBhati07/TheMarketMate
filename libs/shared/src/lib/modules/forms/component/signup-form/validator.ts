import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class PasswordValidator {

	static validate: ValidatorFn = this.passwordStrength()

	private static passwordStrength(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			let errors: ValidationErrors = {}
			if (!control.value) {
				errors["required"] = 'Password is required';
				return errors;
			}
			if (control.value.length < 5) {
				errors["shortPassword"] = 'Password must be at least 5 characters long.';
				return errors;
			}
			if (!(/\d/.test(control.value))) {
				errors["noNumber"] = 'Password must contain at least one number.';
			}
			return Object.keys(errors).length ? errors : null;
		}
	}
}
