const convertButton = document.getElementById("convertButton");
const dropArea = document.getElementById("dropArea");

const browseButton = document.getElementById("browseButton");
const imageInput = document.getElementById("imageInput");

const previewContainer = document.getElementById("previewContainer");

const clearButton = document.getElementById("clearButton");

let files = [];

/*=========================
    Browse
=========================*/

browseButton.addEventListener("click", function (e) {

    e.preventDefault();
    e.stopPropagation();

    imageInput.click();

});

/*=========================
    Input
=========================*/

imageInput.addEventListener("change", function () {

    if (this.files.length === 0)
        return;

    addFiles(Array.from(this.files));

    this.value = "";

});

/*=========================
    Drag & Drop
=========================*/

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

    addFiles(Array.from(e.dataTransfer.files));

});

/*=========================
    Add Images
=========================*/

function addFiles(selectedFiles) {

    selectedFiles.forEach(file => {

        if (!file.type.startsWith("image/")) {

            showToast(file.name + " is not an image.", "warning");

            return;

        }

        const exists = files.some(f =>
            f.name === file.name &&
            f.size === file.size &&
            f.lastModified === file.lastModified);

        if (!exists)
            files.push(file);

    });

    render();

}

/*=========================
    Render
=========================*/

function render() {

    convertButton.disabled = files.length === 0;

    previewContainer.innerHTML = "";

    document.getElementById("imageCount").innerText = files.length;

    if (files.length === 0) {

        previewContainer.innerHTML = `

<div class="col-12">

    <div class="alert alert-secondary text-center">

        No images selected.

    </div>

</div>`;

        return;

    }

    files.forEach((file, index) => {

        const reader = new FileReader();

        reader.onload = function (e) {

            previewContainer.innerHTML += `

<div class="col-md-3 mb-4">

<div class="card shadow-sm">

<img src="${e.target.result}" class="preview-image">

<div class="card-body">

<div class="small text-truncate">

${file.name}

</div>

<button
class="btn btn-danger btn-sm mt-2 w-100"
onclick="removeImage(${index})">

Remove

</button>

</div>

</div>

</div>`;

        };

        reader.readAsDataURL(file);

    });

}

/*=========================
    Remove
=========================*/

function removeImage(index) {

    files.splice(index, 1);

    render();

}

/*=========================
    Clear
=========================*/

clearButton.addEventListener("click", function () {

    files = [];

    imageInput.value = "";

    render();

});

/*=========================
    Convert
=========================*/

convertButton.addEventListener("click", async function () {

    if (files.length === 0) {

        showToast("Please select images.", "warning");

        return;

    }

    const formData = new FormData();

    files.forEach(file => {

        formData.append("Images", file);

    });

    formData.append("PageSize", document.getElementById("pageSize").value);
    formData.append("Orientation", document.getElementById("orientation").value);
    formData.append("Margin", document.getElementById("margin").value);

    showLoader("Creating PDF...");

    try {

        const response = await fetch("/Pdf/Convert", {

            method: "POST",

            body: formData

        });

        hideLoader();

        if (!response.ok) {

            showToast(await response.text(), "error");

            return;

        }

        const blob = await response.blob();

        Downloader.downloadBlob(blob, "DailyToolkit.pdf");

        showToast("PDF created successfully.", "success");

    }
    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Something went wrong.", "error");

    }

});

render();