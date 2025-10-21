var cnv;
function gambar_titik(imageData, x, y, r, g, b) {
  var index = 4 * (Math.ceil(x) + Math.ceil(y) * cnv.width);
  imageData.data[index] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = 255;
}

function Lingkaran(imageData, xc, yc, radius, r, g, b) {
  for (var theta = 0; theta < Math.PI * 2; theta += 0.001) {
    var x = xc + radius * Math.cos(theta);
    var y = yc + radius * Math.sin(theta);
    gambar_titik(imageData, x, y, r, g, b);
  }
}

function dda_line(imageData, x1, y1, x2, y2, r, g, b) {
    // make atributa 
    var dx = x2 - x1;
    var dy = y2 - y1;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (x2 > x1) {
            var y = y1;
            for (var x = x1; x < x2; x++) {
                y = y + (dy / Math.abs(dx)); // -> 1/m rumus gradient
                gambar_titik(imageData, x, y, r, g, b);
            }
        } else {
            var y = y1;
            for (var x = x1; x > x2; x--) {
                y = y + (dy / Math.abs(dx)); // -> 1/m rumus gradient
                gambar_titik(imageData, x, y, r, g, b);
            }
        }
    } else {
        if (y2 > y1) {
            var x = x1;
            for (var y = y1; y < y2; y++) {
                x = x + (dx / Math.abs(dy))
                gambar_titik(imageData, x, y, r, g, b);
            }
        } else {
            var x = x1;
            for (var y = y1; y > y2; y--) {
                x = x + (dx / Math.abs(dy)); // -> 1/m rumus gradient
                gambar_titik(imageData, x, y, r, g, b);
            }
        }
    }
}

cnv = document.querySelector("#canva1");
var contex1;
contex1 = cnv.getContext("2d");
var imageData = contex1.getImageData(0, 0, cnv.width, cnv.height);

contex1.putImageData(imageData, 0, 0);