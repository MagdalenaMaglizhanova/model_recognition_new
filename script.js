const URL = "./"; // моделът и файловете са в същата папка

let model, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    document.getElementById("imageUpload").addEventListener("change", handleImage);
}

async function handleImage(event) {
    const image = document.getElementById("preview");
    image.src = URL.createObjectURL(event.target.files[0]);

    image.onload = async () => {
        const prediction = await model.predict(image);
        let highestProb = 0;
        let label = "Не е разпознато";

        prediction.forEach(p => {
            if (p.probability > highestProb) {
                highestProb = p.probability;
                label = p.className;
            }
        });

        document.getElementById("result").innerText = `Резултат: ${label} (${(highestProb * 100).toFixed(2)}%)`;
    };
}

init();
