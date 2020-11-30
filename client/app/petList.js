

const generatePet = (e) => {
    e.preventDefault();
    sendAjax('GET', $("#petGenerateForm").attr("action"), {}, function (xhr, status, error) {
        setPetData(xhr);
    });
    return false;
};

const addPetToDB = (e) => {
    e.preventDefault();
    const data = $("#addToDBForm").serialize()
    sendAjax('POST', $("#addToDBForm").attr("action"), data,
        function (xhr, status, error) {
            loadPetsFromServer();
        });
    return false;
}

const signUpForPremium = (e) => {
    e.preventDefault();
    if ($("#cardNumber").val == '') {
        handleError("All fields are required");
        return false;
    }

    const data = $("#premiumSignupForm").serialize()
    sendAjax('POST', $("#premiumSignupForm").attr("action"), data,
        function (xhr, status, error) {
            AccountDetailsPage();
        });
    return false;
}

const checkIfAdFree = () => {
    sendAjax('GET', '/getAccountDetails', null, (data) => {
        if (data.isPremium === true) {
            document.querySelector('#adSpace').style.visibility = 'hidden'
        } else {
            document.querySelector('#adSpace').style.visibility = 'visible'
        }
    });
}

const setPetData = (data) => {
    const petData = JSON.parse(data);

    if (petData.photos) {
        document.querySelector('#generatorImage').src = petData.photos.large;
        document.querySelector('#petToSavePicture').value = petData.photos.small;
    } else {
        document.querySelector('#generatorImage').src = "/assets/img/placeholder_image.png";
        document.querySelector('#petToSavePicture').value = "/assets/img/placeholder_image_small.png";
    }
    document.querySelector('#petGeneratorName').innerHTML = `<b>Name:</b> ${petData.name}`;
    document.querySelector('#petToSaveName').value = `${petData.name}`;
    document.querySelector('#petGeneratorType').innerHTML = `<b>Type of Animal:</b> ${petData.animalType}`;
    document.querySelector('#petToSaveType').value = `${petData.animalType}`;
    if (petData.secondary_Breed) {
        let breed = `${petData.primary_Breed} and ${petData.secondary_Breed}`
        document.querySelector('#petGeneratorBreed').innerHTML = `<b>Breed:</b> ${breed}`;
        document.querySelector('#petToSaveBreed').value = breed;
    } else {
        document.querySelector('#petGeneratorBreed').innerHTML = `<b>Breed:</b> ${petData.primary_Breed}`;
        document.querySelector('#petToSaveBreed').value = `${petData.primary_Breed}`;
    }
    document.querySelector('#petGeneratorAge').innerHTML = `<b>Age:</b> ${petData.age}`;
    document.querySelector('#petToSaveAge').value = `${petData.age}`;
    document.querySelector('#savePet').disabled = false;
};


const PetGenerator = function (props) {

    return (
        <div>
            <h1 className="heading">Pet Generator</h1>
            <div className="petGeneration">
                <div className="petInfo">
                    <img id="generatorImage"></img>
                    <p className="generatorInfo" id="petGeneratorName"></p>
                    <p className="generatorInfo" id="petGeneratorType"></p>
                    <p className="generatorInfo" id="petGeneratorBreed"></p>
                    <p className="generatorInfo" id="petGeneratorAge"></p>
                </div>
                <form id="petGenerateForm"
                    onSubmit={generatePet}
                    name="petGenerateForm"
                    action="/callPetDB"
                    method="GET"
                    className="petGenerateForm"
                >
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <input id="genPet" className="inputSubmit" type="submit" value="Generate" />
                </form>

            </div>
            <form
                id="addToDBForm"
                onSubmit={addPetToDB}
                name="petGenerateForm"
                action="/savePetToDB"
                method="POST"
                className="addToDBForm"
            >
                <input id="petToSaveName" type="hidden" name="name" value="" />
                <input id="petToSaveType" type="hidden" name="type" value="" />
                <input id="petToSaveBreed" type="hidden" name="breed" value="" />
                <input id="petToSavePicture" type="hidden" name="picture" value="" />
                <input id="petToSaveAge" type="hidden" name="age" value="" />
                <input id="csurf" type="hidden" name="_csrf" value={props.csrf} />
                <input id="savePet" className="inputSubmit" type="submit" value="Like Pet" disabled />
            </form>

        </div>
    );
};

