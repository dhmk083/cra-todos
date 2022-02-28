import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useInput } from "@dhmk/react";
import { useStore } from "store";

export default function App() {
  const ids = useStore((s) => s.todos.todos.ids);
  const move = useStore((s) => s.todos.move);

  const handleDrop = ({ source, destination }) => {
    if (source?.index === destination?.index || !destination) return;

    move(ids[source.index], ids[destination.index]);
  };

  return (
    <DragDropContext onDragEnd={handleDrop}>
      <div style={{ padding: "1em" }}>
        <h1>Todos</h1>

        <AddTodo />

        <h3>Your tasks:</h3>

        <Droppable droppableId="todos">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {ids.map((id, i) => (
                <Todo key={id} id={id} index={i} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}

function AddTodo() {
  const add = useStore((s) => s.todos.add);
  const input = useInput();

  return (
    <input
      {...input}
      onKeyPress={(ev) => {
        if (ev.key === "Enter") {
          add(input.value);
          input.onChange({ target: { value: "" } });
        }
      }}
      placeholder="Write something..."
    />
  );
}

function Todo({ id, index }) {
  const { isCompleted } = useStore((s) => s.todos.todos.byId[id]);
  const remove = useStore((s) => s.todos.remove);
  const toggle = useStore((s) => s.todos.toggle);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            style={{
              textDecoration: isCompleted ? "line-through" : "none",
              color: isCompleted ? "lightgray" : "inherit",
            }}
          >
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() => toggle(id)}
            />

            <TodoEditor id={id} />

            <button onClick={() => remove(id)} style={{ marginLeft: "1em" }}>
              x
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}

function TodoEditor({ id }) {
  const todo = useStore((s) => s.todos.todos.byId[id]);
  const edit = useStore((s) => s.todos.edit);

  const [isEditing, setEditing] = React.useState(false);
  const input = useInput(todo.text);

  return isEditing ? (
    <input
      {...input}
      autoFocus
      onBlur={() => {
        edit(id, input.value);
        setEditing(false);
      }}
    />
  ) : (
    <span onDoubleClick={() => setEditing(true)}>{todo.text}</span>
  );
}
