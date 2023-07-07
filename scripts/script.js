let boxInput = document.querySelector(".todo__box__input");
let todoList = document.querySelector(".todo__list");
let boxAllckBtn = document.querySelector(".todo__box__allCkBtn");
boxAllckBtn.addEventListener("click", allCkToggle);

let completeClearBtn = document.querySelector(".bottom__clearCompleted");
completeClearBtn.addEventListener("click", clearComplete);

function clearComplete() {
	let itemCk = document.getElementsByClassName("item__checkbox");
	for (let i = itemCk.length - 1; i >= 0; i--) {
		if (itemCk.item(i).checked) {
			deleteItem(itemCk.item(i).parentNode);
		}
	}
}

// 체크박스 토클
function allCkToggle() {
	let itemCk = document.getElementsByClassName("item__checkbox");

	let ck = true;
	for (let i = 0; i < itemCk.length; i++) {
		if (!itemCk.item(i).checked) {
			ck = false;
		}
	}

	for (let i = 0; i < itemCk.length; i++) {
		itemCk.item(i).checked = !ck;
	}

	updateLeftItem();
}

// box의 input에 값을 입력하고 "enter" 입력 시 작동
boxInput.addEventListener("keyup", function (event) {
	if (event.keyCode == 13 && boxInput.value != "") {
		addItem();
		boxInput.value = "";
	}
});

// input의 값을 토대로 item 생성
/* 
<li class="todo__list__item">
  <input type="checkbox" class="item__checkbox" />
  <div class="item__todo">
    할 일<span class="todo--delete">✖</span>
  </div>
</li> 
*/
function addItem() {
	let itemLi = document.createElement("li");
	itemLi.className = "todo__list__item";

	let itemCkBox = document.createElement("input");
	itemCkBox.className = "item__checkbox";
	itemCkBox.setAttribute("type", "checkbox");
	itemCkBox.addEventListener("change", updateLeftItem);

	let itemToDo = document.createElement("div");
	itemToDo.className = "item__todo";

	let itemToDoText = document.createTextNode(boxInput.value);
	itemToDo.appendChild(itemToDoText);

	let itemToDoDel = document.createElement("span");
	itemToDoDel.className = "todo--delete";
	let itemToDoDelText = document.createTextNode("✖");

	itemToDoDel.addEventListener("click", function (e) {
		deleteItem(e.target.parentNode.parentNode);
	});

	itemToDoDel.appendChild(itemToDoDelText);
	itemToDo.appendChild(itemToDoDel);

	itemLi.appendChild(itemCkBox);
	itemLi.appendChild(itemToDo);
	todoList.appendChild(itemLi);

	updateLeftItem();
}

function deleteItem(e) {
	e.remove();

	updateLeftItem();
}

function updateLeftItem() {
	let itemCk = document.getElementsByClassName("item__checkbox");
	let bottomLeftItems = document.querySelector(".bottom__leftItmes");

	let cnt = 0;
	for (let i = 0; i < itemCk.length; i++) {
		if (!itemCk.item(i).checked) {
			cnt++;
		}
	}

	bottomLeftItems.textContent = cnt + " items left";
}
