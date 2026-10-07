import http from "http";
import { AddressInfo } from "net";
import app from "./index";
import { alumniStore } from "./storage/inMemoryStore";
import { userModel } from "./models/User.model";
import { announcementModel } from "./models/Announcement.model";

async function runCourseAssignmentTests() {
  console.log("\n============================================================");
  console.log("🧪 TESTING ALUMNI SERVER - WEEK 04 MVC ARCHITECTURE & TESTS");
  console.log("   Ders: Web Programlama (Assoc. Prof. Dr. Emre Akadal)");
  console.log("   Görevler: Sınıf İçi (User Modülü) & Ödev (Announcement)");
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

  // Set NODE_ENV to test to prevent duplicate listening
  process.env.NODE_ENV = "test";

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
    // Test 2: Alumni Module (Week 03 In-Memory CRUD)
    // -------------------------------------------------------------
    console.log("\n--- 2. Alumni In-Memory CRUD Tests ---");
    alumniStore.resetToDefault();

    const alumniListRes = await fetch(`${baseUrl}/api/alumni`);
    assert(alumniListRes.status === 200, "GET /api/alumni returns HTTP 200");
    const alumniList: any = await alumniListRes.json();
    assert(Array.isArray(alumniList), "GET /api/alumni returns JSON array");
    assert(alumniList.length === 4, `Initial seed has 4 records (got ${alumniList.length})`);

    // -------------------------------------------------------------
    // Test 3: Bölüm 1 - User Model & ApiUserController (REST API)
    // -------------------------------------------------------------
    console.log("\n--- 3. User JSON REST API Tests (/api/users) ---");
    userModel.reset();

    // 3.1 GET /api/users
    const apiUsersRes = await fetch(`${baseUrl}/api/users`);
    assert(apiUsersRes.status === 200, "GET /api/users returns HTTP 200");
    const apiUsers: any = await apiUsersRes.json();
    assert(Array.isArray(apiUsers), "GET /api/users returns JSON array");
    assert(apiUsers.length >= 5, `Initial users count is at least 5 (got ${apiUsers.length})`);
    assert(apiUsers[0].name === "Elif Kaya", "First user name is 'Elif Kaya'");

    // 3.2 POST /api/users (201 Created)
    const newUserPayload = {
      name: "Cahit Arf",
      email: "cahit.arf@istanbul.edu.tr",
      role: "Faculty",
      graduationYear: 1932,
      department: "Matematik",
      company: "TÜBİTAK",
    };
    const createUserRes = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUserPayload),
    });
    assert(createUserRes.status === 201, "POST /api/users returns HTTP 201 Created");
    const createdUser: any = await createUserRes.json();
    assert(createdUser.name === "Cahit Arf", "Created user name matches");
    assert(createdUser.graduationYear === 1932, "Created user graduationYear matches");
    const createdUserId = createdUser.id;

    // 3.3 GET /api/users/:id
    const getUserRes = await fetch(`${baseUrl}/api/users/${createdUserId}`);
    assert(getUserRes.status === 200, `GET /api/users/${createdUserId} returns HTTP 200`);
    const fetchedUser: any = await getUserRes.json();
    assert(fetchedUser.id === createdUserId, "Fetched user ID matches");

    // 3.4 PUT /api/users/:id
    const putUserRes = await fetch(`${baseUrl}/api/users/${createdUserId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Ord. Prof. Dr. Cahit Arf",
        email: "cahit.arf@istanbul.edu.tr",
        role: "Faculty",
        graduationYear: 1932,
        department: "Matematik",
        company: "TÜBİTAK",
      }),
    });
    assert(putUserRes.status === 200, "PUT /api/users/:id returns HTTP 200");
    const putUserData: any = await putUserRes.json();
    assert(putUserData.name === "Ord. Prof. Dr. Cahit Arf", "PUT updated user name");

    // 3.5 PATCH /api/users/:id
    const patchUserRes = await fetch(`${baseUrl}/api/users/${createdUserId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company: "ODTÜ & TÜBİTAK" }),
    });
    assert(patchUserRes.status === 200, "PATCH /api/users/:id returns HTTP 200");
    const patchUserData: any = await patchUserRes.json();
    assert(patchUserData.company === "ODTÜ & TÜBİTAK", "PATCH updated user company");
    assert(patchUserData.name === "Ord. Prof. Dr. Cahit Arf", "PATCH preserved user name");

    // 3.6 DELETE /api/users/:id
    const deleteUserRes = await fetch(`${baseUrl}/api/users/${createdUserId}`, {
      method: "DELETE",
    });
    assert(deleteUserRes.status === 200, "DELETE /api/users/:id returns HTTP 200");
    const deleteUserBody: any = await deleteUserRes.json();
    assert(deleteUserBody.success === true, "DELETE response indicates success");

    // 3.7 Verify 404 after delete
    const verifyUserGone = await fetch(`${baseUrl}/api/users/${createdUserId}`);
    assert(verifyUserGone.status === 404, "Subsequent GET /api/users/:id returns 404 Not Found");

    // -------------------------------------------------------------
    // Test 4: Bölüm 1 - User View Layer Tests (/users)
    // -------------------------------------------------------------
    console.log("\n--- 4. User HTML View Layer Tests (/users) ---");

    // 4.1 GET /users -> Listing HTML
    const usersViewRes = await fetch(`${baseUrl}/users`);
    assert(usersViewRes.status === 200, "GET /users returns HTTP 200");
    const usersHtml = await usersViewRes.text();
    assert(usersHtml.includes("Kullanıcı Yönetimi"), "GET /users contains 'Kullanıcı Yönetimi' title");
    assert(usersHtml.includes("Elif Kaya"), "GET /users contains seed user 'Elif Kaya'");
    assert(usersHtml.includes("<table"), "GET /users renders HTML table");

    // 4.2 GET /users/new -> Create Form HTML
    const userNewFormRes = await fetch(`${baseUrl}/users/new`);
    assert(userNewFormRes.status === 200, "GET /users/new returns HTTP 200");
    const userNewHtml = await userNewFormRes.text();
    assert(userNewHtml.includes("<form"), "GET /users/new renders HTML form");
    assert(userNewHtml.includes('name="name"'), "Form includes 'name' input field");

    // 4.3 POST /users -> Create User via HTML Form (redirects 302 to /users)
    const postUserFormRes = await fetch(`${baseUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        name: "Halide Edib Adıvar",
        email: "halide.edib@istanbul.edu.tr",
        role: "Faculty",
        graduationYear: "1918",
        department: "Edebiyat Fakültesi",
        company: "İstanbul Üniversitesi",
      }).toString(),
      redirect: "manual", // Don't auto-follow to check 302 redirect
    });
    assert(postUserFormRes.status === 302, "POST /users returns HTTP 302 Redirect");
    const location = postUserFormRes.headers.get("location");
    assert(Boolean(location && location.includes("/users")), "POST /users redirects to /users");

    // 4.4 GET /users/:id -> User Detail View
    const userDetailRes = await fetch(`${baseUrl}/users/1`);
    assert(userDetailRes.status === 200, "GET /users/1 returns HTTP 200");
    const userDetailHtml = await userDetailRes.text();
    assert(userDetailHtml.includes("Elif Kaya"), "GET /users/1 shows user detail 'Elif Kaya'");

    // 4.5 GET /users/:id/edit -> User Edit Form View
    const userEditFormRes = await fetch(`${baseUrl}/users/1/edit`);
    assert(userEditFormRes.status === 200, "GET /users/1/edit returns HTTP 200");
    const userEditHtml = await userEditFormRes.text();
    assert(userEditHtml.includes('action="/users/1/edit"'), "Edit form action is /users/1/edit");

    // -------------------------------------------------------------
    // Test 5: Bölüm 2 - Homework Announcement Model & REST API
    // -------------------------------------------------------------
    console.log("\n--- 5. Announcement REST API Tests (/api/announcements) ---");
    announcementModel.reset();

    // 5.1 GET /api/announcements
    const apiAnnounceRes = await fetch(`${baseUrl}/api/announcements`);
    assert(apiAnnounceRes.status === 200, "GET /api/announcements returns HTTP 200");
    const apiAnnouncements: any = await apiAnnounceRes.json();
    assert(Array.isArray(apiAnnouncements), "GET /api/announcements returns JSON array");
    assert(apiAnnouncements.length >= 4, `Initial announcements count is at least 4 (got ${apiAnnouncements.length})`);

    // 5.2 POST /api/announcements (201 Created)
    const newAnnouncePayload = {
      title: "Bahar Şenliği 2026 Duyurusu",
      content: "Geleneksel Beyazıt Kampüsü Bahar Şenlikleri Mayıs ayında yapılacaktır.",
      author: "Öğrenci Kültür Merkezi",
      category: "Event",
      priority: "High",
    };
    const createAnnounceRes = await fetch(`${baseUrl}/api/announcements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAnnouncePayload),
    });
    assert(createAnnounceRes.status === 201, "POST /api/announcements returns HTTP 201 Created");
    const createdAnnounce: any = await createAnnounceRes.json();
    assert(createdAnnounce.title === "Bahar Şenliği 2026 Duyurusu", "Created announcement title matches");
    const announceId = createdAnnounce.id;

    // 5.3 GET /api/announcements/:id
    const getAnnounceRes = await fetch(`${baseUrl}/api/announcements/${announceId}`);
    assert(getAnnounceRes.status === 200, `GET /api/announcements/${announceId} returns HTTP 200`);
    const fetchedAnnounce: any = await getAnnounceRes.json();
    assert(fetchedAnnounce.id === announceId, "Fetched announcement ID matches");

    // 5.4 PUT /api/announcements/:id
    const putAnnounceRes = await fetch(`${baseUrl}/api/announcements/${announceId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Bahar Şenliği 2026 (Tarih Güncellendi)",
        content: "Şenlikler 20-22 Mayıs tarihleri arasında yapılacaktır.",
        author: "Öğrenci Kültür Merkezi",
        category: "Event",
        priority: "High",
      }),
    });
    assert(putAnnounceRes.status === 200, "PUT /api/announcements/:id returns HTTP 200");
    const putAnnounceData: any = await putAnnounceRes.json();
    assert(putAnnounceData.title === "Bahar Şenliği 2026 (Tarih Güncellendi)", "PUT updated title");

    // 5.5 PATCH /api/announcements/:id
    const patchAnnounceRes = await fetch(`${baseUrl}/api/announcements/${announceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority: "Medium" }),
    });
    assert(patchAnnounceRes.status === 200, "PATCH /api/announcements/:id returns HTTP 200");
    const patchAnnounceData: any = await patchAnnounceRes.json();
    assert(patchAnnounceData.priority === "Medium", "PATCH updated priority to Medium");

    // 5.6 DELETE /api/announcements/:id
    const deleteAnnounceRes = await fetch(`${baseUrl}/api/announcements/${announceId}`, {
      method: "DELETE",
    });
    assert(deleteAnnounceRes.status === 200, "DELETE /api/announcements/:id returns HTTP 200");

    // 5.7 Verify 404 after delete
    const verifyAnnounceGone = await fetch(`${baseUrl}/api/announcements/${announceId}`);
    assert(verifyAnnounceGone.status === 404, "Subsequent GET /api/announcements/:id returns 404");

    // -------------------------------------------------------------
    // Test 6: Bölüm 2 - Homework Announcement Management Interface (/announcements)
    // -------------------------------------------------------------
    console.log("\n--- 6. Homework Announcement Management Interface (/announcements) ---");

    // 6.1 GET /announcements -> Management Board UI
    const announceUiRes = await fetch(`${baseUrl}/announcements`);
    assert(announceUiRes.status === 200, "GET /announcements returns HTTP 200");
    const announceUiHtml = await announceUiRes.text();
    assert(announceUiHtml.includes("Duyuru ve Haber Panosu"), "GET /announcements contains panel title");
    assert(announceUiHtml.includes("Yeni Duyuru Yayınla"), "GET /announcements contains new announcement button");

    // 6.2 GET /announcements/new -> New Form UI
    const announceNewFormRes = await fetch(`${baseUrl}/announcements/new`);
    assert(announceNewFormRes.status === 200, "GET /announcements/new returns HTTP 200");
    const announceNewHtml = await announceNewFormRes.text();
    assert(announceNewHtml.includes('name="title"'), "Form includes 'title' input");
    assert(announceNewHtml.includes('name="content"'), "Form includes 'content' textarea");

    // 6.3 POST /announcements -> Form submit
    const postAnnounceFormRes = await fetch(`${baseUrl}/announcements`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        title: "Test Arayüz Duyurusu",
        content: "Arayüz üzerinden test duyurusu oluşturuldu.",
        author: "Sistem Test Kullanıcısı",
        category: "General",
        priority: "Low",
      }).toString(),
      redirect: "manual",
    });
    assert(postAnnounceFormRes.status === 302, "POST /announcements returns HTTP 302 Redirect");

    // 6.4 GET /announcements/1 -> Detail UI
    const announceDetailRes = await fetch(`${baseUrl}/announcements/1`);
    assert(announceDetailRes.status === 200, "GET /announcements/1 returns HTTP 200");
    const announceDetailHtml = await announceDetailRes.text();
    assert(announceDetailHtml.includes("Mezunlar Buluşması"), "Detail view contains announcement content");

    // -------------------------------------------------------------
    // Test 7: Swagger / OpenAPI Documentation
    // -------------------------------------------------------------
    console.log("\n--- 7. Swagger Documentation Verification ---");
    const swaggerJsonRes = await fetch(`${baseUrl}/api/swagger.json`);
    assert(swaggerJsonRes.status === 200, "GET /api/swagger.json returns HTTP 200");
    const swaggerJson: any = await swaggerJsonRes.json();
    assert(Boolean(swaggerJson.paths["/api/users"]), "Swagger paths include /api/users");
    assert(Boolean(swaggerJson.paths["/users"]), "Swagger paths include /users (View)");
    assert(Boolean(swaggerJson.paths["/api/announcements"]), "Swagger paths include /api/announcements");
    assert(Boolean(swaggerJson.paths["/announcements"]), "Swagger paths include /announcements (View)");
    assert(Boolean(swaggerJson.paths["/api/alumni"]), "Swagger paths include /api/alumni");
    assert(Boolean(swaggerJson.paths["/api/health"]), "Swagger paths include /api/health");

    // -------------------------------------------------------------
    // Test 8: Utility Routes
    // -------------------------------------------------------------
    console.log("\n--- 8. Utility Endpoints Tests ---");
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
