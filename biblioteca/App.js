const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database: 'biblioteca'  
})

db.connect((error)=> {
    if(error){
        console.log('Erro ao conectar com o MySQL');
    }else {
        console.log('Conectado com sucesso');
    }
});

app.use(bodyParser.urlencoded({ extended:true}))

app.get(["/", "/login"], (req, res) => { /* "["/", "/login"],"" faz com q ele vá para "login.html" com o "/" ou o "/login" */
    res.sendFile(__dirname + '/login.html')
})

app.post("/login", (req, res) =>{
    const username = req.body.nome;
    const password = req.body.password;
    
    db.query('SELECT password FROM usuario WHERE nome = ?;', [username], (error, results) => {
            if (results.length > 0) {
                const passwordBD = results[0].password;
                if (password === passwordBD){
                  console.log('login bem sucedido')
                  res.send('Login bem sucedido')
                } else {
                  console.log('Senha incorreta')
                  res.send('Senha incorreta')
                }
               
            }else{
              console.log('Usuário não cadastrado')
              res.send('Usuario não cadastrado')
            } 
    });

});

app.get("/cadastro", (req, res) => {
    res.sendFile(__dirname + '/cadastro.html')
});

app.post("/cadastro", (req, res) => {

    const username = req.body.nome;
    const password = req.body.password;
    const email = req.body.email;
    const confirm = req.body.passwordConfirm

      if (password === confirm){
    db.query('INSERT INTO usuario (nome, email, password) VALUES (?, ?, ?);', [username, email, password], (error, results) => {
        if(error) {
            console.log("Erro ao realizar o cadastro", error)
            res.status(500).send('Preencheu errado');
        return;
        }else {
            console.log("Usuário cadastrado com sucesso!")
            res.send('Usuario cadastrado com sucesso')
        } 
         })    
         }

  /* db.query('INSERT INTO user (username, password) VALUES (?, ?);', [username, password], (error, results) => {
       if (password > 8){
        console.log('Senha não pode ser maior que 8 dígitos', error);
        res.status(500).send('Max:8 caracteres');
        return;
       }
       
        if (error){
        console.log('Erro ao cadastrar', error);
        res.status(500).send('Erro no servidor');
        return;
       } else { 
       console.log('Usuario cadastrado com sucesso');
       res.send('Usuario cadastrado com sucesso')
       }

    }); */
}); 

app.listen(port, ()=>{
    console.log(`Servidor rodando no endereço: https://localhost:${port}`)
});