const HttpError = require("../models/http-error");
const Todo = require("../models/Todo");
const { validationResult } = require("express-validator");

const isEmpty = require("is-empty");

const getTodoItems = async (req, res, next) => {
  let todoItems;
  try {
    todoItems = await Todo.find({});
    if (isEmpty(todoItems)) {
      return next(new HttpError("Could not find any todo item", 404));
    }
  } catch (err) {
    return next(new HttpError("Fetching todo items failed!", 500));
  }

  res.json({ todoItems });
};

const addNewItem = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid input passed, please check your data", 422)
    );
  }

  const { title } = req.body;
  let existingTitle;
  let createdItem;
  try {
    existingTitle = await Todo.findOne({ title: title });
    if (!isEmpty(existingTitle)) {
      return next(new HttpError("The item exists already", 422));
    }
    createdItem = new Todo({
      title,
      isCompleted: false,
    });
    const saveItem = await createdItem.save();
    if (isEmpty(saveItem)) {
      return next(new HttpError("Saving the item failed", 500));
    }
  } catch (err) {
    return next(new HttpError("Could not add the item", 500));
  }

  res.status(201).json({ todoItem: createdItem });
};

const editTodoItem = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid data passed!", 422));
  }

  const itemId = req.params.id;
  const { title } = req.body;

  let todoItem;
  try {
    todoItem = await Todo.findById(itemId);
    if (isEmpty(todoItem)) {
      return next(new HttpError("Could not find the item", 404));
    }

    todoItem.title = title;
    const saveItem = await todoItem.save();
    if (isEmpty(saveItem)) {
      return next(new HttpError("Saving item failed!", 500));
    }
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("Something went wrong, could not update the item", 500)
    );
  }

  res.status(200).send({ todoItem: todoItem.toObject({ getters: true }) });
};

const deleteTodoItem = async (req, res, next) => {
  const itemId = req.params.id;

  let todoItem;
  try {
    todoItem = await Todo.findById(itemId);
    if (isEmpty(todoItem)) {
      return next(new HttpError("Could not find the item", 404));
    }
    const deleteItem = await todoItem.remove();
    if (isEmpty(deleteItem)) {
      return next(new HttpError("Could not delete the item", 500));
    }
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }
  res.status(200).json({ message: "Deleted the item." });
};

const toggleCompleted = async (req, res, next) => {
  const itemId = req.params.id;

  let itemToToggle;
  try {
    itemToToggle = await Todo.findById(itemId);
    if (isEmpty(itemToToggle)) {
      return next(new HttpError("Could not find the item!", 404));
    }
    itemToToggle.isCompleted = !itemToToggle.isCompleted;

    const saveTodoItem = await itemToToggle.save();
    if (isEmpty(saveTodoItem)) {
      return next(new HttpError("Could not save the item", 500));
    }
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }

  res.status(200).json({ todoItem: itemToToggle });
};

const clearCompleted = async (req, res, next) => {
  let todoItems;
  try {
    todoItems = await Todo.deleteMany({ isCompleted: true });
    console.log(todoItems);
    if (isEmpty(todoItems)) {
      return next(new HttpError("Could not find any todo item", 404));
    }
  } catch (err) {
    console.log(err);
    return next(new HttpError("Something went wrong", 500));
  }

  res.status(200).json(todoItems);
};

const toggleCompletedAll = async (req, res, next) => {
  const { completedAll } = req.body;

  try {
    if (completedAll) {
      await Todo.updateMany(
        { isCompleted: true },
        { $set: { isCompleted: false } }
      );
    } else {
      await Todo.updateMany(
        { isCompleted: false },
        { $set: { isCompleted: true } }
      );
    }
  } catch (error) {
    console.log(error);
    return next(new HttpError("Something went wrong", 500));
  }
  res.status(200).send('Toggled all.')
};

exports.getTodoItems = getTodoItems;
exports.addNewItem = addNewItem;
exports.editTodoItem = editTodoItem;
exports.deleteTodoItem = deleteTodoItem;

exports.toggleCompleted = toggleCompleted;
exports.clearCompleted = clearCompleted;
exports.toggleCompletedAll = toggleCompletedAll;
