document.addEventListener("DOMContentLoaded", function () {

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", function () {

        if (window.scrollY > 30) {
            navbar.classList.add("shadow");
        }
        else {
            navbar.classList.remove("shadow");
        }

    });

});