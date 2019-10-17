const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')

const app = express();

let Categoria = require('../models/categoria');

//===================================================
// Mostrar todas las categorias
//===================================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        });
});
//===================================================
// Mostrar una categoria por ID
//===================================================
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById(....);
    let id = req.params.id;
    Categoria.findById(id, (err, categorias) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categorias) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no se a encontrado'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categorias
        });
    });
});

//===================================================
// Crear una nueva Categoria
//===================================================
app.post('/categoria', verificaToken, (req, res) => {
    //Regresa la nueva categoria
    //req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//===================================================
// Actualiza una categoria
//===================================================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//===================================================
// Elimina una categoria
//===================================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo un administrador puede borrar las categorias
    //Categoria.findByIdAndRemove
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });
    });
});


module.exports = app;