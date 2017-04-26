function absz(z) {
    return Math.sqrt((z[0]*z[0]) + (z[1]*z[1]))
}

function multz(z1,z2) {
    var z = Array(2);

    z[0] = z1[0]*z2[0] - z1[1]*z2[1];
    z[1] = z1[0]*z2[1] + z1[1]*z2[0];

    return z;
}

self.addEventListener('message', function(e) {
    var data = e.data;
    var c = Array(2);
    var z = Array(2);
    c[0] = -0.75;
    c[1] = 0.11;

    data.ref.z[1] = data.ref.z[1] + data.stepy * data.begin;

    for(var i = data.begin; i < data.height; i = i + data.walk) {
        data.ref.z[0] = data.zi[0];

        for( var j=0; j < data.width; j++ ){
            var m = 0;
            z[0] = data.ref.z[0];
            z[1] = data.ref.z[1];

            // Bons valores para diminuir o laço
            // ['255/1=255', '255/3=85', '255/5=51', '255/15=17', '255/17=15', '255/51=5', '255/85=3', '255/255=1']
            var k=0;
            while(k < 255 && m < 2) {
                z = multz(z,z);
                z = [z[0]+c[0], z[1]+c[1]]
                m = absz(z);
                k++;
            }

            var blue = Math.floor(28 * Math.log(k)) + 100;// Math.floor((k*k)/256);
            var red  = k;
            var green = Math.floor((k*k)/256);

            var color = "#" + red.toString(16).replace(/^(.)$/, "0$1")
                      + green.toString(16).replace(/^(.)$/, "0$1")
                      + blue.toString(16).replace(/^(.)$/, "0$1");

            postMessage({x:j, y:i, color:color});

            data.ref.z[0] = data.ref.z[0] + data.stepx
        }
        data.ref.z[1] = data.ref.z[1] + data.stepy * data.walk;
    }

}, false);

