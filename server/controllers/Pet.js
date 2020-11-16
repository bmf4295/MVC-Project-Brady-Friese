const petfinder = require('@petfinder/petfinder-js');
const models = require('../models');

const { Pet } = models;

const client = new petfinder.Client({ apiKey: 'CIzqmxvvMSsZqybvXFcRFkR7KcefAWLG9rDY8YoNsyXsqYvKbe', secret: 'rI6AiKk0zgIxkIrl6aAxwSvQhIXqpqLL1OozPDPP' });

const listPage = (req, res) => {
  Pet.PetModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), pets: docs });
  });
};
const savePet = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }
  const petData = {
    name: req.body.name,
    type: req.body.type,
    breed: req.body.breed,
    picture: req.body.picture,
    age: req.body.age,
    owner: req.session.account._id,
  };
  const newPet = new Pet.PetModel(petData);

  const petPromise = newPet.save();

  petPromise.then(() => res.json({}));

  petPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Pet already exists' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });
  return petPromise;
};

const getPets = (request, response) => {
  const req = request;
  const res = response;
  return Pet.PetModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.json({ pets: docs });
  });
};


const handlePetData = (req, res, petData) => {
  let dataToReturn;
  if (petData.photos[0]) {
    dataToReturn = {
      name: petData.name,
      animalType: petData.type,
      primary_Breed: petData.breeds.primary,
      secondary_Breed: petData.breeds.secondary,
      photos: petData.photos[0],
      age: petData.age,
    };
  } else {
    dataToReturn = {
      name: petData.name,
      animalType: petData.type,
      primary_Breed: petData.breeds.primary,
      secondary_Breed: petData.breeds.secondary,
      age: petData.age,
    };
  }

  dataToReturn = JSON.stringify(dataToReturn);
  return res.json(dataToReturn);
};

const callPetDB = (request, response) => {
  const req = request;
  const res = response;

  client.animal.search({
    limit: 100,
  })
    .then((response2) => {
      const rand = Math.round(Math.random() * (100 - 1) + 1);
      handlePetData(req, res, response2.data.animals[rand]);
    }).catch((error) => res.status(400).json({ error: error.message }));
};

module.exports.listPage = listPage;
module.exports.getPets = getPets;
module.exports.savePet = savePet;
module.exports.callPetDB = callPetDB;
