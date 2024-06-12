import prisma from "../lib/prisma.js"

export const getTodos = async (req, res) => {
  const  userId = req.userId;
  
  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId: userId,
      },
    });
    if (todos.length === 0) {
      return res.status(404).json({
        msg: "Todos not found for this user",
        detail: "The requested resource could not be found but may be available again in the future. Subsequent requests by the client are permissible."
      });
    }
    res.status(200).json(todos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to fetch todos" });
  }
};

// Post todos
export const postTodo = async (req, res) => {
  let { todo } = req.body;
  const userTokenId = req.userId;

  if (!todo) {
    return res.status(400).json({ msg: "Error no todo found" });
  }

  todo = (typeof todo === "string") ? todo : JSON.stringify(todo);

  try {
    const newTodo = await prisma.todo.create({
      data: { todo, status: false, userId:userTokenId },
    });
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed to create todo" });
  }
};

// Delete todos
export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  

  try {
    const delTodo = await prisma.todo.delete({
      where: { id: id },
    });
    res.status(200).json({msg: "successfully deleted!",delTodo});
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed to delete todo" });
  }
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const {todo,status} = req.body
  try {
    const existingTodo = await prisma.todo.findUnique({
      where: { id: id },
    });
    if (!existingTodo) {
      return res.status(404).json({ msg: "No todo found!" });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: id },
      data: { status: status, todo: todo },
    });
    res.status(200).json(updatedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed to update todo" });
  }
};