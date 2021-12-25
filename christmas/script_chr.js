window.addEventListener("load", function () {
	document.getElementById("wrapper").style.display = "block";
});
document.addEventListener("click", (e) => {
	//create span for snowflake
	var snowflake = document.createElement("span");
	snowflake.classList.add("snowflake-c");
	//set position of snowflake to mouse pointer's position
	snowflake.style.left = e.offsetX + "px";
	snowflake.style.top = e.offsetY + "px";
	var size = Math.random() * (90 - 15 + 1) + 15;
	// set width and height
	snowflake.style.width = size + "px";
	snowflake.style.height = size + "px";
	document.body.appendChild(snowflake);
	//snowflake disappears after 2000 ms
	setTimeout(() => {
		snowflake.remove();
	}, 1000);
});
