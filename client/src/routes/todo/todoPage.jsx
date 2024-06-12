import { useContext, useEffect, useState } from "react";
import Todo from "./todo";
import "./todo.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";


export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");
  const {currentUser} = useContext(AuthContext)

  useEffect(() => {
    async function getTodos() {
      try {
        const res = await apiRequest.get("/todos");
        const todos = res.data; // Correct the response handling
        setTodos(todos);
        
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    }
    getTodos();
  }, []);

  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.length > 3) {
      try {
        const res = await apiRequest.post(
          "/todos",
          {
            todo: content,
            userId: currentUser.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const newTodo = res.data;

        setContent("");
        setTodos([...todos, newTodo]);
      } catch (error) {
        console.error("Failed to create new todo:", error);
      }
    }
  };
  return (
    <main className="container">
      <h1 className="title">Awesome Todos</h1>
      <form className="form" onSubmit={createNewTodo}>
        <input 
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter a new todo..."
        className="form__input"
        required 
        />
        <button className="form__button" type="submit">Create Todo</button>
      </form>
      <div className="todos">
        {(todos.length > 0) &&
          todos.map((todo) => (
            <Todo key={todo._id} todo={todo} setTodos={setTodos}   />
          ))
        }
      </div>
    </main>
  );
}