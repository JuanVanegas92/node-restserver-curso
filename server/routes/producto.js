const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// ================================================
// Obtener productos
// ================================================
app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 20;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });

});

// ================================================
// Obtener un producto por ID
// ================================================
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario categoria
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productos
            });
        });
});

// ================================================
// Buscar un producto
// ================================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});
// ================================================
// Crear un nuevo producto
// ================================================
app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        //img: body.img,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

// ================================================
// Actualizar un producto
// ================================================
app.put('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario categoria
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no se encontro'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;
        //productoDB.img = body.img;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            });
        });


    });

});

// ================================================
// Borrar un producto
// ================================================
app.delete('/productos/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no encontrado'
                }
            });
        }
        productoBorrado.disponible = false;
        productoBorrado.save((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                producto: productoDB,
                message: 'Producto Borrado'
            });
        });


    });

});
module.exports = app;