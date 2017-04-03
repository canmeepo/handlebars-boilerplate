//mobile-menu button 
(() => {
	document.querySelector(".btn__mobile").addEventListener("click", function () {
    	this.classList.toggle("active");
    	document.querySelector(".mobile").classList.toggle("display");
	});
})();