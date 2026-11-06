let cam;
let handPose;
let hands = [];
let cameraReady = false;
let cameraError = "";
let detectionStarted = false;

let drawingLayer;

let isPinching = false;
let wasPinching = false;

let cursorX = 0;
let cursorY = 0;

let myPicker;
let size = 10;

// Ajustes da pinça*
const PINCH_START = 0.20;
const PINCH_RELEASE = 0.20;

// Tamanho do pincel*
let brushSize = 10;

// Distância entre dois pontos*
function distance(a, b) {
  return dist(a.x, a.y, b.x, b.y);
}

// Espelha a coordenada X para acompanhar a imagem da câmera*
function mirrorX(x) {
    return width - x;
}

function preload() {
  handPose = ml5.handPose({
    flipped: false
  });
}

function setup() {
  createCanvas(640+20, 480+60);
  myPicker = createColorPicker('deeppink');
  myPicker.position(0, 100);

  // Câmara
  cam = createCapture(VIDEO, () => {
    cameraReady = true;
    cam.elt.muted = true;
    cam.elt.playsInline = true;
    cam.elt.play().catch(() => {
      cameraError = "O navegador bloqueou a reprodução do vídeo da câmara.";
    });
      if (!detectionStarted) {
      handPose.detectStart(cam, gotHands);
      detectionStarted = true;
    }
  });
  cam.size(width, height);
  cam.hide();
  cam.elt.addEventListener("error", () => {
    cameraError = "Não foi possível iniciar o vídeo da câmara.";
  });

   // Camada onde os desenhos ficam guardados
  drawingLayer = createGraphics(width, height);
  drawingLayer.clear();

  setTimeout(() => { 
    if (!cameraReady && !cameraError) {
      cameraError =
        "A câmara não iniciou. Fecha outras aplicações que a usem e recarrega a página.";
    }
  }, 15000);
}

function gotHands(results) {
  hands = results;
}

function draw() {
  background(0);

  const videoReady =
    cameraReady && cam.elt.readyState >= 2 && cam.elt.videoWidth > 0;

  if (!videoReady) {
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    text(
      cameraError || "A aguardar imagem da câmara...",
      width / 2,
      height / 2 - 12
    );
    text(
      "Confirma a permissão no navegador, fecha outras apps que usem a câmara e recarrega.",
      width / 2,
      height / 2 + 16
    );
    return;
  }

  textAlign(LEFT, BASELINE);

// Desenha a câmera espelhada
  push();
  translate(width, 0);
  scale(-1, 1);
  image(cam, 0, 0, width, height);
  pop();

  // Mostra os desenhos anteriores
  image(drawingLayer, 0, 0);

  // Se nenhuma mão for detetada, não desenha
  if (hands.length === 0) {
    isPinching = false;
    wasPinching = false;
    return;
  }

  const hand = hands[0];
  const keypoints = hand.keypoints;

  // Pontos necessários
  const thumbTip = keypoints[4];
  const indexTip = keypoints[8];
  const wrist = keypoints[0];
  const middleMcp = keypoints[9];

  if (!thumbTip || !indexTip || !wrist || !middleMcp) {
    return;
  }

  // Distâncias calculadas nas coordenadas originais
  const pinchDistance = distance(thumbTip, indexTip);
  const handSize = distance(wrist, middleMcp);

  // Evita divisão por zero
  const pinchRatio = handSize > 0
    ? pinchDistance / handSize
    : 1;

  // Pinça com limiar de início e de libertação
  if (!isPinching && pinchRatio < PINCH_START) {
    isPinching = true;
  } else if (isPinching && pinchRatio > PINCH_RELEASE) {
    isPinching = false;
  }

  // Espelha a posição do indicador para corresponder à câmera
  cursorX = mirrorX(indexTip.x);
  cursorY = indexTip.y;

  // Desenha enquanto a pinça está ativa
  if (isPinching) {
    if (wasPinching) {
      drawingLayer.stroke(myPicker.color());
      drawingLayer.strokeWeight(brushSize);
      drawingLayer.strokeCap(ROUND);

      drawingLayer.line(
        previousX,
        previousY,
        cursorX,
        cursorY
      );
    
}


    previousX = cursorX;
    previousY = cursorY;
  }

  wasPinching = isPinching;

  // Mostra os pontos da mão, espelhados
  noStroke();
  fill(0, 255, 120);

  for (let i = 0; i < keypoints.length; i++) {
    const point = keypoints[i];

    const mirroredPointX = mirrorX(point.x);

    circle(
      mirroredPointX,
      point.y,
      size
    );
  }

  // Cursor do indicador
  if (isPinching) {
    fill(myPicker.color());
  } else {
    fill(255);
  }

  stroke(0);
  strokeWeight(2);
  circle(cursorX, cursorY, brushSize);

  // Informação de estado
  noStroke();
  fill(255);
  textSize(16);
  text(
    isPinching ? "A desenhar" : "Pinça para desenhar",
    15,25
  );
  text(
    "Pincel: " + brushSize + " | C: limpar | +: aumentar | -: diminuir",
    15,
    47
  );
}

// Teclas de controlo
function keyPressed() {
  if (key === 'c' || key === 'C') {
    drawingLayer.clear();
    wasPinching = false;
  }
  if (key === '+' || key === '+') {
    brushSize += 10;
  } else if (key === '-' || key === '-') {
    brushSize = max(10, brushSize - 10);
  }
}