const PetList = function (props) {
    if (props.pets.length === 0) {
        return (
            <div className="petList">

                <h1 className="heading">No Pets yet</h1>
            </div>
        );
    };
    const petNodes = props.pets.map(function (pet) {
        return (
            <div key={pet._id} className="pet">
                <div className="listImage"><img src={pet.picture} alt="An image of the pet" className="petImage" /></div>
                <div className="listInfo">
                    <h3 className="petListInfo">Name: {pet.name}</h3>
                    <h3 className="petListInfo">Type: {pet.type}</h3>
                    <h3 className="petListInfo">Breed: {pet.breed}</h3>
                    <h3 className="petListInfo">Age: {pet.age}</h3>
                </div>
            </div>
        );
    });

    return (
        <div className="petList">
            <h1 className="heading">Your liked Pets</h1>
            {petNodes}
        </div>
    );
};

const AccountDetails = function (props) {
    document.querySelector('#errorMessage').innerHTML = "";
    if (props.account.isPremium === false) {
        return (
            <div>
                <h1 className="heading">Account Details</h1>
                <div className="accountDetails">
                    <p className="detail"><b>Username:</b> {props.account.username} </p>
                    <p className="detail"><b>Account Type:</b> Free</p>
                    <p className="detail"><b>Birthday:</b> {props.account.birthday}</p>
                    <p className="detail"><b>Age:</b> {props.account.age}</p>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <h1 className="heading">Account Details</h1>
                <div className="accountDetails">
                    <p className="detail"><b>Username:</b> {props.account.username} </p>
                    <p className="detail"><b>Account Type:</b> Premium</p>
                    <p className="detail"><b>Birthday:</b> {props.account.birthday}</p>
                    <p className="detail"><b>Age:</b> {props.account.age}</p>
                </div>
            </div>
        );
    }

};



const PremiumForm = function (props) {
    document.querySelector('#errorMessage').innerHTML = "";
    return (
        <div className="premiumSignup">
            <h1 className="heading">Sign Up for Premium</h1>
            <h3>Upgrade to premium for an ad-free experience! All for 5 dollars a month!</h3>
            <form
                id="premiumSignupForm"
                onSubmit={signUpForPremium}
                name="premiumSignupForm"
                action="/signupPremium"
                method="POST"
                className="premiumSignupForm"
            >
                <label htmlFor="cardNumber">Credit Card Number: </label>
                <input id="cardNumber" type="text" name="cardNumber" placeholder="0000000000000000" />
                <input id="csurf" type="hidden" name="_csrf" value={props.csrf} />
                <input className="inputSubmit" type="submit" value="Sign Up" />
            </form>
        </div>
    );
}

const AlreadyPremium = function () {
    document.querySelector('#errorMessage').innerHTML = "";
    return (
        <div className="alreadyPremium">
            <h1 className="heading">You are already a Premium Member</h1>
            <h2>Enjoy your ad-free experience!</h2>
        </div>
    );
}
const createPetGenerator = (csrf) => {
    document.querySelector('#errorMessage').innerHTML = "";
    checkIfAdFree();
    ReactDOM.render(
        <PetGenerator csrf={csrf} />,
        document.querySelector("#petGenerator")
    );
};


const AccountDetailsPage = () => {
    document.querySelector('#errorMessage').innerHTML = "";
    checkIfAdFree();
    sendAjax('GET', '/getAccountDetails', null, (data) => {
        ReactDOM.render(
            <AccountDetails account={data} />, document.querySelector("#petGenerator")
        );
    });
}
const loadPetsFromServer = () => {
    document.querySelector('#errorMessage').innerHTML = "";
    checkIfAdFree();
    sendAjax('GET', '/getPets', null, (data) => {
        ReactDOM.render(
            <PetList pets={data.pets} />, document.querySelector("#petGenerator")
        );
    });
};
const createPremiumSignup = (csrf) => {
    document.querySelector('#errorMessage').innerHTML = "";
    checkIfAdFree();
    sendAjax('GET', '/getAccountDetails', null, (data) => {
        if (data.isPremium === false) {
            ReactDOM.render(
                <PremiumForm csrf={csrf} />,
                document.querySelector("#petGenerator")
            );
        } else {
            ReactDOM.render(
                <AlreadyPremium />,
                document.querySelector("#petGenerator")
            );
        }
    });
};



const setup = function (csrf) {
    const generateButton = document.querySelector("#generateButton");
    const petListButton = document.querySelector("#listButton");
    const accountButton = document.querySelector('#accountButton');
    const premiumButton = document.querySelector('#premiumButton');

    generateButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPetGenerator(csrf);
        return false;
    });
    petListButton.addEventListener("click", (e) => {
        e.preventDefault();
        loadPetsFromServer();
        return false;
    });
    accountButton.addEventListener("click", (e) => {
        e.preventDefault();
        AccountDetailsPage();
        return false;
    });
    premiumButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPremiumSignup(csrf);
        return false;
    });
    createPetGenerator(csrf);

};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (results) => {
        setup(results.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});