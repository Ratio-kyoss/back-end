const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host:'localhost',
    user:'guri',
    password:'socapa',
    database: 'login'  
})

db.connect((error)=> {
    if(error){
        console.log('Erro ao conectar com o MySQL');
    }else {
        console.log('Conectado com sucesso');
    }
});

app.use(bodyParser.urlencoded({ extended:true}))

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/login.html')
})

app.post("/login", (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    
    db.query('SELECT password FROM user WHERE username = ?', [username], (error, results) => {
            if (results.length > 0) {
                const passwordBD = results[0].password;
                if (password === passwordBD){
                  console.log('login bem sucedido')
                } else {
                  console.log('Senha incorreta')
                }
               
            }else{
              console.log('Usuário não cadastrado')
            } 
    });

});

app.listen(port, ()=>{
    console.log(`Servidor rodando no endereço: https://localhost:${port}`)
});