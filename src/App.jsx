import { useState } from 'react';
import './App.css'
import supabase from './supabase-client'
import { useEffect } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, [todoList]);

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
    const { data, error } = await supabase
      .from("TodoList")
      .insert([newTodoData])
      .single();

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

    if (error) {
      console.log("error toggling task: ", error);
    } else {
      const updatedTodoList = todoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
      );
      setTodoList(updatedTodoList);
    }
  };

  const deleteTask = async (id) => {
    const { data, error } = await supabase
      .from("TodoList")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("error deleting task: ", error);
    } else {
      setTodoList((prev) => prev.filter((todo) => todo.id !== id));
    }

  };

  return (
    <>
      <div>
        {""}
        <h1 className='m-8'>Todo List</h1>
        <div className='my-6  drop-shadow-md'>
          <input className='lg:m-8 lg:p-2 p-2 my-4 mx-4 w-3xs' type="text" placeholder='New Todo' value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
          <button className='p-8' onClick={addTodo}>Add Todo Item</button>
        </div>
        <div>
          <ul>
            {todoList.map((todo) => (
              todo && (
                <div key={todo.id} className='flex justify-center'>
                  <li className='lg:my-2'>
                    <p className='my-4 text-lg'> {todo.name}</p>
                    <button className='mr-4' onClick={() => completeTask(todo.id, todo.isCompleted)}>
                      {" "}
                      {todo.isCompleted ? "Undo" : "Complete Task"}
                    </button>
                    <button className='ml-4' onClick={() => deleteTask(todo.id)}> Delete Task</button>
                  </li>
                </div>
              )))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default App
