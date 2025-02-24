const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 8080;

app.use(bodyParser.json());

const productsFilePath = path.join(__dirname, 'products.json');

// Получить все товары
app.get('/api/products', (req, res) => {
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка загрузки данных');
        }
        res.json(JSON.parse(data));
    });
});

// Добавить новый товар
app.post('/api/products', (req, res) => {
    const newProduct = req.body;

    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка загрузки данных');
        }
        const products = JSON.parse(data);
        products.push(newProduct);

        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Ошибка сохранения данных');
            }
            res.status(201).send(newProduct);
        });
    });
});

// Редактировать товар по ID
app.put('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;

    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка загрузки данных');
        }
        let products = JSON.parse(data);
        const productIndex = products.findIndex(product => product.id === productId);

        if (productIndex === -1) {
            return res.status(404).send('Товар не найден');
        }

        products[productIndex] = { ...products[productIndex], ...updatedProduct };

        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Ошибка сохранения данных');
            }
            res.send(products[productIndex]);
        });
    });
});

// Удалить товар по ID
app.delete('/api/products/:id', (req, res) => {
    const productId = req.params.id;

    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка загрузки данных');
        }
        let products = JSON.parse(data);
        const productIndex = products.findIndex(product => product.id === productId);

        if (productIndex === -1) {
            return res.status(404).send('Товар не найден');
        }

        products.splice(productIndex, 1);

        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Ошибка сохранения данных');
            }
            res.status(204).send();
        });
    });
});

app.listen(port, () => {
    console.log(`Admin server is running on http://localhost:${port}`);
});
