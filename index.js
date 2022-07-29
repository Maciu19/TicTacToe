const express = require('express');
const app = express();
const uuid = require('uuid');
const bodyParser = require('body-parser');
const port = 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let usersAndIDs = [];
let games = [];

//! Creeaza un user cu Nume, ID
app.post("/user", (req, res) => {
    const { user } = req.body;
    const ID = uuid.v4();

    const obj = { ID: ID, user: user };
    usersAndIDs.push(obj);

    // console.log(usersAndIDs);
    res.send(`${user} with ID:${ID}`);
})

//! Se cauta inlocuieste numele unui user dupa ID
app.patch("/user/:id", (req, res) => {
    const newUser = req.body.user;
    const ID = req.params.id;

    for (let o of usersAndIDs) {
        if (o.ID === ID) {
            o.user = newUser;
        }
    }

    //  console.log(usersAndIDs);
    res.send(`${newUser} with ID:${ID}`);
})


//! creeaza o masa
app.post("/games", (req, res) => {
    const ID = uuid.v4();
    const masa = {
        IDJoc: ID,
        status: "pending",
        plansa: [["", "", ""], ["", "", ""], ["", "", ""]],
        jucatori: []
    }
    games.push(masa);
    res.send(masa);
})

//! Cauta o masa dupa idJoc
app.get("/games/:id", (req, res) => {
    const IDJoc = req.params.id;
    for (let g of games) {
        console.log(g, IDJoc);
        if (g.IDJoc === IDJoc) {
            res.send(g);
        }
    }
    res.send(`Masa negasita pentru ${IDJoc} jocului`);
})

//! lista de jocuri cu status = pending|active|finished
app.get("/games", (req, res) => {
    const requestedStatus = req.query.status;
    let gameList = [];
    if (requestedStatus) {
        gameList = games.filter(g => g.status === requestedStatus);
    } else {
        gameList = games;
    }
    res.send(gameList);
})

//! Adaug un user la un joc, daca nu sunt 2 jucatori
app.post("/games/:idMasa/:idUser", (req, res) => {
    const IDMasa = req.params.idMasa;
    const IDUser = req.params.idUser;
    let masa;
    let user;

    console.log(games);
    console.log(usersAndIDs);

    for (g of games) {
        console.log(g);
        if (g.IDJoc === IDMasa) {
            masa = g;
        } else {
            res.send("Masa inexistenta");
        }
    }

    for (u of usersAndIDs) {
        console.log(u);
        if (u.ID === IDUser) {
            user = u;
        } else {
            res.send("User inexistent");
        }
    }

    if (g.jucatori.length >= 2) {
        res.send("Masa plina");
    }

    masa.status = "active";
    masa.jucatori.push(user);
    res.send(masa);
})


// //! Mutare la masa a unui player, la o anumita masa
app.post("/games/:idMasa/:idUser/:mutare/:simbol", (req, res) => {
    const IDMasa = req.params.idMasa;
    const IDUser = req.params.idUser;
    let masa;
    let user;

    for (g of games) {
        if (g.IDJoc === IDMasa) {
            masa = g;
        } else {
            res.send("Masa inexistenta");
        }
    }

    for (u of usersAndIDs) {
        if (u.ID === IDUser) {
            user = u;
        } else {
            res.send("User inexistent");
        }
    }

    const mutare = parseInt(req.params.mutare);
    const simbol = req.params.simbol;

    masa.plansa[mutare / 10][mutare % 10] = simbol;
    res.send(masa);
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})