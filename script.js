async function predict() {

    const f1 = document.getElementById("f1").value;
    const f2 = document.getElementById("f2").value;
    const f3 = document.getElementById("f3").value;
    const f4 = document.getElementById("f4").value;

    if (!f1 || !f2 || !f3 || !f4) {
        alert("Please fill all fields");
        return;
    }

    const features = `${f1},${f2},${f3},${f4}`;

    const formData = new FormData();
    formData.append("features", features);

    try {
        document.getElementById("result").innerText = "Predicting...";

        const response = await fetch("http://127.0.0.1:8000/predict/", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();

        let resultText = "";

        if (data.prediction === 0) resultText = "Setosa 🌱";
        else if (data.prediction === 1) resultText = "Versicolor 🌿";
        else if (data.prediction === 2) resultText = "Virginica 🌸";
        else resultText = "Unknown";

        document.getElementById("result").innerText =
            "Prediction: " + resultText;

    } catch (error) {
        console.error(error);
        document.getElementById("result").innerText =
            "Error connecting to API";
    }
}