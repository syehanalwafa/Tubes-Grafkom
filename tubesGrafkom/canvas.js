var cnv;
function gambar_titik(imageData, x, y, r, g, b){
    var index; 
    index = 4 * (Math.ceil(x) + ( Math.ceil(y) * cnv.width)); 
    imageData.data[index] = r; // red
    imageData.data[index + 1] = g; // green 
    imageData.data[index + 2] = b; // blue
    imageData.data[index + 3] = 255; // alfa
}

function dda_line(imageData, x1, y1, x2, y2, r, g, b){
    var dx = x2 - x1; 
    var dy = y2 - y1; 

    if(Math.abs(dx) > Math.abs(dy)){
        if(x2 > x1){
            var y = y1;
            for(var x = x1 ; x < x2 ; x++){
                y = y+(dy / Math.abs(dx));
                gambar_titik(imageData, x, y, r, g, b); 
            }
        }else{
            var y = y1;
            for(var x = x1 ; x > x2 ; x--){
                y = y+(dy / Math.abs(dx));
                gambar_titik(imageData, x, y, r, g, b); 
            }
        }
    }else{
        if(y2 > y1){
            var x = x1; 
            for(var y = y1 ; y < y2 ; y++){
                x = x + (dx / Math.abs(dy))
                gambar_titik(imageData, x, y, r, g, b); 
            }
        }else{
            var x = x1;
            for(var y = y1 ; y > y2 ; y--){
                x = x+(dx / Math.abs(dy));
                gambar_titik(imageData, x, y, r, g, b); 
            }
        }
    }
}

function lingkaran_polar(imageData, xc, yc, radius, r, g, b){
    for(var theta = 0; theta < Math.PI*2; theta += 0.001){
        var x = xc + radius * Math.cos(theta); 
        var y = yc + radius * Math.sin(theta);
        gambar_titik(imageData, x, y, r, g, b); 
    }
}

function spiral(imageData, xc, yc, radius, r, g, b){
    for(var theta = 0; theta < Math.PI*6; theta += 0.001){
        radius = 5 * theta; 
        var x = xc + radius * Math.cos(theta); 
        var y = yc + radius * Math.sin(theta);
        gambar_titik(imageData, x, y, r, g, b); 
    }
}

function flower(imageData, xc, yc, radius, r, g, b){
    for(var theta = 0; theta < Math.PI*2; theta += 0.001){
        var n = 7;
        var x = xc + radius * Math.cos(theta) * Math.cos(theta  * n); 
        var y = yc + radius * Math.cos(theta * n) * Math.sin(theta);
        gambar_titik(imageData, x, y, r, g, b); 
    }
}

function oval(imageData, xc, yc, radiusx, radiusy, r, g, b){
    for(var theta = 0; theta < Math.PI*2; theta += 0.01){
        var x = xc + radiusx * Math.cos(theta); 
        var y = yc + radiusy * Math.sin(theta);
        gambar_titik(imageData, x, y, r, g, b); 
    }
}

function gambar_lingkaran(imageData, xc, yc, radius, r, g, b){
    for(var x = xc-radius; x<xc+radius; x++){
        var y = yc + Math.sqrt(Math.pow(radius, 2) - Math.pow((x - xc), 2))
        gambar_titik(imageData, x, y, r, g, b);

        var y = yc - Math.sqrt(Math.pow(radius, 2) - Math.pow((x - xc), 2))
        gambar_titik(imageData, x, y, r, g, b);
    };

    for(var x = xc-radius; x<xc+radius; x++){
        var y = yc + Math.sqrt(Math.pow(radius, 2) - Math.pow((x - xc), 2))
        gambar_titik(imageData, y, x, r, g, b);

        var y = yc - Math.sqrt(Math.pow(radius, 2) - Math.pow((x - xc), 2))
        gambar_titik(imageData, y, x, r, g, b);
    };
        
}

