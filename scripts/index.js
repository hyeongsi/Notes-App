let itemId = 0;
let todoList = [];
// {
// 	id:
// 	isComplete:
// 	text:
// }

const Mode = {
	ALL: "ALL",
	ACTIVE: "ACTIVE",
	COMPLETED: "COMPLETED",
};
let mode = Mode.ALL;

$(document).ready(function () {
	// 입력
	let boxInput = $(".todo__box__input");
	boxInput.on("keyup", addToDo);
	boxInput.on("blur", clearBoxInput);

	// $(."menu__container").append(메뉴와 관련된 버튼, 텍스트 등 정보);
	// 로그인 여부를 확인하고 메뉴 적절히 생성하는 코드 필요
	// <div class="menu btn" id="login">로그인</div>
	// <div class="menu btn" id="register">회원가입</div>

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
		reloadExplain();
	}
}

// 모드 변경
function changeMode(value) {
	mode = value;
	reloadExplain();
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

	if (mode != Mode.ALL) {
		if (mode == Mode.ACTIVE) {
			showActive();
		} else if (mode == Mode.COMPLETED) {
			showComplete();
		}
	}
}

// 모든 데이터 출력
function showAll() {
	changeMode(Mode.ALL);

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
	changeMode(Mode.ACTIVE);

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
	changeMode(Mode.COMPLETED);
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

	reloadExplain();
}

// 실제 Item을 html요소로 화면에 출력
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

	if (mode == Mode.ACTIVE && isComplete) {
		return;
	} else if (mode == Mode.COMPLETED && !isComplete) {
		return;
	}

	addItemHTML(item);
}
// item 삭제
function deleteListItem(obj) {
	let id = obj.attr("id");

	let index = todoList.findIndex((i) => i.id == id);
	if (index != -1) {
		obj.remove();
		todoList.splice(index, 1);
	}

	reloadExplain();
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

		let isCk = $(ckbox).is(":checked");
		if (index != -1) {
			todoList[index].isComplete = isCk;
		}

		reloadExplain();
		if (mode == Mode.ACTIVE && isCk) {
			$(ckbox).parent().remove();
		} else if (mode == Mode.COMPLETED && !isCk) {
			$(ckbox).parent().remove();
		}
	});

	// 수정 후 엔터 -> 수정 불가
	$(input).on("keyup", function (key) {
		if (key.keyCode == 13) {
			$(this).attr("readonly", true);
			editInputVal(this);
		}
	});
	// 수정 중 다른 동작 -> 수정 불가
	$(input).on("blur", function () {
		$(this).attr("readonly", true);
		editInputVal(this);
	});

	$(editBtn).on("click", () => {
		$(input).attr("readonly", false);
		$(input).focus();
	});

	// x 버튼 누르면 삭제
	$(deleteBtn).on("click", () => {
		deleteListItem($(deleteBtn).parent().parent());
	});
}

// 좌측 하단 아이템이 몇개인지 알려주는 텍스트 갱신
function reloadExplain() {
	if (mode == Mode.ALL) {
		$(".bottom__leftItmes").text(`${todoList.length} items`);
		return;
	}

	let compCnt = 0;
	$.each(todoList, function (idx, ele) {
		if (ele.isComplete) compCnt++;
	});

	if (mode == Mode.ACTIVE) {
		$(".bottom__leftItmes").html(`<b>Active</b> ${todoList.length - compCnt} items`);
	} else {
		$(".bottom__leftItmes").html(`<b>Complete</b> ${compCnt} items`);
	}
}

function findListObj(id) {
	for (let i = 0; i < todoList.length; i++) {
		if (todoList[i].id == id) {
			return todoList[i];
		}
	}

	return null;
}

function editInputVal(input) {
	let item = findListObj($(input).parent().parent().attr("id"));
	if (item == null) {
		return;
	}

	if ($(input).val() == "") {
		$(input).val(item.text);
	} else {
		// db작업
		item.text = $(input).val();
	}
}
