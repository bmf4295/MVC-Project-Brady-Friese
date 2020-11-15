"use strict";

var handleDomo = function handleDomo(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
  });
  return false;
};

var DomoForm = function DomoForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "domoForm",
    onSubmit: handleDomo,
    name: "domoForm",
    action: "/maker",
    method: "POST",
    className: "domoForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "domoName",
    type: "text",
    name: "name",
    placeholder: "Domo Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "age"
  }, "Age: "), /*#__PURE__*/React.createElement("input", {
    id: "domoAge",
    type: "text",
    name: "age",
    placeholder: "Domo Age"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "age"
  }, "Level: "), /*#__PURE__*/React.createElement("input", {
    id: "domoLevel",
    type: "text",
    name: "level",
    placeholder: "Domo Level"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeDomoSubmit",
    type: "submit",
    value: "Make Domo"
  }));
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyDomo"
    }, "No Domos yet"));
  }

  ;
  var domoNodes = props.domos.map(function (domo) {
    return /*#__PURE__*/React.createElement("div", {
      key: domo._id,
      className: "domo"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "domoName"
    }, "Name: ", domo.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "domoLevel"
    }, "Level: ", domo.level), /*#__PURE__*/React.createElement("h3", {
      className: "domoAge"
    }, "Age: ", domo.age));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "domoList"
  }, domoNodes);
};

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      domos: data.domos
    }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoForm, {
    csrf: csrf
  }), document.querySelector("#makeDomo"));
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
    domos: []
  }), document.querySelector("#domos"));
  loadDomosFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (results) {
    setup(results.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var generatePet = function generatePet(e) {
  e.preventDefault();
  sendAjax('GET', $("#petGenerateForm").attr("action"), {}, function (xhr, status, error) {
    setPetData(xhr);
  });
  return false;
};

var addPetToDB = function addPetToDB(e) {
  e.preventDefault();
  var data = {
    name: document.querySelector('#petGeneratorName').dataset.name,
    type: document.querySelector('#petGeneratorType').dataset.type,
    breed: document.querySelector('#petGeneratorBreed').dataset.breed,
    picture: document.querySelector('#petImage').src,
    age: document.querySelector('#petGeneratorAge').dataset.age
  };
  sendAjax('POST', $("#addToDBForm").attr("action"), data, function (xhr, status, error) {
    loadPetsFromServer();
  });
  return false;
};

var setPetData = function setPetData(data) {
  var petData = JSON.parse(data);

  if (petData.photos) {
    document.querySelector('#petImage').src = petData.photos.large;
    document.querySelector('#petImage').dataset.smallimage = petData.photos.small;
  }

  document.querySelector('#petGeneratorName').innerHTML = "Name: ".concat(petData.name);
  document.querySelector('#petGeneratorName').dataset.name = "".concat(petData.name);
  document.querySelector('#petGeneratorType').innerHTML = "Type of Animal:".concat(petData.animalType);
  document.querySelector('#petGeneratorType').dataset.type = "".concat(petData.animalType);

  if (petData.secondary_Breed) {
    var breed = "".concat(petData.primary_Breed, " and ").concat(petData.secondary_Breed);
    document.querySelector('#petGeneratorBreed').innerHTML = "Breed: ".concat(breed);
    document.querySelector('#petGeneratorBreed').dataset.breed = breed;
  } else {
    document.querySelector('#petGeneratorBreed').innerHTML = "Breed: ".concat(petData.primary_Breed);
    document.querySelector('#petGeneratorBreed').dataset.breed = "".concat(petData.primary_Breed);
  }

  document.querySelector('#petGeneratorAge').innerHTML = "Age: ".concat(petData.age);
  document.querySelector('#petGeneratorAge').dataset.age = "".concat(petData.age);
  document.querySelector('#likePetInput').disabled = false;
};

var PetGenerator = function PetGenerator(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "petGeneration"
  }, /*#__PURE__*/React.createElement("div", {
    className: "petInfo"
  }, /*#__PURE__*/React.createElement("img", {
    id: "petImage"
  }), /*#__PURE__*/React.createElement("p", {
    "data-name": "",
    id: "petGeneratorName"
  }), /*#__PURE__*/React.createElement("p", {
    "data-type": "",
    id: "petGeneratorType"
  }), /*#__PURE__*/React.createElement("p", {
    "data-breed": "",
    id: "petGeneratorBreed"
  }), /*#__PURE__*/React.createElement("p", {
    "data-age": "",
    id: "petGeneratorAge"
  })), /*#__PURE__*/React.createElement("form", {
    id: "petGenerateForm",
    onSubmit: generatePet,
    name: "petGenerateForm",
    action: "/callPetDB",
    method: "GET",
    className: "petGenerateForm"
  }, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "generatePet",
    type: "submit",
    value: "Generate Pet"
  })), /*#__PURE__*/React.createElement("form", {
    id: "addToDBForm",
    onSubmit: addPetToDB,
    name: "petGenerateForm",
    action: "/savePetToDB",
    method: "POST",
    className: "addToDBForm"
  }, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    id: "likePetInput",
    className: "savePet",
    type: "submit",
    value: "Like Pet",
    disabled: true
  })));
};

var PetList = function PetList(props) {
  if (props.pets.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "petList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyPets"
    }, "No Pets yet"));
  }

  ;
  var petNodes = props.pets.map(function (pet) {
    return /*#__PURE__*/React.createElement("div", {
      key: pet._id,
      className: "pet"
    }, /*#__PURE__*/React.createElement("img", {
      src: pet.image,
      alt: "An image of the pet",
      className: "petImage"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "petName"
    }, "Name: ", pet.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "petType"
    }, "Type: ", pet.type), /*#__PURE__*/React.createElement("h3", {
      className: "petBreed"
    }, "Breed: ", pet.breed), /*#__PURE__*/React.createElement("h3", {
      className: "petAge"
    }, "Age: ", pet.age));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "petList"
  }, petNodes);
};

var createPetGenerator = function createPetGenerator(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PetGenerator, {
    csrf: csrf
  }), document.querySelector("#petGenerator"));
};

var loadPetsFromServer = function loadPetsFromServer() {
  sendAjax('GET', '/getPets', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      pets: data.pets
    }), document.querySelector("#petGenerator"));
  });
};

var setup = function setup(csrf) {
  var generateButton = document.querySelector("#generateButton");
  var petListButton = document.querySelector("#listButton");
  generateButton.addEventListener("click", function (e) {
    e.preventDefault();
    createPetGenerator(csrf);
    return false;
  });
  petListButton.addEventListener("click", function (e) {
    e.preventDefault();
    createPetList(csrf);
    return false;
  });
  createPetGenerator(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (results) {
    setup(results.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#domoMessage').animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $('#domoMessage').animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
