let itemId = 0;
let todoList = [];

$(document).ready(function () {
	// 입력
	let boxInput = $(".todo__box__input");
	boxInput.on("keyup", addToDo);
	boxInput.on("blur", clearBoxInput);

	// 모두 체크
	$(".todo__box__allCkBtn").on("click", completeToggleAll);

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
		addListItem();
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

// 완료 제거
function clearComplete() {
	for (let i = todoList.length - 1; i >= 0; i--) {
		if (todoList[i].isComplete) {
			// db작업
			$(`#${todoList[i].id}`).remove();
			todoList.pop();
		}
	}
}

// input의 값을 토대로 item 생성
function addListItem() {
	let item = {
		id: itemId++,
		isComplete: false,
		text: $(".todo__box__input").val(),
	};

	// db작업
	let childTag = `
	<li class="todo__list__item" id = "${item.id}"> 
		<input type="checkbox" class="item__checkbox" id="itemCk${item.id}" />
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
	</li> 
	`;

	$(".todo__list").append(childTag);
	todoList.push(item);
	addLastItemEvent(); // 추가한 태그들 이벤트 추가

	console.log(todoList);
}
// item 삭제
function deleteListItem(obj) {}
// item 수정
function updateListItem() {}

function addLastItemEvent() {
	let ckbox = $(".todo__list li:last-child").children()[0];
	let itemToDo = $(".todo__list li:last-child").children()[2];
	let input = $(itemToDo).children()[0];
	let editBtn = $(itemToDo).children()[1];
	let deleteBtn = $(itemToDo).children()[2];

	// 클릭 시 데이터 업데이트
	$(ckbox).on("change", () => {
		// db작업

		//@@@밑부분 버그
		todoList[todoList.length - 1].isComplete = $(this).is(":checked");
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

	$(deleteBtn).on("click", () => {
		deleteListItem($(deleteBtn).parent().parent());
	});
}
