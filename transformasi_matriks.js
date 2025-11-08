function createTranslation(Tx, Ty){
    var translasi = [
        [1,0,Tx],
        [0,1,Ty],
        [0,0,1]
    ];
    return translasi;
}

function transform_titik(titik_lama,m){
    var x_baru = m[0][0]* titik_lama.x + m[0][1]* titik_lama.y +  m[0][2]* 1;
    var y_baru = m[1][0]* titik_lama.x + m[1][1]* titik_lama.y +  m[1][2]* 1;

    return{x:x_baru, y:y_baru};
}
