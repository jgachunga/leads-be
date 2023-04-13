export function isEmailValid(email: string): boolean {
  // A regular expression for validating email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test the email address against the regular expression
  return emailRegex.test(email);
}
