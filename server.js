const express = require('express');
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const axios = require('axios');
const fs = require('fs');

//método “engine” para definir el objeto de configuración de handlebars,
app.set("view engine", "handlebars");
app.engine(
    "handlebars",
    exphbs.engine({
        //especificando que la ruta para las vistas sera /views
        layoutsDir: path.join(__dirname, "./views"),
        //ruta donde se encuentran los parciales o componentes
        partialsDir: path.join(__dirname, "./views/partials"),
    })
);

app.get("/", (req, res)=>{
    res.render("index", { layout: "index" });
});

app.get("/agregar", async(req, res)=>{
    // Lógica para agregar un deporte
    const { precio, nombre } = req.query;
    const deporte = { precio, nombre };
    let data;
    try{
        data = JSON.parse(await fs.promises.readFile("deportes.json"));
    }catch(err){
        data = { deportes: [] }
    }
    data.deportes.push(deporte);
    await fs.promises.writeFile("deportes.json", JSON.stringify(data));
    res.send();
});

app.get("/deportes", async(req, res)=>{
    // Lógica para obtener los datos de los deportes
    let data = await fs.promises.readFile("deportes.json", "utf8")
    res.send(data);
});


app.get("/editar", async(req, res)=>{
    // Lógica para editar un deporte
    const { nombre, precio } = req.query;
    try{
        let data = JSON.parse(await fs.promises.readFile("deportes.json"));
        var indice = data.deportes.findIndex(dep => dep.nombre === nombre);
        data.deportes[indice].precio = precio
        await fs.promises.writeFile("deportes.json", JSON.stringify(data));
        res.send("Deporte editado");
    }catch(err){
        console.log(err);
        res.status(500).send("Error al editar el deporte");
    }
});

app.get("/eliminar", async(req, res)=>{
    // Lógica para eliminar un deporte
    const { nombre } = req.query;
    try{
        let data = JSON.parse(await fs.promises.readFile("deportes.json"));
        let indice = data.deportes.findIndex(dep => dep.nombre === nombre);
        data.deportes.splice(indice, 1);
        fs.promises.writeFile("deportes.json", JSON.stringify(data));+
        res.send("Deporte eliminado");
    }catch(err){
        res.status(500).send("Error al intentar eliminar el deporte");
    }
});


app.listen(3000, (req, res)=>{
    console.log("servidor en http://localhost:3000")
})