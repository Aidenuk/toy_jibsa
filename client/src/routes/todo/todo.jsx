
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

export default function Todo(props) {
  const { todo, setTodos } = props;
  console.log(todo);
  const todoId = todo.id;
  const todoStatus = todo.status;
  const todoTitle = todo.todo;
  const [clickedEdit, setClickedEdit] = useState(false);
  const [inputValue, setInputValue] = useState(todo.todo);


  const updateTodo = async () => {
    
    try {
      const res = await apiRequest.put(
        `/todos/${todoId}`,
        {todo:inputValue, status:todoStatus},
        
      );
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todoId ? res.data : todo
        )
      );

    } catch (error) {
      console.error("Failed to update todo:", error);
    }
    
  };

  const handleUpdateTodo = () => {
    updateTodo()
    setClickedEdit(!clickedEdit);
  }

  const handleInputChange =(e) => {
    setInputValue(e.target.value);
  }
    const deleteTodo = async (todoId) => {
        try {
        await apiRequest.delete(`/todos/${todoId}`);
        setTodos((prevTodos) =>
            prevTodos.filter((todo) => todo.id !== todoId)
        );
        } catch (err) {
        console.error(err);
        }
    };
  return (
      <div className="todo">
          {
            clickedEdit? (
                <>
                <input
                  type="text"
                  defaultValue={todo.todo}
                  onChange={handleInputChange}
                />
                </>
            ) : (
                <p>{todo.todo}</p>
            )
          }
          <div className="mutations">
              <button
                  className="todo__status"
                  onClick={handleUpdateTodo}
              >
                  {(todoStatus) ? "☑" : "☐"}
              </button>
              <button
                  className="todo__delete"
                  onClick={() => deleteTodo(todoId)}
              >
                  🗑️
              </button>
          </div>
      </div>
  )
}