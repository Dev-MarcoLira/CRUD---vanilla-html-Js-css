'use strict'

const fields = document.querySelectorAll("[required]")

console.log(fields)


function validateField(field){

    function verifyErrors(){
        let foundError = false

        for(const error in field.validity){
            if (field.validity[error] && !field.validity.valid){
               foundError = error
            }
        }

        return foundError
    }

    function customMessage(typeError){
        const messages = {
            text:{
                valueMissing: "Por favor, preencha este campo"
            },
            email:{
                valueMissing: "E-mail é obrigatório",
                typeMismatch: "Por favor, preencha um e-mail válido"
            }
        }

        return messages[field.type][typeError]
    }

    function setCustomMessage(message){
        const spanError = field.parentNode.querySelectorAll("span.error")

        if(message){
            spanError.classList.add("active")
            spanError.innerHTML = message
            console.log("Achei 1 erro")
        }else{
            spanError.classList.remove("active")
            spanError.innerHTML = ""
        }
    }


    return function(){

        const error = verifyErrors()
        

        if(error){
            const message = customMessage(error)

            field.style.borderColor = "red"
            setCustomMessage(message)
        }else{
            field.style.borderColor = "green"
           setCustomMessage()
        }
    }

}


async function customValidation(event){
    const field = event.target
    const validation = validateField(field)

    validation()
   
}



for(const field of fields){
    field.addEventListener("invalid", event => {
        customValidation(event)
        event.preventDefault()
    })
    field.addEventListener("blur", customValidation)
}



document.querySelector('form')
.addEventListener('submit', (event) =>{
    console.log("Envie o formulário")
    event.preventDefault()
})















/* const tempClient = {
    nome: "Pedro",
    email: "pedro@gmail.com",
    celular: "11123456789",
    cidade: "São Paulo"
} */

const getLocalStorage = () => JSON.parse(localStorage.getItem("db_client")) ?? []

const setLocalStorage = (db_client) => localStorage.setItem("db_client", JSON.stringify(db_client))



const deleteClient = (index) =>{
    const db_client = readClient()
    db_client.splice(index, 1)
    setLocalStorage(db_client)
    console.log(db_client)
}


const updateClient = (index, client) =>{
    const db_client = readClient()
    db_client[index] = client
    setLocalStorage(db_client)
    console.log(db_client)
}


const readClient = () => getLocalStorage()


const createClient = (client) =>{  
    const db_client = getLocalStorage()
    console.log(db_client)
    db_client.push(client)
    setLocalStorage(db_client)
}






const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

const clearFields = () =>{
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}


const saveClient = () =>{
    if(isValidFields()){
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }

        const index = document.getElementById('nome').dataset.index

        if(index == 'new'){
            createClient(client)
            clearFields()
            updateTable()
            closeModal()
            //console.log(client)
        }else{
            updateClient(index, client)
            updateTable()
            closeModal()
        }

        
    }
}

const createRow = (client, index) =>{
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
            <td>${client.nome}</td>
            <td>${client.email}</td>
            <td>${client.celular}</td>
            <td>${client.cidade}</td>
            <td>
                <button type="button" class="button green" id="edit-${index}">editar</button>
                <button type="button" class="button red" id="delete-${index}">excluir</button>
            </td>
    `

    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () =>{
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () =>{
    const db_client = readClient()
    clearTable()
    db_client.forEach(createRow)
}

updateTable()


const openModal = () => {
    document.getElementById('modal').classList.add('active')
}
const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const fillFields = (client) =>{
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) =>{
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) =>{
    if(event.target.type == 'button'){
        const [action, index] = event.target.id.split('-')
        
        if(action == 'edit'){
            editClient(index)
        }else{
            const client = readClient()[index]
            const response = confirm(`Deseja excluir o cliente ${client.nome}?`)
            
            if(response){
                deleteClient(index)
                updateTable()
            }else{
                return
            }

        }


        //console.log(action, index)
    }
}



document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.getElementById('cancelar')
    .addEventListener('click', clearFields)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)