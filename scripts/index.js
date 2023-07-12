let itemId = 0;
let todoList = [];

$(document).ready(function () {
	// 입력
	let boxInput = $(".todo__box__input");
	boxInput.on("keyup", addToDo);
	boxInput.on("blur", clearBoxInput);

	// 모두 체크
	$(".todo__box__allCkBtn").on("click", completeToggleAll);

	// 모든 데이터 출력
	$(".bottom__allBtn").on("click", showAll);

	// 활성(체크 X) 데이터 출력
	$(".bottom__activeBtn").on("click", showActive);

	// 완료(체크O) 데이터 출력
	$(".bottom__completedBtn").on("click", showComplete);

	// 완료 모두 제거
	$(".bottom__clearCompleted").on("click", clearComplete);
});

// 입력창의 값 제거
function clearBoxInput() {
	$(".todo__box__input").val("");
}

// 아이템 추가
function addToDo(key) {
	if (key.keyCode == 13 && $(".todo__box__input").val() != "") {
		addListItem(itemId++, false, $(".todo__box__input").val());
		clearBoxInput();
	}
}

// 모두 완료 토글
function completeToggleAll() {
	if (todoList.length == 0) {
		return;
	}

	let ckCnt = 0;
	for (let i = 0; i < todoList.length; i++) {
		if (todoList[i].isComplete) {
			ckCnt++;
		}
	}

	let ck = true;
	if (ckCnt == todoList.length) {
		ck = false;
	}

	// db 작업
	for (let i = 0; i < todoList.length; i++) {
		todoList[i].isComplete = ck;
	}

	$(".todo__list__item")
		.children()
		.filter(":checkbox")
		.each((idx, ele) => {
			ele.checked = ck;
		});
}

// 모든 데이터 출력
function showAll() {
	$(".todo__list").empty();

	for (let i = 0; i < todoList.length; i++) {
		let item = {
			id: todoList[i].id,
			isComplete: todoList[i].isComplete,
			text: todoList[i].text,
		};
		addItemHTML(item);
	}
}
// 활성(체크X) 데이터 출력
function showActive() {
	$(".todo__list").empty();

	for (let i = 0; i < todoList.length; i++) {
		if (todoList[i].isComplete) {
			continue;
		}

		let item = {
			id: todoList[i].id,
			isComplete: todoList[i].isComplete,
			text: todoList[i].text,
		};
		addItemHTML(item);
	}
}
// 완료(체크O) 데이터 출력
function showComplete() {
	$(".todo__list").empty();

	for (let i = 0; i < todoList.length; i++) {
		if (!todoList[i].isComplete) {
			continue;
		}

		let item = {
			id: todoList[i].id,
			isComplete: todoList[i].isComplete,
			text: todoList[i].text,
		};
		addItemHTML(item);
	}
}

// 완료 제거
function clearComplete() {
	for (let i = todoList.length - 1; i >= 0; i--) {
		if (todoList[i].isComplete) {
			// db작업
			$(`#${todoList[i].id}`).remove();
			todoList.splice(i, 1);
		}
	}

	console.log(todoList);
}

function addItemHTML(item) {
	let childTag = `
	<li class="todo__list__item" id = "${item.id}"> 
		<input type="checkbox" class="item__checkbox" id="itemCk${item.id}" `;

	if (item.isComplete) {
		childTag += `checked`;
	}

	childTag += `/>
		<label for="itemCk${item.id}"></label>
		<div class="item__todo">
			<input
				type="text"
				class="item__todo__input"
				value="${item.text}"
				readonly
			/>
			<span class="todo--edit">💬</span>
			<span class="todo--delete">✖</span>
		</div>
	</li> `;

	$(".todo__list").append(childTag);
	addLastItemEvent(); // 추가한 태그들 이벤트 추가
	console.log(todoList);
}

// 입력 값을 토대로 item 생성
function addListItem(id, isComplete, text) {
	let item = {
		id: id,
		isComplete: isComplete,
		text: text,
	};

	// db작업
	todoList.push(item);
	addItemHTML(item);
}
// item 삭제
function deleteListItem(obj) {
	let id = obj.attr("id");

	let index = todoList.findIndex((i) => i.id == id);
	console.log(index);
	if (index != -1) {
		obj.remove();
		todoList.splice(index, 1);
		console.log(todoList);
	}
}
// item 수정
function updateListItem() {}

function addLastItemEvent() {
	let ckbox = $(".todo__list li:last-child").children()[0];
	let itemToDo = $(".todo__list li:last-child").children()[2];
	let input = $(itemToDo).children()[0];
	let editBtn = $(itemToDo).children()[1];
	let deleteBtn = $(itemToDo).children()[2];

	// 체크박스 클릭 여부 토글
	$(ckbox).on("change", () => {
		// db작업
		let id = $(ckbox).parent().attr("id");
		let index = todoList.findIndex((i) => i.id == id);
		if (index != -1) {
			todoList[index].isComplete = $(ckbox).is(":checked");
			console.log(todoList);
		}
	});

	// 수정 후 엔터 -> 수정 불가
	$(input).on("keyup", (key) => {
		if (key.keyCode == 13) {
			$(this).attr("readonly", true);
		}
	});
	// 수정 중 다른 동작 -> 수정 불가
	$(input).on("blur", () => {
		$(this).attr("readonly", true);
	});

	$(editBtn).on("click", () => {
		$(input).attr("readonly", true);
	});

	// x 버튼 누르면 삭제
	$(deleteBtn).on("click", () => {
		deleteListItem($(deleteBtn).parent().parent());
	});
}
