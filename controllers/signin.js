const handleSignin = (req, res, db, bcrypt) => {
    const { email, password} = req.body;
    if (!email || !password) {
        return res.status(404).json('incorrect form submission');
    }
    // if (req.body.email===database.users[0].email &&
    // req.body.password === database.users[0].password) {
    //     res.json(database.users[0]);
    // } //because we do POST, we have access to the body
    // else {
    //     res.status(400).json('error logging in');
    // }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                .where('email', '=', email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.stauts(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }

        })
        .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
    handleSignin: handleSignin
}