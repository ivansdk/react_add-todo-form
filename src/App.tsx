import "./App.scss";
import usersFromServer from "./api/users";
import todosFromServer from "./api/todos";
import React, { useState } from "react";
import { TodoList } from "./components/TodoList";
import { Todo } from "./Types/Todo";

export function getUserById(userId: number) {
  return usersFromServer.filter((user) => user.id === userId)[0];
}

export const App = () => {
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState(0);
  const [todos, setTodos] = useState<Todo[]>(todosFromServer);
  const [hasTitleError, setHasTitleError] = useState(false);
  const [hasUserIdError, setHasUserIdError] = useState(false);

  const createTodoId = () => {
    return Math.max(...todos.map((todo) => todo.id));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasTitleError(false);
  };

  const handleUserIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(+event.target.value);
    setHasUserIdError(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setHasTitleError(!title);
    setHasUserIdError(!userId);

    if (!title || !userId) {
      return;
    }

    const newTodo = {
      title: title,
      completed: false,
      userId: userId,
      id: createTodoId(),
    };

    setTodos((currentTodos) => {
      return [...currentTodos, newTodo];
    });

    setTitle("");
    setUserId(0);
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form action="/api/todos" method="POST" onSubmit={handleSubmit}>
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            value={title}
            onChange={() => handleTitleChange}
          />
          {hasTitleError && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={userId}
            onChange={() => handleUserIdChange}
          >
            <option value="0" disabled>
              Choose a user
            </option>

            {usersFromServer.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {hasUserIdError && (
            <span className="error">Please choose a user</span>
          )}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};
