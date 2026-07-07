$(function () {

    const input = $("#pdfInput");
    const browse = $("#browseButton");
    const drop = $("#dropArea");
    const rotate = $("#rotateButton");
    const clear = $("#clearButton");
    const selected = $("#selectedFile");

    browse.click(function () {

        input.trigger("click");

    });

    input.change(function () {

        if (this.files.length === 0)
            return;

        load(this.files[0]);

    });

    drop.on("dragover", function (e) {

        e.preventDefault();

        $(this).addClass("drag");

    });

    drop.on("dragleave", function () {

        $(this).removeClass("drag");

    });

    drop.on("drop", function (e) {

        e.preventDefault();

        $(this).removeClass("drag");

        load(e.originalEvent.dataTransfer.files[0]);

    });

    function load(file) {

        if (file.type != "application/pdf") {

            alert("Please select PDF.");

            return;

        }

        const dt = new DataTransfer();

        dt.items.add(file);

        input[0].files = dt.files;

        selected
            .removeClass("alert-secondary")
            .addClass("alert-success")
            .text(file.name);

        rotate.prop("disabled", false);

    }

    clear.click(function () {

        input.val("");

        rotate.prop("disabled", true);

        selected
            .removeClass("alert-success")
            .addClass("alert-secondary")
            .text("No file selected.");

    });

    rotate.click(function () {

        const fd = new FormData();

        fd.append("file", input[0].files[0]);

        fd.append("rotation",
            $("input[name=rotation]:checked").val());

        fetch("/Pdf/RotatePdf", {

            method: "POST",

            body: fd

        })

            .then(r => r.blob())

            .then(blob => {

                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");

                a.href = url;

                a.download = "Rotated.pdf";

                a.click();

            });

    });

});