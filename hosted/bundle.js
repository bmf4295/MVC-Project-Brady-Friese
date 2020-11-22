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
  var data = $("#addToDBForm").serialize();
  sendAjax('POST', $("#addToDBForm").attr("action"), data, function (xhr, status, error) {
    loadPetsFromServer();
  });
  return false;
};

var signUpForPremium = function signUpForPremium(e) {
  e.preventDefault();
  var data = $("#premiumSignupForm").serialize();
  sendAjax('POST', $("#premiumSignupForm").attr("action"), data, function (xhr, status, error) {
    AccountDetailsPage();
  });
  return false;
};

var setPetData = function setPetData(data) {
  var petData = JSON.parse(data);

  if (petData.photos) {
    document.querySelector('#petImage').src = petData.photos.large;
    document.querySelector('#petToSavePicture').value = petData.photos.small;
  }

  document.querySelector('#petGeneratorName').innerHTML = "Name: ".concat(petData.name);
  document.querySelector('#petToSaveName').value = "".concat(petData.name);
  document.querySelector('#petGeneratorType').innerHTML = "Type of Animal: ".concat(petData.animalType);
  document.querySelector('#petToSaveType').value = "".concat(petData.animalType);

  if (petData.secondary_Breed) {
    var breed = "".concat(petData.primary_Breed, " and ").concat(petData.secondary_Breed);
    document.querySelector('#petGeneratorBreed').innerHTML = "Breed: ".concat(breed);
    document.querySelector('#petToSaveBreed').value = breed;
  } else {
    document.querySelector('#petGeneratorBreed').innerHTML = "Breed: ".concat(petData.primary_Breed);
    document.querySelector('#petToSaveBreed').value = "".concat(petData.primary_Breed);
  }

  document.querySelector('#petGeneratorAge').innerHTML = "Age: ".concat(petData.age);
  document.querySelector('#petToSaveAge').value = "".concat(petData.age);
  document.querySelector('#likePetInput').disabled = false;
};

var PetGenerator = function PetGenerator(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "petGeneration"
  }, /*#__PURE__*/React.createElement("div", {
    className: "petInfo"
  }, /*#__PURE__*/React.createElement("img", {
    id: "petImage"
  }), /*#__PURE__*/React.createElement("p", {
    id: "petGeneratorName"
  }), /*#__PURE__*/React.createElement("p", {
    id: "petGeneratorType"
  }), /*#__PURE__*/React.createElement("p", {
    id: "petGeneratorBreed"
  }), /*#__PURE__*/React.createElement("p", {
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
  }))), /*#__PURE__*/React.createElement("form", {
    id: "addToDBForm",
    onSubmit: addPetToDB,
    name: "petGenerateForm",
    action: "/savePetToDB",
    method: "POST",
    className: "addToDBForm"
  }, /*#__PURE__*/React.createElement("input", {
    id: "petToSaveName",
    type: "hidden",
    name: "name",
    value: ""
  }), /*#__PURE__*/React.createElement("input", {
    id: "petToSaveType",
    type: "hidden",
    name: "type",
    value: ""
  }), /*#__PURE__*/React.createElement("input", {
    id: "petToSaveBreed",
    type: "hidden",
    name: "breed",
    value: ""
  }), /*#__PURE__*/React.createElement("input", {
    id: "petToSavePicture",
    type: "hidden",
    name: "picture",
    value: ""
  }), /*#__PURE__*/React.createElement("input", {
    id: "petToSaveAge",
    type: "hidden",
    name: "age",
    value: ""
  }), /*#__PURE__*/React.createElement("input", {
    id: "csurf",
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
      src: pet.picture,
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

var AccountDetails = function AccountDetails(props) {
  localStorage.setItem('isPremium', props.account.isPremium);

  if (props.account.isPremium === false) {
    return /*#__PURE__*/React.createElement("div", {
      className: "accountDetails"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "accountUsername"
    }, "Username: ", props.account.username, " "), /*#__PURE__*/React.createElement("h3", {
      className: "accountType"
    }, "Account Type: Free"), /*#__PURE__*/React.createElement("h3", {
      className: "accountBirthday"
    }, "Birthday: ", props.account.birthday), /*#__PURE__*/React.createElement("h3", {
      className: "petAge"
    }, "Age: ", props.account.age));
  } else {
    return /*#__PURE__*/React.createElement("div", {
      className: "accountDetails"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "accountUsername"
    }, "Username: ", props.account.username, " "), /*#__PURE__*/React.createElement("h3", {
      className: "accountType"
    }, "Account Type: Premium"), /*#__PURE__*/React.createElement("h3", {
      className: "accountBirthday"
    }, "Birthday: ", props.account.birthday), /*#__PURE__*/React.createElement("h3", {
      className: "petAge"
    }, "Age: ", props.account.age));
  }
};

var PremiumForm = function PremiumForm(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "premiumSignup"
  }, /*#__PURE__*/React.createElement("h2", null, "Sign Up for Premium"), /*#__PURE__*/React.createElement("h4", null, "Upgrade to premium for an ad-free experience! All for 5 dollars a month!"), /*#__PURE__*/React.createElement("form", {
    id: "premiumSignupForm",
    onSubmit: signUpForPremium,
    name: "premiumSignupForm",
    action: "/signupPremium",
    method: "POST",
    className: "premiumSignupForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "cardNumber"
  }, "Credit Card Number: "), /*#__PURE__*/React.createElement("input", {
    id: "cardNumber",
    type: "text",
    name: "cardNumber",
    placeholder: "0000000000000000"
  }), /*#__PURE__*/React.createElement("input", {
    id: "csurf",
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign Up for Premium"
  })));
};

