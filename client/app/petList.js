const generatePet = (e) => {
    e.preventDefault();

    sendAjax('GET', $("#petGenerateForm").attr("action"), {}, function (xhr, status, error) {
        setPetData(xhr);
    });
    return false;
};

const addPetToDB = (e)=>{
    e.preventDefault();
    const data = {
        name: document.querySelector('#petGeneratorName').dataset.name,
        type: document.querySelector('#petGeneratorType').dataset.type,
        breed: document.querySelector('#petGeneratorBreed').dataset.breed,
        picture: document.querySelector('#petImage').src,
        age:document.querySelector('#petGeneratorAge').dataset.age
    };
    sendAjax('POST', $("#addToDBForm").attr("action"), data,
     function (xhr, status, error) {
        loadPetsFromServer();
    });
    return false;
}

const setPetData = (data) => {
    const petData = JSON.parse(data);

    if (petData.photos) {
        document.querySelector('#petImage').src = petData.photos.large;
        document.querySelector('#petImage').dataset.smallimage = petData.photos.small;
    }
    document.querySelector('#petGeneratorName').innerHTML = `Name: ${petData.name}`;
    document.querySelector('#petGeneratorName').dataset.name = `${petData.name}`;
    document.querySelector('#petGeneratorType').innerHTML = `Type of Animal:${petData.animalType}`;
    document.querySelector('#petGeneratorType').dataset.type = `${petData.animalType}`;
    if (petData.secondary_Breed) {
        let breed = `${petData.primary_Breed} and ${petData.secondary_Breed}`
        document.querySelector('#petGeneratorBreed').innerHTML = `Breed: ${breed}`;
        document.querySelector('#petGeneratorBreed').dataset.breed = breed;
    } else {
        document.querySelector('#petGeneratorBreed').innerHTML = `Breed: ${petData.primary_Breed}`;
        document.querySelector('#petGeneratorBreed').dataset.breed = `${petData.primary_Breed}`;
    }
    document.querySelector('#petGeneratorAge').innerHTML = `Age: ${petData.age}`;
    document.querySelector('#petGeneratorAge').dataset.age = `${petData.age}`;
    document.querySelector('#likePetInput').disabled = false;
};


const PetGenerator = function (props) {
    return (
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
            <form
                    id="addToDBForm"
                    onSubmit={addPetToDB}
                    name="petGenerateForm"
                    action="/savePetToDB"
                    method="POST"
                    className="addToDBForm"
                >
                    <input type="hidden" name="_csrf" value={props.csrf} />
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
                <img src={pet.image} alt="An image of the pet" className="petImage" />
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

const createPetGenerator = (csrf) => {
    ReactDOM.render(
        <PetGenerator csrf={csrf} />,
        document.querySelector("#petGenerator")
    );
};
const loadPetsFromServer= ()=>{
    sendAjax('GET','/getPets',null, (data)=>{
        ReactDOM.render(
            <DomoList pets={data.pets}/>, document.querySelector("#petGenerator")
        );
    });
};
const setup = function (csrf) {
    const generateButton = document.querySelector("#generateButton");
    const petListButton = document.querySelector("#listButton");

    generateButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPetGenerator(csrf);
        return false;
    });
    petListButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPetList(csrf);
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