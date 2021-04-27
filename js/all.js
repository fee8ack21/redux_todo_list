const allBtn = document.getElementById("all-btn");
const activedBtn = document.getElementById("actived-btn");
const finishedBtn = document.getElementById("finished-btn");
// prepare render condition
let condition = "all";
// category button style change
allBtn.addEventListener("click", function () {
  if (this.classList.contains("btn-primary")) {
    return;
  } else {
    this.classList.add("btn-primary");
    activedBtn.classList.remove("btn-primary");
    finishedBtn.classList.remove("btn-primary");
    condition = "all";
    render(condition);
  }
});
activedBtn.addEventListener("click", function () {
  if (this.classList.contains("btn-primary")) {
    return;
  } else {
    this.classList.add("btn-primary");
    allBtn.classList.remove("btn-primary");
    finishedBtn.classList.remove("btn-primary");
    condition = "actived";
    render(condition);
  }
});
finishedBtn.addEventListener("click", function () {
  if (this.classList.contains("btn-primary")) {
    return;
  } else {
    this.classList.add("btn-primary");
    activedBtn.classList.remove("btn-primary");
    allBtn.classList.remove("btn-primary");
    condition = "finished";
    render(condition);
  }
});

// todos list reducer
function todoApp(
  state = localStorage.getItem("redux_todos")
    ? JSON.parse(localStorage.getItem("redux_todos"))
    : [],
  action
) {
  switch (action.type) {
    case "TODO_ADD":
      localStorage.setItem(
        "redux_todos",
        JSON.stringify([
          ...state,
          {
            time: action["time"],
            text: action["text"],
            completed: action["completed"],
          },
        ])
      );
      return [
        ...state,
        {
          time: action["time"],
          text: action["text"],
          completed: action["completed"],
        },
      ];
    //
    //
    //
    case "TODO_COMPLETE":
      localStorage.setItem(
        "redux_todos",
        JSON.stringify(
          [...state]
            .slice(0, action.index)
            .concat(
              Object.assign({}, [...state][action.index], {
                completed: ![...state][action.index].completed,
              })
            )
            .concat([...state].slice(action.index + 1))
        )
      );
      return [...state]
        .slice(0, action.index)
        .concat(
          Object.assign({}, [...state][action.index], {
            completed: ![...state][action.index].completed,
          })
        )
        .concat([...state].slice(action.index + 1));
    //
    //
    //
    case "TODO_REMOVE":
      if (action.index === 0) {
        localStorage.setItem(
          "redux_todos",
          JSON.stringify([...state].slice(action.index + 1))
        );
        return [...state].slice(action.index + 1);
      }
      localStorage.setItem(
        "redux_todos",
        JSON.stringify(
          [...state]
            .slice(0, action.index)
            .concat([...state].slice(action.index + 1))
        )
      );
      return [...state]
        .slice(0, action.index)
        .concat([...state].slice(action.index + 1));
    //
    //
    //
    case "TODO_MOD":
      localStorage.setItem(
        "redux_todos",
        JSON.stringify(
          [...state]
            .slice(0, action.index)
            .concat(
              Object.assign({}, [...state][action.index], {
                text: action.text,
              })
            )
            .concat([...state].slice(action.index + 1))
        )
      );
      return [...state]
        .slice(0, action.index)
        .concat(
          Object.assign({}, [...state][action.index], {
            text: action.text,
          })
        )
        .concat([...state].slice(action.index + 1));
    //
    //
    //
    default:
      localStorage.setItem("redux_todos", JSON.stringify(state));
      return state;
  }
}
// init store
const store = Redux.createStore(todoApp);

// add function & action
function add() {
  const text = document.getElementById("add-input").value.trim();
  if (text === "") {
    return;
  }
  store.dispatch({
    time: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDay()}-${new Date().getMilliseconds()}}`,
    type: "TODO_ADD",
    text: text,
    completed: false,
  });
  document.getElementById("add-input").value = "";
  document.getElementById("add-input").focus();
}

// toggle function & action
function toggle(index) {
  store.dispatch({ type: "TODO_COMPLETE", index: index });
}

// remove function & action
function remove(index) {
  store.dispatch({ type: "TODO_REMOVE", index: index });
}
//
function mod(index, text) {
  store.dispatch({ type: "TODO_MOD", index: index, text: text });
}
// todo component
function TodoComponent(props) {
  const { useState, useRef, useEffect } = React;
  const textInput = useRef(null);
  const [inputState, setInputState] = useState(false);
  //
  useEffect(() => {
    return () => {
      setInputState(false);
    };
  }, []);
  return (
    <li
      className={`d-flex justify-content-between align-items-center py-2 px-3 mb-2 rounded w-100 ${
        props.item.completed ? "bg-dark" : "bg-light"
      }`}
      key={props.item.time}
      onClick={(e) => {
        const nodeName = e.target.nodeName;
        if (nodeName !== "I" && nodeName !== "BUTTON") {
          toggle(props.index);
        }
      }}
    >
      <input
        className={`form-control mb-0 
        ${props.item.completed ? " actived " : ""} 
        ${
          inputState
            ? " bg-white bd-color-actived "
            : " bg-transparent bd-color-none "
        }
        ${props.item.completed && !inputState ? " text-white " : ""}
        `}
        style={{ width: "calc(100% - 104.41px)" }}
        disabled={inputState ? "" : "disabled"}
        ref={textInput}
        defaultValue={props.item.text}
        onChange={(e) => {
          mod(props.index, e.target.value.trim());
        }}
        onBlur={(e) => {
          if (e.target.value.trim().length === 0) {
            e.target.value = "Can not be empty!";
            mod(props.index, e.target.value.trim());
          }
          setInputState(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
      <div>
        <button
          className="btn btn-warning"
          onMouseDown={(e) => {
            e.stopPropagation;
            setInputState(!inputState);
          }}
          onMouseUp={() => {
            textInput.current.focus();
          }}
        >
          <i className="fas fa-sliders-h"></i>
        </button>
        <button
          className="btn btn-danger ml-2"
          onClick={(e) => {
            e.stopPropagation();
            remove(props.index);
          }}
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    </li>
  );
}
//
function render(condition) {
  //
  if (condition === "all") {
    if (store.getState().length > 0) {
      const jsxStr = store
        .getState()
        .map((item, index) => (
          <TodoComponent key={index} item={item} index={index} />
        ));
      //
      ReactDOM.render(jsxStr, document.getElementById("list"));
    } else {
      ReactDOM.render(<></>, document.getElementById("list"));
    }
  } else if (condition === "actived") {
    if (store.getState().length > 0) {
      const jsxStr = store
        .getState()
        .map(
          (item, index) =>
            !item.completed && (
              <TodoComponent key={index} item={item} index={index} />
            )
        );
      ReactDOM.render(jsxStr, document.getElementById("list"));
    } else {
      ReactDOM.render(<></>, document.getElementById("list"));
    }
  } else if (condition === "finished") {
    if (store.getState().length > 0) {
      const jsxStr = store
        .getState()
        .map(
          (item, index) =>
            item.completed && (
              <TodoComponent key={index} item={item} index={index} />
            )
        );
      ReactDOM.render(jsxStr, document.getElementById("list"));
    } else {
      ReactDOM.render(<></>, document.getElementById("list"));
    }
  }
}
// init render
render(condition);

// listen dispatch then render
store.subscribe(() => {
  render(condition);
});