var AlreadyPremium = function AlreadyPremium() {
  return /*#__PURE__*/React.createElement("div", {
    className: "premiumSignup"
  }, /*#__PURE__*/React.createElement("h2", null, "You are already a Premium Member"), /*#__PURE__*/React.createElement("h4", null, "Enjoy your ad-free experience!"));
};

var createPetGenerator = function createPetGenerator(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PetGenerator, {
    csrf: csrf
  }), document.querySelector("#petGenerator"));
};

var AccountDetailsPage = function AccountDetailsPage() {
  sendAjax('GET', '/getAccountDetails', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(AccountDetails, {
      account: data
    }), document.querySelector("#petGenerator"));
  });
};

var loadPetsFromServer = function loadPetsFromServer() {
  sendAjax('GET', '/getPets', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PetList, {
      pets: data.pets
    }), document.querySelector("#petGenerator"));
  });
};

var createPremiumSignup = function createPremiumSignup(csrf) {
  sendAjax('GET', '/getAccountDetails', null, function (data) {
    if (data.isPremium === false) {
      ReactDOM.render( /*#__PURE__*/React.createElement(PremiumForm, {
        csrf: csrf
      }), document.querySelector("#petGenerator"));
    } else {
      ReactDOM.render( /*#__PURE__*/React.createElement(AlreadyPremium, null), document.querySelector("#petGenerator"));
    }
  });
};

var setup = function setup(csrf) {
  var generateButton = document.querySelector("#generateButton");
  var petListButton = document.querySelector("#listButton");
  var accountButton = document.querySelector('#accountButton');
  var premiumButton = document.querySelector('#premiumButton');
  generateButton.addEventListener("click", function (e) {
    e.preventDefault();
    createPetGenerator(csrf);
    return false;
  });
  petListButton.addEventListener("click", function (e) {
    e.preventDefault();
    loadPetsFromServer();
    return false;
  });
  accountButton.addEventListener("click", function (e) {
    e.preventDefault();
    AccountDetailsPage();
    return false;
  });
  premiumButton.addEventListener("click", function (e) {
    e.preventDefault();
    createPremiumSignup(csrf);
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
