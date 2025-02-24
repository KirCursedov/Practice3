const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'products.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Ошибка загрузки данных о товарах');
            return;
        }
        const products = JSON.parse(data);
        res.send(`
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Каталог товаров</title>
                <style>
                    .card { border: 1px solid #ccc; margin: 10px; padding: 10px; width: 200px; }
                    .cards-container { display: flex; flex-wrap: wrap; }
                </style>
            </head>
            <body>
                <h1>Каталог товаров</h1>
                <div class="cards-container">
                    ${products.map(product => `
                        <div class="card">
                            <h2>${product.name}</h2>
                            <p>Цена: ${product.price} ₽</p>
                            <p>${product.description}</p>
                        </div>
                    `).join('')}
                </div>
            </body>
            </html>
        `);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
