import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

function guessedListContains(array, value){
    for (let i = 0; i < array.length; i++) {
        if(array[i]["forms"][0]["name"] === value || array[i]["id"] == value)
            return true
    }
    return false
}

async function getPokemon(pokemon) {
    try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon/" + pokemon);
        return response.data;
    } catch (error) {
        console.error(error.message);
    }   
}

let pokeData = await getPokemon(Math.floor(Math.random() * 1026));

let guessedPokemons = []

app.get("/", async (req, res) => {
    if(req.query.reset === "true"){
        //reseting the game
        pokeData = await getPokemon(Math.floor(Math.random() * 1026));
        guessedPokemons = []
    }
    res.render("index.ejs", {data: pokeData, guessedPokemons: guessedPokemons});
});

app.post("/pokeGuess", async (req, res) => {
    const pokeGuess = req.body.pokeGuess.toLowerCase().replace(" ", "-");

    if(pokeGuess === pokeData["forms"][0]["name"] || pokeGuess == pokeData["id"]){
        res.render("index.ejs", {correctPoke: true, pokeData: pokeData})
    }else{
        let alreadyGuessed = guessedListContains(guessedPokemons, pokeGuess);
        if(!alreadyGuessed){
            const guessedPokeData = await getPokemon(pokeGuess);
            if(guessedPokeData)
                guessedPokemons.push(guessedPokeData);
        }
        console.log(alreadyGuessed);
        res.redirect("/");
    }
    console.log(req.body);
});

app.listen(port, () =>{
    console.log(`Server is running on port: ${port}`);
});