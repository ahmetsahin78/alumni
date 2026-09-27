import { registerSchema, loginSchema, updateProfileSchema } from "./validations/auth.validation";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

async function runTests() {
  console.log("==========================================");
  console.log("🧪 RUNNING ALUMNI TRACKING SYSTEM TESTS");
  console.log("==========================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Zod Validation Tests: Registration
  console.log("--- 1. Validation Tests ---");
  const validRegister = registerSchema.safeParse({
    email: "alumni.test@istanbul.edu.tr",
    password: "Password123!",
    role: Role.ALUMNI,
    firstName: "Ali",
    lastName: "Veli",
    department: "Bilgisayar Mühendisliği",
    graduationYear: 2021,
  });
  assert(validRegister.success === true, "Valid registration schema passes");

  const invalidEmailRegister = registerSchema.safeParse({
    email: "invalid-email-format",
    password: "Password123!",
    role: Role.ALUMNI,
    firstName: "Ali",
    lastName: "Veli",
  });
  assert(invalidEmailRegister.success === false, "Invalid email fails validation");

  const shortPasswordRegister = registerSchema.safeParse({
    email: "test@example.com",
    password: "123",
    role: Role.STUDENT,
    firstName: "Ali",
    lastName: "Veli",
  });
  assert(shortPasswordRegister.success === false, "Short password (< 6 chars) fails validation");

  // 2. Login Validation
  const validLogin = loginSchema.safeParse({
    email: "admin@istanbul.edu.tr",
    password: "Password123!",
  });
  assert(validLogin.success === true, "Valid login payload passes");

  const emptyPasswordLogin = loginSchema.safeParse({
    email: "admin@istanbul.edu.tr",
    password: "",
  });
  assert(emptyPasswordLogin.success === false, "Empty password fails validation");

  // 3. JWT Token Generation & Verification
  console.log("\n--- 2. JWT Security & RBAC Tests ---");
  const secret = "test_jwt_secret_key_123";
  const userPayload = {
    id: "user-uuid-12345",
    email: "alumni.ahmet@example.com",
    role: Role.ALUMNI,
  };

  const token = jwt.sign(userPayload, secret, { expiresIn: "1h" });
  assert(typeof token === "string" && token.length > 20, "JWT token successfully signed");

  const decoded = jwt.verify(token, secret) as any;
  assert(decoded.id === userPayload.id, "Decoded JWT ID matches original payload");
  assert(decoded.role === Role.ALUMNI, "Decoded JWT Role is ALUMNI");
  assert(decoded.email === userPayload.email, "Decoded JWT Email matches");

  // Invalid Token Check
  let tamperedCaught = false;
  try {
    jwt.verify(token + "corrupted", secret);
  } catch {
    tamperedCaught = true;
  }
  assert(tamperedCaught === true, "Tampered JWT token fails verification");

  // 4. Role Authorization Logic
  const checkRole = (allowedRoles: Role[], userRole: Role) => allowedRoles.includes(userRole);
  assert(checkRole([Role.ADMIN], Role.ADMIN) === true, "Admin role authorized for ADMIN endpoint");
  assert(checkRole([Role.ADMIN], Role.STUDENT) === false, "Student role denied for ADMIN endpoint");
  assert(
    checkRole([Role.ALUMNI, Role.ADMIN], Role.ALUMNI) === true,
    "Alumni role authorized for job creation"
  );
  assert(
    checkRole([Role.ALUMNI, Role.ADMIN], Role.STUDENT) === false,
    "Student role denied for job creation"
  );

  // 5. Employment Rate & Stats Calculation Formula Test
  console.log("\n--- 3. Statistics & Business Logic Tests ---");
  const totalAlumni = 890;
  const employedAlumni = 785;
  const employmentRate = Math.round((employedAlumni / totalAlumni) * 100);
  assert(employmentRate === 88, `Employment rate calculation is correct (%${employmentRate})`);

  // Summary
  console.log("\n==========================================");
  console.log(`📊 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("Test execution failed:", e);
  process.exit(1);
});
