const fs = require("fs");
const models = require("../models/query");
const qs = require('qs')
const url = require("url");
module.exports = {
    readFile: (path, statusCode, res) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            res.writeHead(statusCode, {'Content-type': 'text/html'});
            res.write(data);
            res.end();
        });
    },
    render: (req, res) => {
        let data = '';
        req.on('data', chunk => data += chunk)
        req.on('end', () => {
            fs.readFile('./views/render.html', 'utf-8', (err, data) => {
                models.select().then(result => {
                    let html = '';

                    result.forEach((data, index) => {

                        html += '<tr>';
                        html += `<td>${index + 1}</td>`;
                        html += `<td>${data.nameCity}</td>`;
                        html += `<td>${data.nameCountry}</td>`;
                        html += `<td><a class="btn btn-primary" href="/edit?id=${data.id}">Edit</a>
                                    <a class="btn btn-danger" href="/delete-city?id=${data.id}">Delete</a>
                                    <a class="btn btn-primary" href="/show?id=${data.id}">ShowInfo</a><td></td>`
                        html += `</tr>`;
                    })
                    data = data.replace('{render}', html);
                    res.writeHead(200, {'Content-type': 'text/html'});
                    res.write(data);
                    res.end();
                });
            });
        });
    },
    add: (req, res) => {
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', () => {
            let dataAdd = qs.parse(data);
            console.log(dataAdd);
            models.add(dataAdd)
                .then(result => {
                    res.writeHead(301, {
                        Location: '/render' // This is your url which you want
                    });
                    res.end();
                })
        })
    },
    edit: (req, res) => {

    },
    getEdit: (req, res) => {
        fs.readFile('./views/edit.html', 'utf8', (err, dataEdit) => {
            let url1 = url.parse(req.url, true)
            let id = (qs.parse(url1.query)).id;
            models.getEdit(id)
                .then(result => {
                    res.writeHead(200, {'content-type': 'text/html'})
                    dataEdit = dataEdit.replace('<h3></h3>',`<h3>Chỉnh sửa thành phố ${result[0].nameCity}</h3>`)
                    dataEdit = dataEdit.replace('<input type="text" name="nameCity" id="nameCity" placeholder="Thành phố" required>',
                        `<input type="text" name="nameCity" id="nameCity" placeholder="Thành phố" value="${result[0].nameCity}" required></div>`
                    );
                    dataEdit = dataEdit.replace('<input type="text" name="nameCountry" id="nameCountry" placeholder="Quốc gia">',
                        `<input type="text" name="nameCountry" id="nameCountry" placeholder="Quốc gia" value = "${result[0].nameCountry}">`
                    );
                    dataEdit = dataEdit.replace('<input type="number" name="dientich" id="type" placeholder="Diện tích" required>',
                        `<input type="number" name="dientich" id="type" placeholder="Diện tích" value="${result[0].dientich}" required>`
                    );
                    dataEdit = dataEdit.replace('<input type="number" name="danso" id="price" placeholder="Dân số" required>',
                        `<input type="number" name="danso" id="price" placeholder="Dân số" value = "${result[0].danso}" required>`)
                    dataEdit = dataEdit.replace('<input type="number" name="gdp" id="GDP" placeholder="GDP" required>',
                        `<input type="number" name="gdp" id="GDP" placeholder="GDP" value = "${result[0].gdp}" required>`)
                    res.write(dataEdit)
                    res.end();
                });
        });
    },
    postEdit:(req,res)=>{
        let data = '';
        req.on('data', (chunk) => data += chunk);
        req.on('end', () => {
            let url1 = url.parse(req.url, true)
            let id = (qs.parse(url1.query)).id;
            let dataEdit = qs.parse(data);
            models.edit(dataEdit, id)
                .then(result => {
                    res.writeHead(301, {
                        Location: '/showList'
                    });
                    res.end();
                })
        })
    }
}