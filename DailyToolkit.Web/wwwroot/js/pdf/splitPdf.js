const browseButton = document.getElementById("browseButton");
const pdfInput = document.getElementById("pdfInput");
const dropArea = document.getElementById("dropArea");
const splitButton = document.getElementById("splitButton");
const pageRange = document.getElementById("pageRange");

let selectedFile = null;

browseButton.addEventListener("click", function (e) {

    e.preventDefault();
    e.stopPropagation();

    pdfInput.click();

});

["dragenter", "dragover"].forEach(event => {

    dropArea.addEventListener(event, function (e) {

        e.preventDefault();
        e.stopPropagation();

        dropArea.classList.add("drag");

    });

});

["dragleave", "drop"].forEach(event => {

    dropArea.addEventListener(event, function (e) {

        e.preventDefault();
        e.stopPropagation();

        dropArea.classList.remove("drag");

    });

});

dropArea.addEventListener("drop", function (e) {

    if (e.dataTransfer.files.length > 0)
        selectedFile = e.dataTransfer.files[0];

    updateUI();

});

pdfInput.addEventListener("change", function () {

    if (this.files.length > 0)
        selectedFile = this.files[0];

    updateUI();

});

function updateUI() {

    if (!selectedFile)
        return;

    showToast(selectedFile.name + " selected.", "success");

}

splitButton.addEventListener("click", async function () {

    if (!selectedFile) {

        showToast("Please select a PDF.", "warning");

        return;

    }

    if (pageRange.value.trim() === "") {

        showToast("Please enter page range.", "warning");

        return;

    }

    const formData = new FormData();

    formData.append("file", selectedFile);

    formData.append("pageRange", pageRange.value);

    const response = await Http.postForm(
        "/Pdf/SplitPdf",
        formData,
        "Splitting PDF..."
    );

    if (!response)
        return;

    const blob = await response.blob();

    Downloader.downloadBlob(blob, "Split.pdf");

    showToast("Split completed.", "success");

});