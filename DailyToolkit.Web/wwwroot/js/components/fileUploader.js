class FileUploader {

    constructor(options) {

        this.input = document.getElementById(options.inputId);
        this.browse = document.getElementById(options.browseButtonId);
        this.dropArea = document.getElementById(options.dropAreaId);

        this.allowedExtensions = options.allowedExtensions || [];
        this.allowedMimeTypes = options.allowedMimeTypes || [];

        this.multiple = options.multiple ?? true;

        this.files = [];

        this.onFilesChanged = options.onFilesChanged;

        this.initialize();

    }

    initialize() {

        this.browse.addEventListener("click", e => {

            e.preventDefault();
            e.stopPropagation();

            this.input.click();

        });

        this.input.addEventListener("change", () => {

            if (this.input.files.length === 0)
                return;

            this.addFiles(Array.from(this.input.files));

            this.input.value = "";

        });

        ["dragenter", "dragover"].forEach(event => {

            this.dropArea.addEventListener(event, e => {

                e.preventDefault();
                e.stopPropagation();

                this.dropArea.classList.add("drag");

            });

        });

        ["dragleave", "drop"].forEach(event => {

            this.dropArea.addEventListener(event, e => {

                e.preventDefault();
                e.stopPropagation();

                this.dropArea.classList.remove("drag");

            });

        });

        this.dropArea.addEventListener("drop", e => {

            this.addFiles(Array.from(e.dataTransfer.files));

        });

    }

    addFiles(selectedFiles) {

        selectedFiles.forEach(file => {

            if (!this.isAllowed(file))
                return;

            const exists = this.files.some(f =>
                f.name === file.name &&
                f.size === file.size &&
                f.lastModified === file.lastModified);

            if (!exists)
                this.files.push(file);

        });

        if (this.onFilesChanged)
            this.onFilesChanged(this.files);

    }

    remove(index) {

        this.files.splice(index, 1);

        if (this.onFilesChanged)
            this.onFilesChanged(this.files);

    }

    clear() {

        this.files = [];

        if (this.onFilesChanged)
            this.onFilesChanged(this.files);

    }

    getFiles() {

        return this.files;

    }

    isAllowed(file) {

        if (this.allowedMimeTypes.length > 0) {

            const ok = this.allowedMimeTypes.some(type =>
                file.type.startsWith(type));

            if (!ok) {

                showToast(file.name + " is not supported.", "warning");

                return false;

            }

        }

        if (this.allowedExtensions.length > 0) {

            const extension = file.name
                .substring(file.name.lastIndexOf("."))
                .toLowerCase();

            if (!this.allowedExtensions.includes(extension)) {

                showToast(file.name + " is not supported.", "warning");

                return false;

            }

        }

        return true;

    }

}