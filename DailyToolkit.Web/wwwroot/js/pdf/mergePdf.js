const browseButton = document.getElementById("browseButton");
const pdfInput = document.getElementById("pdfInput");
const dropArea = document.getElementById("dropArea");

const mergeButton = document.getElementById("mergeButton");
const clearButton = document.getElementById("clearButton");

const fileList = document.getElementById("fileList");
const pdfCount = document.getElementById("pdfCount");

let files = [];

/*==============================
    Browse
==============================*/

browseButton.addEventListener("click", function (e) {

    e.preventDefault();
    e.stopPropagation();

    pdfInput.click();

});

/*==============================
    Input Change
==============================*/

pdfInput.addEventListener("change", function () {

    if (this.files.length === 0)
        return;

    addFiles(Array.from(this.files));

    this.value = "";

});

/*==============================
    Drag & Drop
==============================*/

["dragenter", "dragover"].forEach(eventName => {

    dropArea.addEventListener(eventName, function (e) {

        e.preventDefault();
        e.stopPropagation();

        dropArea.classList.add("drag");

    });

});

["dragleave", "drop"].forEach(eventName => {

    dropArea.addEventListener(eventName, function (e) {

        e.preventDefault();
        e.stopPropagation();

        dropArea.classList.remove("drag");

    });

});

dropArea.addEventListener("drop", function (e) {

    addFiles(Array.from(e.dataTransfer.files));

});

/*==============================
    Add Files
==============================*/

function addFiles(selectedFiles) {

    selectedFiles.forEach(file => {

        if (!file.name.toLowerCase().endsWith(".pdf")) {

            showToast(file.name + " is not a PDF.", "warning");

            return;

        }

        const exists = files.some(f =>
            f.name === file.name &&
            f.size === file.size &&
            f.lastModified === file.lastModified);

        if (!exists)
            files.push(file);

    });

    renderFiles();

}

/*==============================
    Render
==============================*/

function renderFiles() {

    fileList.innerHTML = "";

    pdfCount.innerText = files.length;

    mergeButton.disabled = files.length < 2;

    if (files.length === 0) {

        fileList.innerHTML = `
        <div class="col-12">
            <div class="alert alert-secondary text-center">
                No PDF selected.
            </div>
        </div>`;

        return;

    }

    files.forEach((file, index) => {

        fileList.innerHTML += `
<div class="col-12 mb-3">

    <div class="card shadow-sm">

        <div class="card-body d-flex justify-content-between align-items-center">

            <div>

                <i class="bi bi-file-earmark-pdf-fill text-danger me-2"></i>

                ${file.name}

            </div>

            <button class="btn btn-danger btn-sm"
                    onclick="removeFile(${index})">

                Remove

            </button>

        </div>

    </div>

</div>`;

    });

}

/*==============================
    Remove
==============================*/

window.removeFile = function (index) {

    files.splice(index, 1);

    renderFiles();

};

/*==============================
    Clear
==============================*/

clearButton.addEventListener("click", function () {

    files = [];

    pdfInput.value = "";

    renderFiles();

});

/*==============================
    Merge
==============================*/

mergeButton.addEventListener("click", async function () {

    if (files.length < 2) {

        showToast("Please select at least two PDF files.", "warning");

        return;

    }

    const formData = new FormData();

    files.forEach(file => {

        formData.append("files", file);

    });

    const response = await Http.postForm(
        "/Pdf/MergePdf",
        formData,
        "Merging PDF..."
    );

    if (!response)
        return;

    const blob = await response.blob();

    Downloader.downloadBlob(blob, "Merged.pdf");

    showToast("PDF merged successfully.", "success");

});

renderFiles();