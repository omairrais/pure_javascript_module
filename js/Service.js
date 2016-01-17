(function() {
    var services = {};
        services.url = 'data/data.json';
        services.get = function () {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', encodeURI(services.url), false);
            xhr.onload = function () {
                /*if (xhr.status === 200) { callback(xhr);
                }else { alert('Request failed.  Returned status of ' + xhr.status);
                }*/
            };
            xhr.send();
            return JSON.parse(xhr.responseText);
        };
    services.models = function(count){
        var m = services.get().results;
        var data = [];
        for(var x in m){
            if(x == count){ break; }
            data.push(m[x]);
        }
        return data;
    }

    window.Service = services;
})();
