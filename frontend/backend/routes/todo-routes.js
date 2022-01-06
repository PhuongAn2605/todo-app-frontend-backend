const express = require("express");
const { check } = require("express-validator");

const todoController = require("../controllers/todo-controllers");

const router = express.Router();

router.get("/", todoController.getTodoItems);

router.post(
  "/add",
  [check("title").not().isEmpty()],
  todoController.addNewItem
);

router.patch(
  "/edit/:id",
  [check("title").not().isEmpty()],
  todoController.editTodoItem
);

router.delete("/delete/:id", todoController.deleteTodoItem);

router.patch('/toggle-completed/:id', todoController.toggleCompleted);

router.put('/clear-completed', todoController.clearCompleted);

router.patch('/toggle-completed-all', todoController.toggleCompletedAll);

module.exports = router;
