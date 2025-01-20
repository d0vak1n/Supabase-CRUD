import { useState } from 'react';
import './App.css'
import supabase from './supabase-client'
import { useEffect } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase.from("TodoList").select("*");
    if (error) {
      console.error("Error fetching todos", error);
    } else {
      setTodoList(data);
    }
  }

  const addTodo = async () => {
    const newTodoData = {
      name: newTodo,
      isCompleted: false
    }
    const { data, error } = await supabase.from("TodoList").insert([newTodoData]).single();
    if (error) {
      console.error("Error adding new todo", error);
    } else {
      setTodoList((prev) => [...prev, data]);
      setNewTodo('');
    }
  };

  const completeTask = async (id, isCompleted) => {
    const { data, error } = await supabase
      .from("TodoList")
      .update({ isCompleted: !isCompleted })
      .eq("id", id);

    console.log("data: ", data);

    if (error) {
      console.log("error toggling task: ", error);
    } else {
      const updatedTodoList = todoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
      );
      setTodoList(updatedTodoList);
    }
  };

  return (
    <>
      <div>
        {""}
        <h1>Todo List</h1>
        <div>
          <input type="text" placeholder='New Todo' value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
          <button onClick={addTodo}>Add Todo Item</button>
        </div>
        <ul>
          {todoList.map((todo) => (
            <li key={todo.id}>
              <p>{todo.name}</p>
              <button onClick={() => completeTask(todo.id, todo.isCompleted)}>{todo.isCompleted ? "Undo" : "Complete Task"}</button>
              <button>Delete Task</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
