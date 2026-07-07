$(function () {

    const input = $("#pdfInput");
    const browse = $("#browseButton");
    const dropArea = $("#dropArea");
    const compress = $("#compressButton");
    const clear = $("#clearButton");
    const selected = $("#selectedFile");

    browse.click(function () {

        input.trigger("click");

    });

    input.change(function () {

        if (this.files.length === 0)
            return;

        loadFile(this.files[0]);

    });

    dropArea.on("dragover", function (e) {

        e.preventDefault();

        $(this).addClass("drag");

    });

    dropArea.on("dragleave", function () {

        $(this).removeClass("drag");

    });

    dropArea.on("drop", function (e) {

        e.preventDefault();

        $(this).removeClass("drag");

        let file = e.originalEvent.dataTransfer.files[0];

        if (file)
            loadFile(file);

    });

    function loadFile(file) {

        if (file.type !== "application/pdf") {

            alert("Please select PDF only.");

            return;

        }

        const dt = new DataTransfer();

        dt.items.add(file);

        input[0].files = dt.files;

        selected
            .removeClass("alert-secondary")
            .addClass("alert-success")
            .text(file.name);

        compress.prop("disabled", false);

    }

    clear.click(function () {

        input.val("");

        compress.prop("disabled", true);

        selected
            .removeClass("alert-success")
            .addClass("alert-secondary")
            .text("No file selected.");

    });

    compress.click(function () {

        let form = new FormData();

        form.append("file", input[0].files[0]);

        form.append("quality", $("input[name=quality]:checked").val());

        compress
            .prop("disabled", true)
            .html("<span class='spinner-border spinner-border-sm'></span> Compressing...");

        fetch("/Pdf/CompressPdf", {

            method: "POST",

            body: form

        })

            .then(r => {

                if (!r.ok)
                    throw new Error("Compression failed.");

                return r.blob();

            })

            .then(blob => {

                const url = window.URL.createObjectURL(blob);

                const a = document.createElement("a");

                a.href = url;

                a.download = "Compressed.pdf";

                a.click();

                window.URL.revokeObjectURL(url);

            })

            .catch(e => {

                alert(e.message);

            })

            .finally(() => {

                compress
                    .prop("disabled", false)
                    .html("Compress PDF");

            });

    });

});