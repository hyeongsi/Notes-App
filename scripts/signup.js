$(document).ready(function () {
	$("#id").on("blur", function () {
		esnText($(this), $("#esntl_idtext"), "* 아이디: 필수정보 입니다.");
	});

	$("#pw").on("blur", function () {
		esnText($(this), $("#esntl_pwtext"), "* 비밀번호: 필수정보 입니다.");
	});

	$("#name").on("blur", function () {
		esnText($(this), $("#esntl_nametext"), "* 이름: 필수정보 입니다.");
	});

	$(".btn__submit").on("click", function () {
		esnText($("#id"), $("#esntl_idtext"), "* 아이디: 필수정보 입니다.");
		esnText($("#pw"), $("#esntl_pwtext"), "* 비밀번호: 필수정보 입니다.");
		esnText($("#name"), $("#esntl_nametext"), "* 이름: 필수정보 입니다.");
	});
});

function esnText(inputObj, textObj, text) {
	if (inputObj.val() == "") {
		textObj.text(text);
	} else {
		textObj.text("");
	}
}
