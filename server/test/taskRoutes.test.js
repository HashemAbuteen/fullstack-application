const assert = require("assert");
const request = require("supertest");
const app = require("../index");

let taskId;

describe("Task routes", () => {
  describe("GET /", () => {
    it("should return all tasks", async () => {
      const res = await request(app).get("/tasks");
      assert.equal(res.status, 200);
      assert(Array.isArray(res.body));
    });
  });

  describe("POST /", () => {
    it("should create a new task", async () => {
      const res = await request(app)
        .post("/tasks")
        .send({ name: "New Task", completed: false });
      assert.equal(res.status, 201);
      assert.equal(res.body.name, "New Task");
      taskId = res.body.id;
    });
  });
  describe("GET /:id", () => {
    it("should return a task by id", async () => {
      const res = await request(app).get("/tasks/" + taskId);
      assert.equal(res.status, 200);
      assert.equal(res.body.id, taskId);
    });

    it("should return a 404 error for a non-existent task", async () => {
      const res = await request(app).get("/tasks/999");
      assert.equal(res.status, 404);
    });
  });

  describe("PUT /:id", () => {
    it("should update an existing task", async () => {
      const res = await request(app)
        .put("/tasks/" + taskId)
        .send({ name: "Updated Task", completed: true });
      assert.equal(res.status, 200);
      assert.equal(res.body.name, "Updated Task");
      assert.equal(res.body.completed, true);
    });

    it("should return a 404 error for a non-existent task", async () => {
      const res = await request(app)
        .put("/tasks/999")
        .send({ name: "Updated Task", completed: true });
      assert.equal(res.status, 404);
    });
  });

  describe("DELETE /:id", () => {
    it("should delete an existing task", async () => {
      const res = await request(app).delete("/tasks/" + taskId);
      assert.equal(res.status, 204);
    });

    it("should return a 404 error for a non-existent task", async () => {
      const res = await request(app).delete("/tasks/999");
      assert.equal(res.status, 404);
    });
  });
});
