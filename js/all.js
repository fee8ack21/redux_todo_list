const allBtn = document.getElementById("all-btn");
const activedBtn = document.getElementById("actived-btn");
const finishedBtn = document.getElementById("finished-btn");

allBtn.addEventListener("click", function () {
  if (this.classList.contains("btn-primary")) {
    return;
  } else {
    this.classList.add("btn-primary");
    activedBtn.classList.remove("btn-primary");
    finishedBtn.classList.remove("btn-primary");
    render("all");
  }
});
activedBtn.addEventListener("click", function () {
  if (this.classList.contains("btn-primary")) {
    return;
  } else {
    this.classList.add("btn-primary");
    allBtn.classList.remove("btn-primary");
    finishedBtn.classList.remove("btn-primary");
    render("actived");
  }
});
finishedBtn.addEventListener("click", function () {
  if (this.classList.contains("btn-primary")) {
    return;
  } else {
    this.classList.add("btn-primary");
    activedBtn.classList.remove("btn-primary");
    allBtn.classList.remove("btn-primary");
    render("finished");
  }
});
//
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
    default:
      localStorage.setItem("redux_todos", JSON.stringify(state));
      return state;
  }
}
const store = Redux.createStore(todoApp);
//
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
function toggle(index) {
  // console.log('toggle function')
  store.dispatch({ type: "TODO_COMPLETE", index: index });
}
function remove(index) {
  // console.log('remove function')
  store.dispatch({ type: "TODO_REMOVE", index: index });
}
function render(condition = "all") {
  //
  if (condition === "all") {
    if (store.getState().length > 0) {
      const jsxStr = store.getState().map((item, index) => (
        <li
          className={`d-flex justify-content-between align-items-center py-2 px-3 mb-2 rounded w-100 ${
            item.completed ? "bg-secondary" : "bg-light"
          }`}
          key={item.time}
          onClick={() => {
            toggle(index);
          }}
        >
          <p className={`mb-0 ${item.completed ? "text-white actived" : ""}`}>
            {item.text}
          </p>
          <div>
            <button
              className="btn btn-danger ml-2"
              onClick={(e) => {
                e.stopPropagation();
                remove(index);
              }}
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        </li>
      ));
      //
      ReactDOM.render(jsxStr, document.getElementById("list"));
    } else {
      const jsxStr = <></>;
      ReactDOM.render(jsxStr, document.getElementById("list"));
    }
  } else if (condition === "actived") {
    if (store.getState().length > 0) {
      const jsxStr = store.getState().map(
        (item, index) =>
          !item.completed && (
            <li
              className={`d-flex justify-content-between align-items-center py-2 px-3 mb-2 rounded w-100 ${
                item.completed ? "bg-secondary" : "bg-light"
              }`}
              key={item.time}
              onClick={() => {
                toggle(index);
              }}
            >
              <p
                className={`mb-0 ${item.completed ? "text-white actived" : ""}`}
              >
                {item.text}
              </p>
              <div>
                <button
                  className="btn btn-danger ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(index);
                  }}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </li>
          )
      );
      ReactDOM.render(jsxStr, document.getElementById("list"));
    } else {
      const jsxStr = <></>;
      ReactDOM.render(jsxStr, document.getElementById("list"));
    }
  } else if (condition === "finished") {
    if (store.getState().length > 0) {
      const jsxStr = store.getState().map(
        (item, index) =>
          item.completed && (
            <li
              className={`d-flex justify-content-between align-items-center py-2 px-3 mb-2 rounded w-100 ${
                item.completed ? "bg-secondary" : "bg-light"
              }`}
              key={item.time}
              onClick={() => {
                toggle(index);
              }}
            >
              <p
                className={`mb-0 ${item.completed ? "text-white actived" : ""}`}
              >
                {item.text}
              </p>
              <div>
                <button
                  className="btn btn-danger ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(index);
                  }}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </li>
          )
      );
      ReactDOM.render(jsxStr, document.getElementById("list"));
    } else {
      const jsxStr = <></>;
      ReactDOM.render(jsxStr, document.getElementById("list"));
    }
  }
}
render();
store.subscribe(render);
