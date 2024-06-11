import prisma from "../lib/prisma.js"
import jwt from "jsonwebtoken";

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
// export const getTodos = async (req, res) => {
//   const userId = req.params.userId;
 
//   try {
//     // If id is provided, find specific todo
//     if (userId) {
//       const todo = await prisma.todo.findUnique({
//         where: {
//           id: id,
//         },
//       });
//       if (!todo) {
//         return res.status(404).json({ msg: "Todo not found" });
//       }
//       res.status(200).json(todo);
//     } else {
//       // If no id is provided, find all todos
//       const todos = await prisma.todo.findMany();
//       res.status(200).json(todos);
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Failed to fetch todos" });
//   }
// };

// export const getTodos = async (req, res) => {
//   try {
//     const todos = await prisma.todo.findMany();
//     res.status(200).json(todos);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Failed to fetch todos" });
//   }
// };

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

// Update todos
export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { status, ...inputs } = req.body;

  if (typeof status !== 'boolean') {
    return res.status(400).json({ msg: "Invalid status" });
  }

  try {
    const todo = await prisma.todo.findUnique({
      where: { id: id },
    
    });
    if(!todo){
      return res.status(404).json({msg: "no todo !"})
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: id },
      data: { ...inputs },
    });
    res.status(200).json(updatedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed to update todo" });
  }
};