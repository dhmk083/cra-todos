import create from "zustand";
import { devtools } from "zustand/middleware";
import { withLenses, lens } from "@dhmk/zustand-lens";
import { merge, dataAdapter } from "@dhmk/utils";
import { nanoid } from "nanoid";
import * as t from "types";

const todosAdapter = dataAdapter<t.Todo>();

const todo = (text: string): t.Todo => ({
  id: nanoid(),
  text,
  isCompleted: false,
});

const createTodos = (initialTodos) =>
  lens<t.TodosStore>((set, get) => ({
    todos: todosAdapter.from(initialTodos),

    add(text) {
      set({ todos: todosAdapter.append(get().todos, todo(text)) });
    },

    move(id, refId) {
      const old = get().todos;
      const next = old.ids.slice();
      const idi = next.indexOf(id);
      const refIdi = next.indexOf(refId);
      next.splice(refIdi, 0, next.splice(idi, 1)[0]);

      set({ todos: todosAdapter.from(next, old.byId) });
    },

    remove(id) {
      set({ todos: todosAdapter.remove(get().todos, id) });
    },

    edit(id, text) {
      set({ todos: todosAdapter.update(get().todos, id, merge({ text })) });
    },

    toggle(id) {
      set({
        todos: todosAdapter.update(get().todos, id, (t) =>
          merge(t, { isCompleted: !t.isCompleted })
        ),
      });
    },
  }));

const todos = JSON.parse(localStorage.getItem("todos")!) || [];

export const useStore = create<t.Store>(
  devtools(
    withLenses(() => ({
      todos: createTodos(todos),
    }))
  )
);

useStore.subscribe((s) => {
  localStorage.setItem(
    "todos",
    JSON.stringify(todosAdapter.toArray(s.todos.todos))
  );
});
