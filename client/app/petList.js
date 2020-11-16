

const generatePet = (e) => {
    e.preventDefault();

    sendAjax('GET', $("#petGenerateForm").attr("action"), {}, function (xhr, status, error) {
        setPetData(xhr);
    });
    return false;
};

const addPetToDB = (e)=>{
    e.preventDefault();
   const data = $("#addToDBForm").serialize()
    sendAjax('POST', $("#addToDBForm").attr("action"), data ,
     function (xhr, status, error) {
        loadPetsFromServer();
    });
    return false;
}

const setPetData = (data) => {
    const petData = JSON.parse(data);

    if (petData.photos) {
        document.querySelector('#petImage').src = petData.photos.large;
        document.querySelector('#petToSavePicture').value = petData.photos.small;
    }
    document.querySelector('#petGeneratorName').innerHTML = `Name: ${petData.name}`;
    document.querySelector('#petToSaveName').value = `${petData.name}`;
    document.querySelector('#petGeneratorType').innerHTML = `Type of Animal:${petData.animalType}`;
    document.querySelector('#petToSaveType').value = `${petData.animalType}`;
    if (petData.secondary_Breed) {
        let breed = `${petData.primary_Breed} and ${petData.secondary_Breed}`
        document.querySelector('#petGeneratorBreed').innerHTML = `Breed: ${breed}`;
        document.querySelector('#petToSaveBreed').value = breed;
    } else {
        document.querySelector('#petGeneratorBreed').innerHTML = `Breed: ${petData.primary_Breed}`;
        document.querySelector('#petToSaveBreed').value = `${petData.primary_Breed}`;
    }
    document.querySelector('#petGeneratorAge').innerHTML = `Age: ${petData.age}`;
    document.querySelector('#petToSaveAge').value = `${petData.age}`;
    document.querySelector('#likePetInput').disabled = false;
};


const PetGenerator = function (props) {
    return (
        <div>
        <div className="petGeneration">
            <div className="petInfo">
                <img id="petImage"></img>
                <p data-name="" id="petGeneratorName"></p>
                <p data-type="" id="petGeneratorType"></p>
                <p data-breed="" id="petGeneratorBreed"></p>
                <p data-age="" id="petGeneratorAge"></p>
            </div>
            <form id="petGenerateForm"
                onSubmit={generatePet}
                name="petGenerateForm"
                action="/callPetDB"
                method="GET"
                className="petGenerateForm"
            >
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="generatePet" type="submit" value="Generate Pet" />
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
                    <input id="likePetInput"  className="savePet" type="submit" value="Like Pet" disabled />
            </form>
        </div>
    );
};

const PetList = function (props) {
    if (props.pets.length === 0) {
        return (
            <div className="petList">

                <h3 className="emptyPets">No Pets yet</h3>
            </div>
        );
    };
    const petNodes = props.pets.map(function (pet) {
        return (
            <div key={pet._id} className="pet">
                <img src={pet.picture} alt="An image of the pet" className="petImage" />
                <h3 className="petName">Name: {pet.name} </h3>
                <h3 className="petType">Type: {pet.type}</h3>
                <h3 className="petBreed">Breed: {pet.breed}</h3>
                <h3 className="petAge">Age: {pet.age}</h3>
            </div>
        );
    });

    return (
        <div className="petList">
            {petNodes}
        </div>
    );
};

const AccountDetails = function (props){
    console.log(props);
    return (
        <div className="accountDetails">
            <h3 className="accountUsername">Username: {props.account.username} </h3>
            <h3 className="accountType">Type: Free</h3>
            <h3 className="accountBirthday">Birthday: (Will be added later)</h3>
            <h3 className="petAge">Age: (Will be added later)</h3>
        </div>
    );
};

const createPetGenerator = (csrf) => {
    ReactDOM.render(
        <PetGenerator csrf={csrf} />,
        document.querySelector("#petGenerator")
    );
};


const AccountDetailsPage = ()=>{
    sendAjax('GET','/getAccountDetails',null, (data)=>{
    ReactDOM.render(
        <AccountDetails account={data}/>, document.querySelector("#petGenerator")
    );
    });
}
const loadPetsFromServer= ()=>{
    sendAjax('GET','/getPets',null, (data)=>{
        ReactDOM.render(
            <PetList pets={data.pets}/>, document.querySelector("#petGenerator")
        );
    });
};




const setup = function (csrf) {
    const generateButton = document.querySelector("#generateButton");
    const petListButton = document.querySelector("#listButton");
    const accountButton = document.querySelector('#accountButton');

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
    accountButton.addEventListener("click",(e)=>{
        e.preventDefault();
        AccountDetailsPage();
        return false;
    })

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