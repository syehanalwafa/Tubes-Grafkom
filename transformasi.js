function translasi(titik_lama, jarak){
    var x_baru = titik_lama.x + jarak.x; 
    var y_baru = titik_lama.y + jarak.y; 

    return{x:x_baru, y:y_baru};
}

function skalar(titik_lama, sk){
    var x_baru = titik_lama.x * sk.x;
    var y_baru = titik_lama.y * sk.y;

    return{x:x_baru, y:y_baru}; 
}

function rotasi(titik_lama, sudut){
    var x_baru = titik_lama.x * Math.cos(sudut) - titik_lama.y * Math.sin(sudut);
    var y_baru = titik_lama.x * Math.sin(sudut) + titik_lama.y * Math.cos(sudut);

    return{x:x_baru, y:y_baru}; 
}

function rotasi_fp(titik_lama, titik_putar, sudut){
    var p1 = translasi(titik_lama, {x:-titik_putar.x, y:-titik_putar.y})

    var p2 = rotasi(p1, sudut);
    
    var p3 = translasi(p2, titik_putar);

    return p3; 
}

function skalar_fp(titik_lama, titik_putar, sk){
    var p1 = translasi(titik_lama, {x:-titik_putar.x, y:-titik_putar.y})

    var p2 = skalar(p1, sk);
    
    var p3 = translasi(p2, titik_putar);

    return p3; 
}

