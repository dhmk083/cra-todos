import { NormalizedData } from "@dhmk/utils";

export type Id = string;

export type Todo = {
  id: Id;
  text: string;
  isCompleted: boolean;
};

export type TodosStore = {
  todos: NormalizedData<Todo>;

  add(text: string);
  move(id: Id, refId: Id);
  remove(id: Id);
  edit(id: Id, text: string);
  toggle(id: Id);
};

export type Store = {
  todos: TodosStore;
};
