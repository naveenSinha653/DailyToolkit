const browseButton = document.getElementById("browseButton");
const pdfInput = document.getElementById("pdfInput");

const watermarkButton = document.getElementById("watermarkButton");
const clearButton = document.getElementById("clearButton");

const fileName = document.getElementById("fileName");
const dropArea = document.getElementById("dropArea");

let selectedFile = null;

function showValidation(message, controlId) {

    showToast(message, "warning");

    setTimeout(function () {

        document.getElementById(controlId).focus();

    }, 150);
}

// Browse Button
browseButton.addEventListener("click", function (e) {

    e.preventDefault();

    e.stopPropagation();

    pdfInput.click();

});

// Drop Area Click
dropArea.addEventListener("click", function (e) {

    if (e.target === browseButton || browseButton.contains(e.target))
        return;

    pdfInput.click();

});

// Drag
dropArea.addEventListener("dragover", function (e) {

    e.preventDefault();

    dropArea.classList.add("drag");

});

dropArea.addEventListener("dragleave", function () {

    dropArea.classList.remove("drag");

});

// Drop
dropArea.addEventListener("drop", function (e) {

    e.preventDefault();

    dropArea.classList.remove("drag");

    if (e.dataTransfer.files.length > 0) {

        loadFile(e.dataTransfer.files[0]);

    }

});

// File Change
pdfInput.addEventListener("change", function () {

    if (this.files.length === 0)
        return;

    loadFile(this.files[0]);

});

// Load File
function loadFile(file) {

    if (file.type !== "application/pdf") {

        showToast("Please select PDF file.", "warning");

        return;

    }

    selectedFile = file;

    fileName.innerText = file.name;

    watermarkButton.disabled = false;

}

// Clear
clearButton.addEventListener("click", function () {

    selectedFile = null;

    pdfInput.value = "";

    fileName.innerText = "None";

    watermarkButton.disabled = true;

    document.getElementById("watermarkText").value = "";

});

// Watermark
watermarkButton.addEventListener("click", async function () {

    if (selectedFile == null) {

        showValidation("Please select a PDF.", "browseButton");

        return;

    }

    const watermarkText =
        document.getElementById("watermarkText").value.trim();

    if (watermarkText === "") {

        showValidation("Please enter watermark text.", "watermarkText");

        return;

    }

    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("watermarkText", watermarkText);
    formData.append("fontSize", document.getElementById("fontSize").value);
    formData.append("rotation", document.getElementById("rotation").value);
    formData.append("opacity", document.getElementById("opacity").value);

    showLoader("Adding Watermark...");

    try {

        const response = await fetch("/Pdf/WatermarkPdf", {

            method: "POST",

            body: formData

        });

        hideLoader();

        if (!response.ok) {

            showToast(await response.text(), "error");

            return;

        }

        const blob = await response.blob();

        Downloader.downloadBlob(blob, "Watermarked.pdf");

        showToast("Watermark added successfully.");

    }
    catch {

        hideLoader();

        showToast("Something went wrong.", "error");

    }

});