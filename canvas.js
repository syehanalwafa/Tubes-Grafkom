var cnv;
function gambar_titik(imageData, x, y, r, g, b) {
  var index;
  index = 4 * (Math.ceil(x) + Math.ceil(y) * cnv.width);
  imageData.data[index] = r; // red
  imageData.data[index + 1] = g; // green
  imageData.data[index + 2] = b; // blue
  imageData.data[index + 3] = 255; // alfa
}

function dda_line(imageData, x1, y1, x2, y2, r, g, b) {
  var dx = x2 - x1;
  var dy = y2 - y1;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (x2 > x1) {
      var y = y1;
      for (var x = x1; x < x2; x++) {
        y = y + dy / Math.abs(dx);
        gambar_titik(imageData, x, y, r, g, b);
      }
    } else {
      var y = y1;
      for (var x = x1; x > x2; x--) {
        y = y + dy / Math.abs(dx);
        gambar_titik(imageData, x, y, r, g, b);
      }
    }
  } else {
    if (y2 > y1) {
      var x = x1;
      for (var y = y1; y < y2; y++) {
        x = x + dx / Math.abs(dy);
        gambar_titik(imageData, x, y, r, g, b);
      }
    } else {
      var x = x1;
      for (var y = y1; y > y2; y--) {
        x = x + dx / Math.abs(dy);
        gambar_titik(imageData, x, y, r, g, b);
      }
    }
  }
}

function lingkaran_polar(imageData, xc, yc, radius, r, g, b) {
  for (var theta = 0; theta < Math.PI * 2; theta += 0.001) {
    var x = xc + radius * Math.cos(theta);
    var y = yc + radius * Math.sin(theta);
    gambar_titik(imageData, x, y, r, g, b);
  }
}

function FloodFill(imageData, cnv, x, y, toFlood, color) {
  var index = 4 * (x + y * cnv.width);
  var r1 = imageData.data[index];
  var g1 = imageData.data[index + 1];
  var b1 = imageData.data[index + 2];

  if (toFlood.r == r1 && toFlood.g == g1 && toFlood.b == b1) {
    imageData.data[index] = color.r;
    imageData.data[index + 1] = color.g;
    imageData.data[index + 2] = color.b;
    imageData.data[index + 3] = 255;

    FloodFill(imageData, cnv, x + 1, y, toFlood, color);
    FloodFill(imageData, cnv, x - 1, y, toFlood, color);
    FloodFill(imageData, cnv, x, y + 1, toFlood, color);
    FloodFill(imageData, cnv, x, y - 1, toFlood, color);
  }
}

function polygon(imageData, point_array, r, g, b) {
  for (var i = 0; i < point_array.length - 1; i++) {
    var x1 = point_array[i].x;
    var y1 = point_array[i].y;
    var x2 = point_array[i + 1].x;
    var y2 = point_array[i + 1].y;

    dda_line(imageData, x1, y1, x2, y2, r, g, b);
  }

  var x1 = point_array[point_array.length - 1].x;
  var y1 = point_array[point_array.length - 1].y;
  var x2 = point_array[0].x;
  var y2 = point_array[0].y;
  dda_line(imageData, x1, y1, x2, y2, r, g, b);
}

function FloodFillStack(imageData, cnv, x, y, toFlood, color) {
  var index = 4 * (x + y * cnv.width);
  var r1 = imageData.data[index];
  var g1 = imageData.data[index + 1];
  var b1 = imageData.data[index + 2];

  var tumpukan = [];
  tumpukan.push({ x: x, y: y });

  while (tumpukan.length > 0) {
    var titikS = tumpukan.pop();
    var indexS = 4 * (titikS.x + titikS.y * cnv.width);
    var r1 = imageData.data[indexS];
    var g1 = imageData.data[indexS + 1];
    var b1 = imageData.data[indexS + 2];

    if (toFlood.r == r1 && toFlood.g == g1 && toFlood.b == b1) {
      imageData.data[indexS] = color.r;
      imageData.data[indexS + 1] = color.g;
      imageData.data[indexS + 2] = color.b;
      imageData.data[indexS + 3] = 255;

      tumpukan.push({ x: titikS.x + 1, y: titikS.y });
      tumpukan.push({ x: titikS.x - 1, y: titikS.y });
      tumpukan.push({ x: titikS.x, y: titikS.y + 1 });
      tumpukan.push({ x: titikS.x, y: titikS.y - 1 });
    }
  }
}

cnv = document.querySelector("#canva1");
var contex1;
contex1 = cnv.getContext("2d");
var imageData = contex1.getImageData(0, 0, cnv.width, cnv.height);



function draw() {
  var input = document.getElementById("inputAngka");
  var tombol = document.querySelector("button");

  if (typeof window.root === "undefined") {
    window.root = null;
  }

  function tinggi(node) {
    if (node === null) {
      return 0;
    }
    return node.height;
  }

  function Balance(node) {
    if (node === null) {
      return 0;
    }
    return tinggi(node.left) - tinggi(node.right);
  }

  function rotasiKanan(y) {
    let x = y.left;
    let T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(tinggi(y.left), tinggi(y.right)) + 1;
    x.height = Math.max(tinggi(x.left), tinggi(x.right)) + 1;

    return x;
  }

  function rotasiKiri(x) {
    let y = x.right;
    let T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(tinggi(x.left), tinggi(x.right)) + 1;
    y.height = Math.max(tinggi(y.left), tinggi(y.right)) + 1;

    return y;
  }

  function insertNode(root, value) {
    if (root === null) {
      return { val: value, left: null, right: null, height: 1, x: 0, y: 0 };
    }

    if (value < root.val) {
      root.left = insertNode(root.left, value);
    } else if (value > root.val) {
      root.right = insertNode(root.right, value);
    } else {
      return root;
    }

    root.height = 1 + Math.max(tinggi(root.left), tinggi(root.right));
    let balance = Balance(root);

    if (balance > 1 && value < root.left.val) {
      return rotasiKanan(root);
    }

    if (balance < -1 && value > root.right.val) {
      return rotasiKiri(root);
    }
    if (balance > 1 && value > root.left.val) {
      root.left = rotasiKiri(root.left);
      return rotasiKanan(root);
    }
    if (balance < -1 && value < root.right.val) {
      root.right = rotasiKanan(root.right);
      return rotasiKiri(root);
    }

    return root;
  }

  function minValueNode(node) {
  let current = node;
  while (current.left !== null) current = current.left;
  return current;
}

function deleteNode(root, value) {
  // Step 1: delete seperti BST biasa
  if (root === null) return root;

  if (value < root.val) {
    root.left = deleteNode(root.left, value);
  } else if (value > root.val) {
    root.right = deleteNode(root.right, value);
  } else {
    // Node ditemukan
    if (root.left === null || root.right === null) {
      let temp = root.left ? root.left : root.right;

      // Tidak punya anak
      if (temp === null) {
        root = null;
      } else {
        root = temp;
      }
    } else {
      // Dua anak -> ambil inorder successor
      let temp = minValueNode(root.right);
      root.val = temp.val;
      root.right = deleteNode(root.right, temp.val);
    }
  }

  // Jika sudah null (base case)
  if (root === null) return root;

  // Step 2: Update tinggi node
  root.height = 1 + Math.max(tinggi(root.left), tinggi(root.right));

  // Step 3: Hitung balance factor
  let balance = Balance(root);

  // Step 4: Rotasi AVL
  // Left Left
  if (balance > 1 && Balance(root.left) >= 0) {
    return rotasiKanan(root);
  }

  // Left Right
  if (balance > 1 && Balance(root.left) < 0) {
    root.left = rotasiKiri(root.left);
    return rotasiKanan(root);
  }

  // Right Right
  if (balance < -1 && Balance(root.right) <= 0) {
    return rotasiKiri(root);
  }

  // Right Left
  if (balance < -1 && Balance(root.right) > 0) {
    root.right = rotasiKanan(root.right);
    return rotasiKiri(root);
  }

  return root;
}

  function aturPosisiNode(node, depth, xMin, xMax) {
    if (node === null) return;
    node.y = 80 * depth;
    node.x = (xMin + xMax) / 2;
    aturPosisiNode(node.left, depth + 1, xMin, node.x - 40);
    aturPosisiNode(node.right, depth + 1, node.x + 40, xMax);
  }

  function cariBatas(node, minmax) {
    if (node === null) {
      return;
    }
    if (node.x < minmax.minX) {
      minmax.minX = node.x;
    }
    if (node.x > minmax.maxX) {
      minmax.maxX = node.x;
    }
    cariBatas(node.left, minmax);
    cariBatas(node.right, minmax);
  }

  function geserNode(node, dx) {
    if (node === null) {
      return;
    }
    node.x += dx;
    geserNode(node.left, dx);
    geserNode(node.right, dx);
  }

  function gambarNode(imageData, node) {
    if (node === null) {
      return;
    }
    if (node.left) {
      dda_line(imageData, node.x, node.y, node.left.x, node.left.y, 0, 0, 0);
    }

    if (node.right) {
      dda_line(imageData, node.x, node.y, node.right.x, node.right.y, 0, 0, 0);
    }
    lingkaran_polar(imageData, node.x, node.y, 20, 0, 0, 255);
    gambarNode(imageData, node.left);
    gambarNode(imageData, node.right);
  }

  tombol.onclick = function () {
    var nilai = parseInt(input.value);
    if (nilai !== nilai){
      return;
    }

  document.getElementById("hapusButton").onclick = function () {
  var nilai = parseInt(input.value);
  if (isNaN(nilai)) return;

  window.root = deleteNode(window.root, nilai);

  // Gambar ulang tree
  aturPosisiNode(window.root, 1, 50, cnv.width - 50);

  var batas = { minX: Infinity, maxX: -Infinity };
  cariBatas(window.root, batas);
  var treeWidth = batas.maxX - batas.minX;
  var centerShift = cnv.width / 2 - (batas.minX + treeWidth / 2);
  geserNode(window.root, centerShift);

  // Reset canvas
  imageData = contex1.getImageData(0, 0, cnv.width, cnv.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = 255;
    imageData.data[i + 1] = 255;
    imageData.data[i + 2] = 255;
    imageData.data[i + 3] = 255;
  }

  gambarNode(imageData, window.root);
  contex1.putImageData(imageData, 0, 0);

  // Tampilkan angka node
  function gambarTeks(node) {
    if (node === null) return;
    contex1.font = "16px Arial";
    contex1.fillStyle = "black";
    var teks = node.val.toString();
    var offsetText = teks.length === 1 ? 5 : 10;
    contex1.fillText(teks, node.x - offsetText, node.y + 5);
    gambarTeks(node.left);
    gambarTeks(node.right);
  }
  gambarTeks(window.root);

  input.value = "";
};

    window.root = insertNode(window.root, nilai);
    aturPosisiNode(window.root, 1, 50, cnv.width - 50);

    var batas = { minX: Infinity, maxX: -Infinity };
    cariBatas(window.root, batas);
    var treeWidth = batas.maxX - batas.minX;
    var centerShift = cnv.width / 2 - (batas.minX + treeWidth / 2);
    geserNode(window.root, centerShift);

    imageData = contex1.getImageData(0, 0, cnv.width, cnv.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = 255;
      imageData.data[i + 1] = 255;
      imageData.data[i + 2] = 255;
      imageData.data[i + 3] = 255;
    }

    gambarNode(imageData, window.root);
    contex1.putImageData(imageData, 0, 0);

    function gambarTeks(node) {
      if (node === null){
        return;
      }
      contex1.font = "16px Arial";
      contex1.fillStyle = "black";
      var teks = node.val.toString();
      var offsetText = teks.length === 1 ? 5 : 10;
      contex1.fillText(teks, node.x - offsetText, node.y + 5);
      gambarTeks(node.left);
      gambarTeks(node.right);
    }
    gambarTeks(window.root);

    input.value = "";
  };
}
draw();

contex1.putImageData(imageData, 0, 0);
