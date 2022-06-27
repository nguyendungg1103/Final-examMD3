const conn = require("./database");
module.exports = {
    select: () => {
        const select = `SELECT * FROM new_table `;
        return new Promise((resolve, reject) => {
            conn.query(select, (err, result) => {
                if (err) throw Error(err.message);
                resolve(result);
            })
        })
    }, add: (data) => {
        const insertSql = `INSERT INTO new_table(nameCity,nameCountry,dientich,danso,gdp,gioithieu) VALUES('${data.nameCity}','${data.nameCountry}',${Number(data.dientich)},${Number(data.danso)},${Number(data.gdp)},'${data.gioithieu}')`
        return new Promise((resolve, reject) => {
            conn.query(insertSql, err => {
                if (err) {
                    reject(err);
                }
                resolve('add success')
            })
        })
    }
    }