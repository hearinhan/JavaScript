// id=list 인 div에 todo list들을 하나씩 넣어주기 위한 선언
const list = document.getElementById('list');
// id=create-btn 인 button 선언
const createBtn = document.getElementById('create-btn');

// todo list들을 어떠한 배열 안에 넣어주어야 한다.
let todos = [];
// let todos = [{id: asdf, text: '밥먹기', complete : false}];
// 위 처럼 요소를 일일히 넣어줄 수 있다.

// "새로운 TODO 추가하기"를 클릭했을 때, list가 새로 추가되어야 한다.
createBtn.addEventListener('click', createNewTodo);

// 위 Listener가 클릭 되었을 때, 호출되는 함수
function createNewTodo () {
    // 하나의 새로운 아이템 객체 생성
    const item = {
        id : new Date().getTime(), // id는 유니크한 객체여야 한다. -> new Date().getTime() = 1970~현재 시간ms
        text: '', // 텍스트 비어 있음
        complete : false // 처음에 list 생성했을 때, 체크박스 선택 해제 상태
    }

    // 배열 내 처음에 새로운 아이템을 추가한다.
    todos.unshift(item);

    // 요소 생성하기 -> 너무 많아서 따로 밖으로 함수를 빼준다.
    const {itemEl, inputEl, editBtnEl, removeBtnEl} = createTodoElement(item); 


    // 이제까지 createTodoElement(item)를 통해 생성한 것(itemEl, inputEl, editBtnEl, removeBtnEl)을 
    // html의 <div class="todo-list" id="list"></div> 안에 넣어준다.
    // list 요소 안에 방금 생성한 아이템 요소 추가
    list.prepend(itemEl); // prepend() = 노드 중 첫번째 Child 전에 넣는 것이다.

    // 새로운 list 가 추가되자마자 할일을 타이핑 할 수 있게 한다.
    inputEl.removeAttribute('disabled');
    inputEl.focus();

    // 새로고침 해도 데이터 안 날라가게 하는 함수 => 141줄
    saveToLocalStorage();
}

