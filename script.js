const URL = "./"; // моделът и файловете са в същата папка

let model, maxPredictions;

async function init() {
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        console.log("Зареждам модела...");
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("Моделът е зареден. Брой класове:", maxPredictions);

        document.getElementById("imageUpload").addEventListener("change", handleImage);
    } catch (error) {
        console.error("Грешка при зареждане на модела:", error);
    }
}

async function handleImage(event) {
    try {
        const image = document.getElementById("preview");
        image.src = URL.createObjectURL(event.target.files[0]);
        console.log("Избрана е снимка:", event.target.files[0].name);

        image.onload = async () => {
            console.log("Изображението се зареди, правя предсказание...");
            const prediction = await model.predict(image);
            console.log("Предсказание:", prediction);

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
    } catch (error) {
        console.error("Грешка при предсказанието:", error);
    }
}

init();
