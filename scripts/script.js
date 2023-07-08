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
boxInput.addEventListener("keyup", function (e) {
	if (event.keyCode == 13 && boxInput.value != "") {
		addItem();
		boxInput.value = "";
	}
});
// box lost focus -> text clear
boxInput.addEventListener("blur", function () {
	boxInput.value = "";
});

let itemCkIdCnt = 0;
// input의 값을 토대로 item 생성
function addItem() {
	let itemLi = document.createElement("li");
	itemLi.className = "todo__list__item";

	let itemCkBox = document.createElement("input");
	itemCkBox.className = "item__checkbox";
	itemCkBox.id = "itemCk" + itemCkIdCnt;
	itemCkBox.setAttribute("type", "checkbox");
	itemCkBox.addEventListener("change", updateLeftItem);

	let itemCkBoxLabel = document.createElement("label");
	itemCkBoxLabel.setAttribute("for", "itemCk" + itemCkIdCnt++);

	let itemToDo = document.createElement("div");
	itemToDo.className = "item__todo";

	let itemToDoText = document.createElement("input");
	itemToDoText.className = "item__todo__input";
	itemToDoText.setAttribute("type", "text");
	itemToDoText.setAttribute("value", boxInput.value);
	itemToDoText.setAttribute("readOnly", "readOnly");
	itemToDo.appendChild(itemToDoText);
	itemToDoText.addEventListener("keyup", function (e) {
		if (event.keyCode == 13) {
			e.target.readOnly = true;
		}
	});
	itemToDoText.addEventListener("blur", function (e) {
		e.target.readOnly = true;
	});

	let itemToDoEdit = document.createElement("span");
	itemToDoEdit.className = "todo--edit";
	let itemToDoEditText = document.createTextNode("💬");

	itemToDo.appendChild(itemToDoEdit);
	itemToDoEdit.appendChild(itemToDoEditText);
	itemToDoEdit.addEventListener("click", function (e) {
		editItem(e.target.previousElementSibling);
	});

	let itemToDoDel = document.createElement("span");
	itemToDoDel.className = "todo--delete";
	let itemToDoDelText = document.createTextNode("✖");

	itemToDo.appendChild(itemToDoDel);
	itemToDoDel.appendChild(itemToDoDelText);
	itemToDoDel.addEventListener("click", function (e) {
		deleteItem(e.target.parentNode.parentNode);
	});

	itemLi.appendChild(itemCkBox);
	itemLi.appendChild(itemCkBoxLabel);
	itemLi.appendChild(itemToDo);
	todoList.appendChild(itemLi);

	updateLeftItem();
}

function editItem(e) {
	e.readOnly = false;
	e.focus();
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
