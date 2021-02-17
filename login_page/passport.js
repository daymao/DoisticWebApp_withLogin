const localStrat = require('passport-local').Strategy

function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        if(user == null){
            return done(null, false, {message: 'No user exists with that email'})
        }
        try{
                if(await password === user.password){
                    return done(null, user)
                }else{
                    return done(null, false, {message: 'Incorrect password'})
                }
        }catch(e) {
            return done(e)
        }
    }
    passport.use(new localStrat({usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null,user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize