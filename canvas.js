var cnv;
//Fungsi ini menggambar satu pixel warna di lokasi (x, y).
function gambar_titik(imageData, x, y, r, g, b) {
  var index;
  index = 4 * (Math.ceil(x) + Math.ceil(y) * cnv.width);
  imageData.data[index] = r; // red
  imageData.data[index + 1] = g; // green
  imageData.data[index + 2] = b; // blue
  imageData.data[index + 3] = 255; // alfa
}

function dda_line(imageData, x1, y1, x2, y2, r, g, b) {
  //Menggambar garis antara dua titik menggunakan algoritma DDA
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
  //Menggambar lingkaran node dengan metode persamaan polar.
  for (var theta = 0; theta < Math.PI * 2; theta += 0.001) {
    var x = xc + radius * Math.cos(theta);
    var y = yc + radius * Math.sin(theta);
    gambar_titik(imageData, x, y, r, g, b);
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
    //Mengembalikan tinggi sebuah node dalam tree. Digunakan untuk perhitungan balance AVL.
    if (node === null) {
      return 0;
    }
    return node.height;
  }

  function Balance(node) {
    //Menghitung balance factor (selisih tinggi kiri & kanan). Menentukan apakah node butuh rotasi
    if (node === null) {
      return 0;
    }
    return tinggi(node.left) - tinggi(node.right);
  }

  function rotasiKanan(y) {
    //Operasi AVL rotation untuk memperbaiki tree yang miring ke kanan
    let x = y.left;
    let T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(tinggi(y.left), tinggi(y.right)) + 1;
    x.height = Math.max(tinggi(x.left), tinggi(x.right)) + 1;

    return x;
  }

  function rotasiKiri(x) {
    //Operasi AVL rotation untuk memperbaiki tree yang miring ke kiri
    let y = x.right;
    let T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(tinggi(x.left), tinggi(x.right)) + 1;
    y.height = Math.max(tinggi(y.left), tinggi(y.right)) + 1;

    return y;
  }

  function insertNode(root, value) {
    //Menambah node ke BST, update tinggi, cek balance, dan lakukan rotasi bila perlu menjadikan tree AVL seimbang
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
    //Mencari node dengan nilai terkecil (dipakai saat delete, mengambil inorder successor)
    let current = node;
    while (current.left !== null) current = current.left;
    return current;
  }

  function deleteNode(root, value) {
    //Menghapus node di BST, lalu re-balance tree dengan rotasi → menjaga sifat AVL tetap benar
    // Step 1: delete seperti BST biasa
    if (root === null) return root;

    if (value < root.val) {
      root.left = deleteNode(root.left, value);
    } else if (value > root.val) {
      root.right = deleteNode(root.right, value);
    } else {
      if (root.left === null || root.right === null) {
        let temp = root.left ? root.left : root.right;

        if (temp === null) {
          root = null;
        } else {
          root = temp;
        }
      } else {
        let temp = minValueNode(root.right);
        root.val = temp.val;
        root.right = deleteNode(root.right, temp.val);
      }
    }

    if (root === null) return root;

    root.height = 1 + Math.max(tinggi(root.left), tinggi(root.right));

    let balance = Balance(root);

    if (balance > 1 && Balance(root.left) >= 0) {
      return rotasiKanan(root);
    }

    if (balance > 1 && Balance(root.left) < 0) {
      root.left = rotasiKiri(root.left);
      return rotasiKanan(root);
    }

    if (balance < -1 && Balance(root.right) <= 0) {
      return rotasiKiri(root);
    }

    if (balance < -1 && Balance(root.right) > 0) {
      root.right = rotasiKanan(root.right);
      return rotasiKiri(root);
    }

    return root;
  }

  function aturPosisiNode(node, depth, xMin, xMax) {
    //Mengatur posisi (x, y) setiap node agar tampilan tree rata dan seimbang pada canvas
    if (node === null) {
      return;
    }
    node.y = 80 * depth;
    node.x = (xMin + xMax) / 2;
    aturPosisiNode(node.left, depth + 1, xMin, node.x - 40);
    aturPosisiNode(node.right, depth + 1, node.x + 40, xMax);
  }

  function cariBatas(node, minmax) {
    //Mencari batas kiri & kanan pohon untuk nanti digeser ke tengah canvas
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
    //Menggeser seluruh node secara horizontal agar tree selalu berada di tengah
    if (node === null) {
      return;
    }
    node.x += dx;
    geserNode(node.left, dx);
    geserNode(node.right, dx);
  }

  // Pola  5x7 untuk angka 0-9 (1 berarti titik menyala)
  const angka = {
    0: ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
    1: ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
    2: ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
    3: ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
    4: ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
    5: ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
    6: ["01110", "10000", "11110", "10001", "10001", "10001", "01110"],
    7: ["11111", "00001", "00010", "00100", "01000", "10000", "10000"],
    8: ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
    9: ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  };

  // Menggambar satu angka dengan titik
  function gambarDigit(imageData, digit, offsetX, offsetY, warna = [0, 0, 0]) {
    const pola = angka[digit];
    if (!pola) return;
    const size = 2; // ukuran tiap titik
    for (let y = 0; y < pola.length; y++) {
      for (let x = 0; x < pola[y].length; x++) {
        if (pola[y][x] === "1") {
          // titik  nyala
          for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
              gambar_titik(imageData, offsetX + x * size + i, offsetY + y * size + j, warna[0], warna[1], warna[2]);
            }
          }
        }
      }
    }
  }

  // Menggambar seluruh angka node di tengah lingkaran
  function gambarAngka(imageData, node) {
    if (node === null) return;

    const teks = node.val.toString();
    const totalLebar = teks.length * 12; // lebar total (tiap angka 12px termasuk jarak)
    let startX = node.x - totalLebar / 2;
    let startY = node.y - 10; // sedikit ke atas agar di tengah

    for (let i = 0; i < teks.length; i++) {
      gambarDigit(imageData, teks[i], startX + i * 12, startY, [0, 0, 0]);
    }

    gambarAngka(imageData, node.left);
    gambarAngka(imageData, node.right);
  }

  function gambarNode(imageData, node) {
    //Menggambar lingkaran node + garis penghubung antar node secara rekursif
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

  function animasiInsert(node) {
    if (node === null) {
      return;
    }
    var langkah = 10;
    var posisiAkhirY = node.y;
    var posisiAwalY = node.y - 200;
    node.y = posisiAwalY;

    var interval = setInterval(() => {
      var matriksTrans = createTranslation(0, langkah);
      var posBaru = transform_titik({ x: node.x, y: node.y }, matriksTrans);
      node.y = posBaru.y;

      if (node.y >= posisiAkhirY) {
        node.y = posisiAkhirY;
        clearInterval(interval);
      }

      imageData = contex1.getImageData(0, 0, cnv.width, cnv.height);
      for (var i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = 255;
        imageData.data[i + 1] = 255;
        imageData.data[i + 2] = 255;
        imageData.data[i + 3] = 255;
      }

      gambarNode(imageData, window.root);
      gambarAngka(imageData, window.root); // tambahkan di sini
      contex1.putImageData(imageData, 0, 0); // baru tampilkan hasilnya
    }, 50);
  }

  function renderUlang() {
    aturPosisiNode(window.root, 1, 50, cnv.width - 50);
    var batas = { minX: cnv.width, maxX: 0 };

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
    gambarAngka(imageData, window.root); // digambar langsung ke imageData yang sama
    contex1.putImageData(imageData, 0, 0); // tampilkan hasil ke canvas
  }

  function cariNode(root, val) {
    //Mencari node dengan nilai tertentu dalam BST (digunakan untuk delete dan animasi)
    if (root === null) {
      return null;
    }
    if (val === root.val) {
      return root;
    }
    if (val < root.val) {
      return cariNode(root.left, val);
    }
    return cariNode(root.right, val);
  }

  tombol.onclick = function () {
    var nilai = parseInt(input.value);
    if (nilai !== nilai) {
      return;
    }

    document.getElementById("hapusButton").onclick = function () {
      var nilai = parseInt(input.value);
      if (nilai !== nilai) {
        return;
      }

      // Mencari node yang akan dihapus
      var nodeHapus = cariNode(window.root, nilai);
      if (nodeHapus === null) {
        return;
      }

      // simpan hasil delete ke root baru
      window.root = deleteNode(window.root, nilai);

      // kalau pohon kosong (semua sudah dihapus)
      if (window.root === null) {
        imageData = contex1.getImageData(0, 0, cnv.width, cnv.height);
        for (var i = 0; i < imageData.data.length; i += 4) {
          imageData.data[i] = 255;
          imageData.data[i + 1] = 255;
          imageData.data[i + 2] = 255;
          imageData.data[i + 3] = 255;
        }
        contex1.putImageData(imageData, 0, 0);
        return;
      }

      // perbarui posisi dan render ulang
      aturPosisiNode(window.root, 1, 50, cnv.width - 50);

      var batas = { minX: cnv.width, maxX: 0 };
      cariBatas(window.root, batas);
      var treeWidth = batas.maxX - batas.minX;
      var centerShift = cnv.width / 2 - (batas.minX + treeWidth / 2);
      geserNode(window.root, centerShift);

      renderUlang();
      input.value = "";
    };

    window.root = insertNode(window.root, nilai);
    aturPosisiNode(window.root, 1, 50, cnv.width - 50);

    var batas = { minX: cnv.width, maxX: 0 };

    cariBatas(window.root, batas);
    var treeWidth = batas.maxX - batas.minX;
    var centerShift = cnv.width / 2 - (batas.minX + treeWidth / 2);
    geserNode(window.root, centerShift);

    renderUlang();

    // cari node terakhir dan muncul animasi
    var nodeBaru = cariNode(window.root, nilai);
    animasiInsert(nodeBaru);

    input.value = "";
  };
}
draw();

contex1.putImageData(imageData, 0, 0);
