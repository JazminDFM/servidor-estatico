//Importamos el modulo http, fs y path
const http = require("http");
const {createReadStream, stat} = require("fs");
const {join} = require("path");

function tipo(extension){
    if(extension == "html") return "text/html";
    if(extension == "css") return "text/css";
    if(extension == "javascript") return "text/javascript";
    if(extension == "json") return "application/json";
    if(extension == "jpeg") return "image/jpeg";
    if(extension == "png") return "imge/png";
    return "text/plain";
}

function servirFichero(respuesta, ruta, tipo, status){
    let fichero = createReadStream(ruta);

    respuesta.writeHead(status,{"Content-type" : tipo });
    
    fichero.pipe(respuesta);

    //Para que se envie la respuesta
    fichero.on("end", () => respuesta.end);

}

const directorioEstatico = join(__dirname,"publica");

http.createServer((peticion, respuesta) => {

    if(peticion.url == "/"){
        return servirFichero(respuesta, join(directorioEstatico,"index.html"), tipo("html"), 200);
    }

    let ruta = join(directorioEstatico, peticion.url);

    stat(ruta, (error, estadisticas) => {
        if(!error && estadisticas.isFile()){
            return servirFichero(respuesta, ruta, tipo(ruta.split(".").pop()), 200);
        }
        servirFichero(respuesta, join(__dirname, "404.html"), tipo("html"), 404);
    });
//Si tienes una variable de entorno llamada PORT usala y si no usa 4000
}).listen(process.env.PORT || 4000);
