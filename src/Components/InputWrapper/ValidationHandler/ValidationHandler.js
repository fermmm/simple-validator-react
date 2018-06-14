export default class ValidationHandler {
  validator;
  lastValidationResult;
  errorBeingShowed = false;
  userTyped = false;
  underlineBeingShowed = false;
  showErrorWhileTyping = false;
  showErrorOnMount = false;

  constructor(validatorProp, startingText) {
    this.validator = validatorProp;

    if (this.validator == null) {
      return;
    }

    // Validate the starting value and only store the validation to always have a validation result available.
    this.validate(startingText);
  }

  validate(text) {
    if (this.validator == null) {
      return;
    }

    const validationResult = this.validator(text).result;
    this.lastValidationResult = validationResult;
  }

  /**
   * Called when the user types.
   * @param {string} text
   */
  getAutocorrectedText(text) {
    if (this.validator == null) return text;
    this.userTyped = true;
    this.validate(text);
    return this.lastValidationResult.text; // Autocorrected version of the text
  }

  getTextToRender(isFocused, language = "en") {
    if (this.validator == null) return null;
    if (!this.userTyped && !this.showErrorOnMount) return null;

    if (this.lastValidationResult.isValid || this.lastValidationResult.errors.length === 0) {
      this.errorBeingShowed = false;
      return null;
    };

    // Don't show errors while typing to not scare the user, unless there is an error previously being showed.
    if (isFocused && this.errorBeingShowed === false && !this.showErrorWhileTyping) return null;

    this.errorBeingShowed = true;

    return this.upperCase(this.lastValidationResult.errors[0].description[language]);
  }

  getErrorCharacters(isFocused) {
    if (this.validator == null) return null;
    if (!this.userTyped && !this.showErrorOnMount) return null;
    if (this.lastValidationResult.isValid || this.lastValidationResult.errors.length === 0) {
      this.underlineBeingShowed = false;
      return null;
    };

    // Don't show underline while typing to not confuse the user, unless there is an error previously being showed.
    if (isFocused && this.underlineBeingShowed === false && !this.showErrorWhileTyping) return null;

    this.underlineBeingShowed = true;
    return this.lastValidationResult.errors[0].locations;
  }

  upperCase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}