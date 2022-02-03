const handleRegister = (req, res, db, bcrypt) => { //we're passing db, bcrypt to the function
    const { email, name, password } = req.body;
    if (!email || !password || !name) {
        return res.status(404).json('incorrect form submission')
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
           return trx('users')
            .returning('*') //insert new row in 'users' table and return all the columns
            .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            .then(user => {
        res.json(user[0]);

        })
    })
//     bcrypt.hash(password, null, null, function(err, hash) {
//     // Store hash in your password DB.
//     console.log(hash);
// });
    .then(trx.commit) // if all of the above pass, then commit ( send the transaction through)
    .catch(trx.rollback)
    })
      .catch(err => res.status(400).json('unable to register'))
    // database.users.push({ 
    //     id: '125',
    //     name: name,
    //     email:email,
    //     password:password,
    //     entries: 0,
    //     joined: new Date()
    // })
    
}

module.exports = {
    handleRegister: handleRegister
};