// 요소 생성하기 함수
function createTodoElement (item) {
    const itemEl = document.createElement('div'); // div 생성
    itemEl.classList.add('item'); // div 에 class="item" 추가

    const checkboxEl = document.createElement('input');
    checkboxEl.type = 'checkbox'; // input 에 type="checkbox" 추가
    checkboxEl.checked = item.complete; // checkbox의 checked -> true / false 반영

    if (item.complete) {
        // 새롭게 생성하면 당연히 false 인데 , 이미 생성되어 checked 되어있던 애들은 true이다.
        // refresh(새로고침)을 해도 true로 유지 되어야한다.
        itemEl.classList.add("complete");
    }

    const inputEl = document.createElement ('input');
    inputEl.type = 'text';
    inputEl.value = item.text; // createNewTodo -> const item -> text의 값이 된다.
    inputEl.setAttribute('disabled', ''); // input에 disabled가 있으면 타이핑 할 수 없고 disabled가 없으면 타이핑 할 수 있다.

    // 버튼 (연필 모양, stop 모양) = actions이라는 div 안에 두개의 button이 들어있음
    const actionsEl = document.createElement('div');
    actionsEl.classList.add('actions');
    // 버튼 : 편집 (연필 모양) 생성 및 설정
    const editBtnEl = document.createElement('button');
    editBtnEl.classList.add('material-icons');
    editBtnEl.innerHTML = 'edit';
    // 버튼 : 없애기 (stop 모양) 생성 및 설정
    const removeBtnEl = document.createElement('button');
    removeBtnEl.classList.add('material-icons', 'remove-btn');
    removeBtnEl.innerHTML ='remove_circles';
    // 여기까지 요소들 생성


    // Event
    // checkbox 이벤트
    // checkbox를 클릭하면 체크박스가 선택된 상태이게 하는 것으로 
    // createNewTodo() -> complete의 값을 true-> false / false-> true로 하는 것이다. (toggle 됨)
    checkboxEl.addEventListener('change', () => {
        item.complete = checkboxEl.checked; // checked 클릭 안됬을 땐 false, 한번 클릭 되면 true
        
        // checkbox를 클릭하면 div class="item complete"
        // checkbox를 클릭 안하면 div class="item"
        if(item.complete == true) {
            itemEl.classList.add("complete");
        } else {
            itemEl.classList.remove("complete");
        }
        // 새로고침 해도 데이터 안 날라가게 하는 함수 => 141줄
        saveToLocalStorage();
    })

    // input text 이벤트
    // 타이핑 하는 곳에서 포커스가 없어지면 블럴(blur)이벤트 발생 -> input 요소에 disable이 생긴다.
    // 또 타이핑에 포커스를 주면 disable이 없어진다.
    inputEl.addEventListener('blur', () => {
        inputEl.setAttribute('disabled', '');
        // 새로고침 해도 데이터 안 날라가게 하는 함수 => 141줄
        saveToLocalStorage();
    })
    // 타이핑 한 문구(inputEl)가 createNewTodo() -> item -> text에 들어가도록 한다.
    inputEl.addEventListener('input', () => {
        item.text = inputEl.value
    })

    // edit button 이벤트
    // 위에서 포커스가 벗어나 disable이 생긴 input에 edit 버튼을 누르면 disable이 없어지게 하는 것이다.
    editBtnEl.addEventListener('click', () => {
        inputEl.removeAttribute('disabled');
        inputEl.focus();
    })

    // remove button 이벤트
    // 이 버튼을 누르면 createNewTodo() -> todos -> item 요소를 받아 
    // 7번 줄에 let todos로 배열처럼 생겨져 있던 데이터들 중 remove 한 요소를 완벽히 지워준다.
    removeBtnEl.addEventListener('click', () => {
        // filter() = 내가 클릭한 요소의 id 를 제외한 다른 요소들을 새롭게 배열로 반환한다.
        todos = todos.filter( t => t.id != item.id ); 
        // 실제 눈에 보이는 요소도 없애기
        itemEl.remove();
        // 새로고침 해도 데이터 안 날라가게 하는 함수 => 141줄
        saveToLocalStorage();
    }) 


    // 생성한 요소들을 item에 넣어 준것
    // 일단 버튼 2개 (편집, 없애기)를 div class="actions" 에 넣어주어야 한다.
    // append 1
    actionsEl.append(editBtnEl);
    actionsEl.append(removeBtnEl);
    // 다른 생성한 요소(checkbox, input)들을 div class="item" 안에 넣어주기
    // append 2
    itemEl.append(checkboxEl);
    itemEl.append(inputEl);
    // append1에서 actions로 묶어준 버튼들 div class="actions"를 div class="item" 안에 넣어주기
    // append 3
    itemEl.append(actionsEl);

    // return : 26번 줄로 반환
    return { itemEl, inputEl, editBtnEl, removeBtnEl}
}


// refresh(새로고침)를 해주면 하던 것들이 전부 없어진다.(= 메모리가 초기화 된다.)
// 브라우저 어플리케이션 local storage에서 저장을 해주어 없어지지 않게 한다.
function saveToLocalStorage () {
    const data = JSON.stringify(todos);
    localStorage.setItem("my_todos", data); // localStorage 에 넣을 때는 "Key, Value" 로 넣어준다.
}

// localStorage에 저장되어 있는 데이터를 가져오는 것
function loadFromLocalStorage () {
    const data = localStorage.getItem("my_todos"); // Key 값 가져옴

    if (data) {
        todos = JSON.parse(data); // JSON의 Parse 메서드를 이용해 String -> Object로 변환해줌
    }
}

function displayTodos () {
    loadFromLocalStorage(); // 데이터 가져옴 -> 화면 상에 보여주진 못함
    // todos 안에 들어있는 객체의 수만큼 for문을 돌면서 브라우저에 객체를 보여준다.
    for (let i=0; i<todos.length; i++) {
        const item = todos[i];
        const {itemEl} = createTodoElement(item); // createTodoElement() 이용해 todos의 객체들 호출 및 div 안에 append하는 거 진행

        // 호출한 것들을 html의 <div class="todo-list" id="list"></div> 에 넣어줌
        list.append(itemEl);
    }
}

// 이 displayTodos 함수가 실행되자 마자 스크립트 실행 -> 이제 refresh해도 원래 데이터 보임
displayTodos();


