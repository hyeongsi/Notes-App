$(document).ready(function () {
	$("#id").on("blur", function () {
		esnText($(this), $("#esntl_idtext"), "* 아이디를 입력해주세요");
	});

	$("#pw").on("blur", function () {
		esnText($(this), $("#esntl_pwtext"), "* 비밀번호를 입력해주세요");
	});

	$(".btn__submit").on("click", function () {
		esnText($("#id"), $("#esntl_idtext"), "* 아이디: 필수정보 입니다.");
		esnText($("#pw"), $("#esntl_pwtext"), "* 비밀번호: 필수정보 입니다.");
	});
});

function esnText(inputObj, textObj, text) {
	if (inputObj.val() == "") {
		textObj.text(text);
	} else {
		textObj.text("");
	}
}
