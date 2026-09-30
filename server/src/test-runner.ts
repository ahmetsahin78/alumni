import http from "http";
import { AddressInfo } from "net";
import app from "./index";
import { alumniStore } from "./storage/inMemoryStore";

async function runCourseAssignmentTests() {
  console.log("\n============================================================");
  console.log("🧪 TESTING ALUMNI SERVER (IN-MEMORY CRUD & SWAGGER)");
  console.log("   Ders: Web Programlama (Assoc. Prof. Dr. Emre Akadal)");
  console.log("============================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
      failed++;
    }
  }

  // Start app on an ephemeral port for testing
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as AddressInfo).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // -------------------------------------------------------------
    // Test 1: GET /api/health
    // -------------------------------------------------------------
    console.log("--- 1. Health Endpoint Tests ---");
    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert(healthRes.status === 200, "GET /api/health returns HTTP 200");
    const healthData: any = await healthRes.json();
    assert(healthData.status === "healthy", "Health status is 'healthy'");
    assert(typeof healthData.uptime === "object", "Health response includes uptime object");
    assert(typeof healthData.memory === "object", "Health response includes memory details");

    // -------------------------------------------------------------
    // Test 2: In-Memory Seed Data (GET /api/alumni & GET /api/users)
    // -------------------------------------------------------------
    console.log("\n--- 2. In-Memory Listing Tests ---");
    alumniStore.resetToDefault();

    const alumniListRes = await fetch(`${baseUrl}/api/alumni`);
    assert(alumniListRes.status === 200, "GET /api/alumni returns HTTP 200");
    const alumniList: any = await alumniListRes.json();
    assert(Array.isArray(alumniList), "GET /api/alumni returns JSON array");
    assert(alumniList.length === 4, `Initial seed has 4 records (got ${alumniList.length})`);
    assert(alumniList[0].name === "Elif Kaya", "First seed record is 'Elif Kaya'");
    assert(alumniList[0].graduationYear === 2024, "First seed graduationYear is 2024");

    // Test /api/users alias from whiteboard
    const usersListRes = await fetch(`${baseUrl}/api/users`);
    assert(usersListRes.status === 200, "GET /api/users alias returns HTTP 200");
    const usersList: any = await usersListRes.json();
    assert(usersList.length === 4, "GET /api/users returns matching records");

    // -------------------------------------------------------------
    // Test 3: POST /api/alumni (Yeni Kayıt - 201 Created)
    // -------------------------------------------------------------
    console.log("\n--- 3. Create (POST) Tests ---");
    const newAlumnus = {
      name: "Kemal Sunal",
      graduationYear: 1981,
      department: "İletişim Fakültesi",
    };

    const createRes = await fetch(`${baseUrl}/api/alumni`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAlumnus),
    });

    assert(createRes.status === 201, "POST /api/alumni returns HTTP 201 Created");
    const createdItem: any = await createRes.json();
    assert(createdItem.id === 5, `Created record ID is 5 (got ${createdItem.id})`);
    assert(createdItem.name === "Kemal Sunal", "Created record name matches");
    assert(createdItem.graduationYear === 1981, "Created record graduationYear matches");

    // Validation: Missing name
    const invalidCreate1 = await fetch(`${baseUrl}/api/alumni`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ graduationYear: 2020 }),
    });
    assert(invalidCreate1.status === 400, "POST /api/alumni without name returns HTTP 400");

    // Validation: Missing graduationYear
    const invalidCreate2 = await fetch(`${baseUrl}/api/alumni`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Ahmet" }),
    });
    assert(invalidCreate2.status === 400, "POST /api/alumni without graduationYear returns HTTP 400");

    // -------------------------------------------------------------
    // Test 4: GET /api/alumni/:id (Tekil Kayıt Getirme)
    // -------------------------------------------------------------
    console.log("\n--- 4. Single Record (GET /:id) Tests ---");
    const getSingleRes = await fetch(`${baseUrl}/api/alumni/1`);
    assert(getSingleRes.status === 200, "GET /api/alumni/1 returns HTTP 200");
    const singleItem: any = await getSingleRes.json();
    assert(singleItem.id === 1 && singleItem.name === "Elif Kaya", "Fetched single record matches ID 1");

    // Not Found
    const notFoundRes = await fetch(`${baseUrl}/api/alumni/999`);
    assert(notFoundRes.status === 404, "GET /api/alumni/999 returns HTTP 404 Not Found");

    // Invalid ID
    const badIdRes = await fetch(`${baseUrl}/api/alumni/invalid_id`);
    assert(badIdRes.status === 400, "GET /api/alumni/invalid_id returns HTTP 400 Bad Request");

    // -------------------------------------------------------------
    // Test 5: PUT /api/alumni/:id (Bütünsel Güncelleme)
    // -------------------------------------------------------------
    console.log("\n--- 5. Full Update (PUT /:id) Tests ---");
    const fullUpdatePayload = {
      name: "Elif Kaya Demir",
      graduationYear: 2025,
      department: "Yapay Zeka Mühendisliği",
      company: "DeepMind",
    };

    const putRes = await fetch(`${baseUrl}/api/alumni/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullUpdatePayload),
    });

    assert(putRes.status === 200, "PUT /api/alumni/1 returns HTTP 200 OK");
    const putUpdated: any = await putRes.json();
    assert(putUpdated.name === "Elif Kaya Demir", "PUT replaced name");
    assert(putUpdated.graduationYear === 2025, "PUT replaced graduationYear");
    assert(putUpdated.company === "DeepMind", "PUT updated company");

    // PUT missing required field -> 400
    const invalidPut = await fetch(`${baseUrl}/api/alumni/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Missing Year" }),
    });
    assert(invalidPut.status === 400, "PUT without graduationYear returns HTTP 400");

    // -------------------------------------------------------------
    // Test 6: PATCH /api/alumni/:id (Kısmi Güncelleme)
    // -------------------------------------------------------------
    console.log("\n--- 6. Partial Update (PATCH /:id) Tests ---");
    const patchPayload = {
      graduationYear: 2026,
    };

    const patchRes = await fetch(`${baseUrl}/api/alumni/1`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patchPayload),
    });

    assert(patchRes.status === 200, "PATCH /api/alumni/1 returns HTTP 200 OK");
    const patchUpdated: any = await patchRes.json();
    assert(patchUpdated.graduationYear === 2026, "PATCH updated graduationYear to 2026");
    assert(patchUpdated.name === "Elif Kaya Demir", "PATCH preserved unchanged name");

    // Empty patch body -> 400
    const emptyPatch = await fetch(`${baseUrl}/api/alumni/1`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert(emptyPatch.status === 400, "PATCH with empty body returns HTTP 400");

    // -------------------------------------------------------------
    // Test 7: DELETE /api/alumni/:id (Kayıt Silme)
    // -------------------------------------------------------------
    console.log("\n--- 7. Delete (DELETE /:id) Tests ---");
    const deleteRes = await fetch(`${baseUrl}/api/alumni/5`, {
      method: "DELETE",
    });
    assert(deleteRes.status === 200, "DELETE /api/alumni/5 returns HTTP 200");
    const deleteBody: any = await deleteRes.json();
    assert(deleteBody.success === true, "DELETE response indicates success");
    assert(deleteBody.deletedRecord.name === "Kemal Sunal", "Deleted record details returned");

    // Verify it is gone
    const verifyGone = await fetch(`${baseUrl}/api/alumni/5`);
    assert(verifyGone.status === 404, "Subsequent GET /api/alumni/5 returns HTTP 404 Not Found");

    // Delete non-existing
    const deleteNotFound = await fetch(`${baseUrl}/api/alumni/5`, {
      method: "DELETE",
    });
    assert(deleteNotFound.status === 404, "DELETE non-existent returns HTTP 404");

    // -------------------------------------------------------------
    // Test 8: Swagger / OpenAPI Documentation Endpoints
    // -------------------------------------------------------------
    console.log("\n--- 8. Swagger / Documentation Tests ---");
    const swaggerJsonRes = await fetch(`${baseUrl}/api/swagger.json`);
    assert(swaggerJsonRes.status === 200, "GET /api/swagger.json returns HTTP 200");
    const swaggerJson: any = await swaggerJsonRes.json();
    assert(swaggerJson.openapi === "3.0.0", "OpenAPI version is 3.0.0");
    assert(Boolean(swaggerJson.paths["/api/alumni"]), "Swagger paths include /api/alumni");
    assert(Boolean(swaggerJson.paths["/api/health"]), "Swagger paths include /api/health");

    const swaggerUiRes = await fetch(`${baseUrl}/api/swagger/`);
    assert(
      swaggerUiRes.status === 200,
      `GET /api/swagger/ serves Swagger UI (status: ${swaggerUiRes.status})`
    );

    // -------------------------------------------------------------
    // Test 9: Utility Routes (/hello/:name, /sum/:n1/:n2)
    // -------------------------------------------------------------
    console.log("\n--- 9. Utility Endpoints Tests ---");
    const helloRes = await fetch(`${baseUrl}/hello/Emre`);
    assert(helloRes.status === 200, "GET /hello/Emre returns HTTP 200");
    const helloText = await helloRes.text();
    assert(helloText === "Hello,Emre!", `GET /hello/Emre response is 'Hello,Emre!' (got '${helloText}')`);

    const sumRes = await fetch(`${baseUrl}/sum/15/27`);
    assert(sumRes.status === 200, "GET /sum/15/27 returns HTTP 200");
    const sumText = await sumRes.text();
    assert(sumText === "42", `GET /sum/15/27 response is '42' (got '${sumText}')`);

    console.log("\n============================================================");
    console.log(`📊 FINAL RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("============================================================\n");

    server.close(() => {
      process.exit(failed > 0 ? 1 : 0);
    });
  } catch (error) {
    server.close();
    throw error;
  }
}

runCourseAssignmentTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
