const browseButton = document.getElementById("browseButton");
const pdfInput = document.getElementById("pdfInput");
const deleteButton = document.getElementById("deleteButton");
const clearButton = document.getElementById("clearButton");
const fileName = document.getElementById("fileName");
const dropArea = document.getElementById("dropArea");

let selectedFile = null;

function showValidation(message, controlId) {

    showToast(message, "warning");

    setTimeout(() => {

        document.getElementById(controlId).focus();

    }, 150);

}

browseButton.addEventListener("click", function (e) {

    e.preventDefault();

    e.stopPropagation();

    pdfInput.click();

});

dropArea.addEventListener("click", function (e) {

    if (e.target === browseButton || browseButton.contains(e.target))
        return;

    pdfInput.click();

});

dropArea.addEventListener("dragover", function (e) {

    e.preventDefault();

    dropArea.classList.add("drag");

});

dropArea.addEventListener("dragleave", function () {

    dropArea.classList.remove("drag");

});

dropArea.addEventListener("drop", function (e) {

    e.preventDefault();

    dropArea.classList.remove("drag");

    if (e.dataTransfer.files.length > 0)
        loadFile(e.dataTransfer.files[0]);

});

pdfInput.addEventListener("change", function () {

    if (this.files.length === 0)
        return;

    loadFile(this.files[0]);

});

function loadFile(file) {

    if (file.type !== "application/pdf") {

        showToast("Please select PDF.", "warning");

        return;

    }

    selectedFile = file;

    fileName.innerHTML = file.name;

    deleteButton.disabled = false;

}

clearButton.addEventListener("click", function () {

    selectedFile = null;

    pdfInput.value = "";

    fileName.innerHTML = "None";

    deleteButton.disabled = true;

    document.getElementById("pages").value = "";

});

deleteButton.addEventListener("click", async function () {

    if (selectedFile == null) {

        showValidation("Please select PDF.", "browseButton");

        return;

    }

    const pages = document.getElementById("pages").value.trim();

    if (pages === "") {

        showValidation("Enter page numbers.", "pages");

        return;

    }

    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("pages", pages);

    showLoader("Deleting Pages...");

    try {

        const response = await fetch("/Pdf/DeletePages", {

            method: "POST",

            body: formData

        });

        hideLoader();

        if (!response.ok) {

            showToast(await response.text(), "error");

            return;

        }

        const blob = await response.blob();

        Downloader.downloadBlob(blob, "DeletedPages.pdf");

        showToast("Pages deleted successfully.");

    }
    catch {

        hideLoader();

        showToast("Something went wrong.", "error");

    }

});