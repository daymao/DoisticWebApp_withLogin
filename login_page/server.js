if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const passport = require('passport')
//const bcrypt = require('bcrypt')
const createPassport = require('./passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


app.use(express.static(__dirname));

createPassport(
    passport, email => userAccounts.find(user => user.email === email),
    id => userAccounts.find(user => user.id === id)
    )

const userAccounts = [];
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.Session_Secret,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuth, (req, res) => {
    res.render('index.ejs', {name: req.user.name})
})

app.get('/loginPage', checkNotAuth, (req, res) => {
    res.render('loginPage.ejs')
})
app.post('/loginPage', checkNotAuth, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/loginPage',
    failureFlash: true
})
)

app.get('/registerPage', checkNotAuth, (req, res) => {
    res.render('registerPage.ejs')
})
app.post('/registerPage', checkNotAuth, async (req, res) => {
    try{
        //const passwordHash = await bcrypt.hash(req.body.password, 10)
        userAccounts.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        res.redirect('/loginPage')
    } catch {
        res.redirect('/registerPage')
    }
    console.log(userAccounts)
})
app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/loginPage')
})
function checkAuth(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/loginPage')
}
function checkNotAuth(req, res, next){
    if(req.isAuthenticated()){
       return res.redirect('/')
    }
    next()
}

app.listen(3000)