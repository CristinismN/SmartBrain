const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: 'f76256bd0ddc44d6a462031bf4c398d4'
});

const handleApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with the API'))
//app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input) // moved from front end to back end due to security issues (api key was visible
    //in the network headers). So now we must create a new endpoint for the input, this

}

const handleImage = (req, res, db) => { //updates the entries and increases the count
     const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall
}