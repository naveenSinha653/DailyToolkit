const loader = document.getElementById("globalLoader");
const loaderMessage = document.getElementById("loaderMessage");

function showLoader(message = "Processing...") {

    loaderMessage.innerText = message;

    loader.classList.remove("d-none");

}

function hideLoader() {

    loader.classList.add("d-none");

}

function showToast(message, type = "success") {

    const toast = document.getElementById("globalToast");

    const body = document.getElementById("toastMessage");

    toast.className = "toast align-items-center border-0";

    switch (type) {

        case "success":

            toast.classList.add("text-bg-success");

            break;

        case "error":

            toast.classList.add("text-bg-danger");

            break;

        case "warning":

            toast.classList.add("text-bg-warning");

            break;

        default:

            toast.classList.add("text-bg-primary");

            break;
    }

    body.innerText = message;

    bootstrap.Toast.getOrCreateInstance(toast).show();

}