const express = require('express');
const { cookie_base, cookie_add } = require('../data/cookie_data');
const { getAddFromReq } = require('../utils/get_add_from_req');
const { handlebarsHelpers } = require('../utils/handlebars-helpers');
const homeRouter = express.Router();


homeRouter
    .get('/', (req,res)=>{
    const {cookieBase} = req.cookies;
    //jak juz cookieBase jest to mozna uzyć zamiast na sztywno przekazywanych (cookie.base : "light")
    const addons = getAddFromReq(req)
    //wyrzucone na zewnatrz bo uzyte wiecej niz 1 raz
    
    const sum = (cookieBase ? handlebarsHelpers.priceFinder(Object.entries(cookie_base), cookieBase) : 0) 
    + addons.reduce((prev, curr)=> (prev+
    //jak w config zrobione cookies pliki to mozna ich tutaj zaczac uzywac zamiast 'sztywnych'
    handlebarsHelpers.priceFinder(Object.entries(cookie_add), curr)) ,0) 
    //ale to jest zjebane i bym wolał w petli
    res.render('home_file/home' ,{
        cookie: {
            base: cookieBase,
            addon : addons,
            },
        bases : Object.entries(cookie_base),
        adds : Object.entries(cookie_add),
        sum
    })
})
//wrenderowujemy home.hbs(strone głowną jakby) do main.hbs
// partiala 'previus-cookie' stworzonego z obrazka na backgroundzie pliku css wrzucamy do home.hbs
//w tym home.hbs dodajemy linki dalej do bazy i dodatków do ciastek bazując tablicy stworzonej z cookie_data.js
//helpersy w pliku głownym trzeba 'przekazac' tj nazwe pliku helpersów (po extname)
//helpersy robi w osobnym pliku .js jako funkcje - ktora pozniej wywołuje w hbs'ie
//uzywam funkcje w hbs'ie w {{funkcja dane}} przesyłajac dane (dane wysłane zostały renderem do hbs'a -> home)
//uzycie tej funkcji "wyrzucamy" do partials'a a pozniej tego partialsa uzywamy w hbsie po prostu
// trzeba przypilnowac czy dobre przekazane dane z rendera itp itd
    // next step
// nazwy nie moga sie powtarzac a jesli tak to (np) @root.adds , zamiast adds ale i tak w #each jest wskazanie, wiec trzeba sie 'cofnac'
// sumujemy ceny (zaraz przed/nad wysłaniem do rendera) bazujac na funkcji stworzonej w handlebars'ie i wrzucamy
// przesłany przez rendera do partiala adds.hbs, ktory idzie do home.hbs, a ten do main.hbs xD
// ceny mozna zaokraglic wywłujac metode {{princify (priceFinder @root.adds this))}}

//tworzymy konfigurator configurator.js

//majac ciastko stworzone w konfiguratorze, mozemy je zapisac, a w pliku startowym odczytac na poczatku i podac
module.exports = {homeRouter}


// na koniec refaktoryzacja ; sum;cookie, base,adds,addons itp do funkcji zewnetrznych i tylko z niej korzystac; destrukturyzowac i nazwy ujednolicic podmieniajac