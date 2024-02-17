export function validatePassword(password: string): boolean {
  // Combine all tests with logical AND (&&)
  return (
    password.length >= 12 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^\w\s]/.test(password)
  );
}
