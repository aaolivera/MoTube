
function pushUrl(id) {
    var videoUrl = 'http://www.youtube.com/watch?v=' + id, url;

    url = '/a/pushItem/?';
    url += 'item=' + escape(videoUrl);
    url += '&el=na&bf=false';
    url += '&r=' + new Date().getTime();
    return signateUrl(url);
}


function getInfoUrl(id) {
    var videoUrl = 'http://www.youtube.com/watch?v=' + id, url;

    url = '/a/itemInfo/?';
    url += 'video_id=' + id;
    url += '&ac=www&t=grp';
    url += '&r=' + new Date().getTime();
    return signateUrl(url);
}

function signateUrl(url) {
    var host = 'http://www.youtube-mp3.org';

    return host + url + '&s=' + _sig(url);
}


var b0I = {
    'V': function (I, B, P) {
        return I * B * P;
    },
    'D': function (I, B) {
        return I < B;
    },
    'E': function (I, B) {
        return I == B;
    },
    'B3': function (I, B) {
        return I * B;
    },
    'G': function (I, B) {
        return I < B;
    },
    'v3': function (I, B) {
        return I * B;
    },
    'I3': function (I, B) {
        return I in B;
    },
    'C': function (I, B) {
        return I % B;
    },
    'R3': function (I, B) {
        return I * B;
    },
    'O': function (I, B) {
        return I % B;
    },
    'Z': function (I, B) {
        return I < B;
    },
    'K': function (I, B) {
        return I - B;
    }
};
function _sig (H) {
     var   x3 = ['a', 'c', 'e', 'i', 'h', 'm', 'l', 'o', 'n', 's', 't', '.'],
        G3 = [6, 7, 1, 0, 10, 3, 7, 8, 11, 4, 7, 9, 10, 8, 0, 5, 2],

        M = ['a', 'c', 'b', 'e', 'd', 'g', 'm', '-', 's', 'o', '.', 'p', '3', 'r', 'u', 't', 'v', 'y', 'n'],
        X = [
            [17, 9, 14, 15, 14, 2, 3, 7, 6, 11, 12, 10, 9, 13, 5],
            [11, 6, 4, 1, 9, 18, 16, 10, 0, 11, 11, 8, 11, 9, 15, 10, 1, 9, 6]
        ],
        A = {
            "a": 870,
            "b": 906,
            "c": 167,
            "d": 119,
            "e": 130,
            "f": 899,
            "g": 248,
            "h": 123,
            "i": 627,
            "j": 706,
            "k": 694,
            "l": 421,
            "m": 214,
            "n": 561,
            "o": 819,
            "p": 925,
            "q": 857,
            "r": 539,
            "s": 898,
            "t": 866,
            "u": 433,
            "v": 299,
            "w": 137,
            "x": 285,
            "y": 613,
            "z": 635,
            "_": 638,
            "&": 639,
            "-": 880,
            "/": 687,
            "=": 721
        },
        r3 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
     function fn(I, B) {
        for (var R = 0; b0I["G"](R, I.length) ; R++) {
            if (b0I["E"](I[R], B)) return R;
        }
        return -1;
    };
    var F = 1.51214;
    var N = 3219;
    var lista = [];
    for (var Y = 0; b0I["Z"](Y, H.length) ; Y++) {
        lista.push(N);
        var Q = H["substr"](Y, 1)["toLowerCase"]();
        if (fn(r3, Q) > -1) {
            N = N + (b0I["V"](parseInt(Q), 121, F));
        } else {
            if (b0I["I3"](Q, A)) {
                N = N + (b0I["v3"](A[Q], F));
            }
        }
        N = b0I["B3"](N, 0.1);
    }
    N = Math["round"](b0I["R3"](N, 1000));
    return N;
};






