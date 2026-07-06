class HttpClient {

    async postForm(url, formData, loaderText = "Processing...") {

        showLoader(loaderText);

        try {

            const response = await fetch(url, {

                method: "POST",

                body: formData

            });

            hideLoader();

            if (!response.ok) {

                const message = await response.text();

                showToast(message, "error");

                return null;

            }

            return response;

        }
        catch (error) {

            hideLoader();

            console.error(error);

            showToast("Unexpected error occurred.", "error");

            return null;

        }

    }

}

const Http = new HttpClient();