function FloodFill(imageData, cnv, x, y, toFlood, color){
    var index = 4 * (x + (y * cnv.width));
    var r1 = imageData.data[index]; 
    var g1 = imageData.data[index + 1]; 
    var b1 = imageData.data[index + 2];
    
    if((toFlood.r == r1) && (toFlood.g == g1) && (toFlood.b) == b1){
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

function polygon(imageData, point_array, r, g, b){
    for(var i = 0 ; i<point_array.length-1; i++){
        var x1 = point_array[i].x; 
        var y1 = point_array[i].y;
        var x2 = point_array[i + 1].x; 
        var y2 = point_array[i + 1].y;

        dda_line(imageData, x1, y1, x2, y2, r, g, b);
    }

    var x1 = point_array[point_array.length-1].x;
    var y1 = point_array[point_array.length-1].y;
    var x2 = point_array[0].x;
    var y2 = point_array[0].y;
    dda_line(imageData, x1, y1, x2, y2, r, g, b);
}

function FloodFillStack(imageData, cnv, x, y, toFlood, color){
    var index = 4 * (x + (y * cnv.width));
    var r1 = imageData.data[index]; 
    var g1 = imageData.data[index + 1]; 
    var b1 = imageData.data[index + 2];
    
    var tumpukan = [];
    tumpukan.push({x:x, y:y});

    while (tumpukan.length>0){
        var titikS = tumpukan.pop();
        var indexS = 4 * (titikS.x + (titikS.y * cnv.width));
        var r1 = imageData.data[indexS]; 
        var g1 = imageData.data[indexS + 1]; 
        var b1 = imageData.data[indexS + 2]; 

        if((toFlood.r == r1) && (toFlood.g == g1) && (toFlood.b) == b1){
            imageData.data[indexS] = color.r; 
            imageData.data[indexS + 1] = color.g; 
            imageData.data[indexS + 2] = color.b;
            imageData.data[indexS + 3] = 255;  

            tumpukan.push({x:titikS.x + 1, y:titikS.y});
            tumpukan.push({x:titikS.x - 1, y:titikS.y});
            tumpukan.push({x:titikS.x, y:titikS.y + 1});
            tumpukan.push({x:titikS.x, y:titikS.y - 1});
        }
    }
}

cnv = document.querySelector("#canva1");
var contex1;
contex1 = cnv.getContext("2d");
var imageData = contex1.getImageData(0,0,cnv.width, cnv.height);

point_array = [
    {x:95, y:95}, 
    {x:158, y:85}, 
    {x:190, y:150},
    {x:170, y:200},
    {x:110, y:220},
    {x:75, y:160}];

function draw() {
  var input = document.getElementById("inputAngka");
  var tombol = document.querySelector("button");

  if (typeof window.root === "undefined") {
    window.root = null;
  }

  // Fungsi untuk menghitung posisi node secara dinamis berdasarkan level
  function insertNode(root, value, x, y, depth) {
    if (root === null) {
      return { val: value, left: null, right: null, x: x, y: y, depth: depth };
    }

    var offset = 120 / Math.pow(2, depth); // semakin dalam, jarak horizontal mengecil

    if (value < root.val) {
      if (root.left === null) {
        root.left = { val: value, left: null, right: null, x: root.x - offset * 8, y: root.y + 80, depth: depth + 1 };
      } else {
        insertNode(root.left, value, root.x - offset * 8, root.y + 80, depth + 1);
      }
    } else if (value > root.val) {
      if (root.right === null) {
        root.right = { val: value, left: null, right: null, x: root.x + offset * 8, y: root.y + 80, depth: depth + 1 };
      } else {
        insertNode(root.right, value, root.x + offset * 8, root.y + 80, depth + 1);
      }
    }
    return root;
  }

  // Fungsi untuk mencari batas kiri dan kanan dari pohon
  function cariBatas(node, minmax) {
    if (!node) return;
    if (node.x < minmax.minX) minmax.minX = node.x;
    if (node.x > minmax.maxX) minmax.maxX = node.x;
    cariBatas(node.left, minmax);
    cariBatas(node.right, minmax);
  }

  // Geser semua node biar tetap di tengah canvas
  function geserNode(node, dx) {
    if (!node) return;
    node.x += dx;
    geserNode(node.left, dx);
    geserNode(node.right, dx);
  }

  // Gambar node dan garis
  function gambarNode(imageData, node) {
    if (!node) return;
    if (node.left) dda_line(imageData, node.x, node.y, node.left.x, node.left.y, 0, 0, 0);
    if (node.right) dda_line(imageData, node.x, node.y, node.right.x, node.right.y, 0, 0, 0);
    lingkaran_polar(imageData, node.x, node.y, 20, 0, 0, 255);
    gambarNode(imageData, node.left);
    gambarNode(imageData, node.right);
  }

  tombol.onclick = function () {
    var nilai = parseInt(input.value);
    if (isNaN(nilai)) return;

    // Insert nilai ke pohon
    if (window.root === null) {
      window.root = insertNode(null, nilai, cnv.width / 2, 80, 1);
    } else {
      insertNode(window.root, nilai, cnv.width / 2, 80, 1);
    }

    // Hitung batas kiri & kanan
    var batas = { minX: Infinity, maxX: -Infinity };
    cariBatas(window.root, batas);

    var treeWidth = batas.maxX - batas.minX;
    var centerShift = cnv.width / 2 - (batas.minX + treeWidth / 2);

    // Geser seluruh pohon agar di tengah canvas
    geserNode(window.root, centerShift);

    // Bersihkan kanvas
    imageData = contex1.getImageData(0, 0, cnv.width, cnv.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = 255;
      imageData.data[i + 1] = 255;
      imageData.data[i + 2] = 255;
      imageData.data[i + 3] = 255;
    }

    // Gambar pohon
    gambarNode(imageData, window.root);
    contex1.putImageData(imageData, 0, 0);

    // Gambar angka setelah putImageData
    function gambarTeks(node) {
      if (!node) return;
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
