let model;

async function loadModel() {
  model = await tf.loadLayersModel('model.json');
  console.log('Model loaded');
}

async function predict(imageElement) {
  // Преобразуване на изображението според изискванията на модела
  let tensor = tf.browser.fromPixels(imageElement)
    .resizeNearestNeighbor([224, 224]) // или друг размер
    .toFloat()
    .div(255.0)
    .expandDims();

  let prediction = await model.predict(tensor).data();
  console.log(prediction);

  // Пример: показване на най-вероятния клас
  const classes = ['parrot', 'white stork']; // замени с твоите класове
  let maxIndex = prediction.indexOf(Math.max(...prediction));
  document.getElementById('result').innerText = `Моделът разпознава: ${classes[maxIndex]}`;
}

document.getElementById('upload').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.src = e.target.result;
    img.onload = () => {
      predict(img);
    };
  };
  reader.readAsDataURL(file);
});

loadModel();
