const userArea = document.getElementById('user-area')
const registerButton = document.getElementById('register')
const loginButton = document.getElementById('login')
const regForm = document.getElementById('reg-form')
const loginForm = document.getElementById('login-form')
const regError = document.getElementById('reg-error')
const loginError = document.getElementById('login-error')
const storeForm = document.getElementById('store-form')
const storeLists = document.getElementById('store-lists')
const regEmailTextBox = document.getElementById('regEmailTextBox')
const loginEmailTextBox = document.getElementById('loginEmailTextBox')
const regPasswordTextBox = document.getElementById('regPasswordTextBox')
const loginPasswordTextBox = document.getElementById('loginPasswordTextBox')

let regErr = false
function registerNewUser(e){
    e.preventDefault()
    const newEmail = regEmailTextBox.value
    const newPassword = regPasswordTextBox.value
    firebase.auth().createUserWithEmailAndPassword(newEmail, newPassword).catch(function(error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        regError.innerHTML = errorMessage
        console.error('Firebase: ' + errorCode)
        regErr = true
    })
    .then(response => {
        if(!regErr){
            firebase.auth().signInWithEmailAndPassword(newEmail, newPassword).catch(function(error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                regError.innerHTML = errorMessage
                console.error('Firebase: ' + errorCode)
                regErr = true
            })
            .then(response => {
                if(!regErr){
                    currentUserId = firebase.auth().currentUser.uid
                    dataStores = database.ref("users/" + currentUserId + '/stores')
                    userArea.innerHTML = 'Welcome, ' + newEmail + '!'
                    storeForm.style.display = 'flex'
                    storeLists.style.display = 'flex'
                    toggleLoginForm(false)
                    setTimeout(()=>{
                        storeForm.style.opacity = 1
                        storeLists.style.opacity = 1
                    },100)
                    toggleRegistrationForm(false)
                    configureObservers()
                    return
                }
                regErr = false
            })
            return
        }
        regErr = false
    })
}

let currentUserId
let dataStores
let loginErr = false
function loginUser(e){
    e.preventDefault()
    const userEmail = loginEmailTextBox.value
    const userPassword = loginPasswordTextBox.value
    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        loginError.innerHTML = errorMessage
        console.error('Firebase: ' + errorCode)
        loginErr = true
    })
    .then(response => {
        if(!loginErr){
            currentUserId = firebase.auth().currentUser.uid
            dataStores = database.ref("users/" + currentUserId + '/stores')
            userArea.innerHTML = 'Welcome, ' + userEmail + '!'
            storeForm.style.display = 'flex'
            storeLists.style.display = 'flex'
            toggleLoginForm(false)
            setTimeout(()=>{
                storeForm.style.opacity = 1
                storeLists.style.opacity = 1
            },100)
            configureObservers()
            return
        }
        loginErr = false
    })
}

let clickedForm = false
function toggleRegistrationForm(show){
    if(show){
        regForm.style.display = "flex"
        setTimeout(()=>regForm.style.opacity = 1,100)
    }
    else{
        regForm.style.opacity = 0
        clickedForm = false
        setTimeout(()=>regForm.style.display = "none",800)
    }
}

function toggleLoginForm(show){
    if(show){
        loginForm.style.display = "flex"
        setTimeout(()=>loginForm.style.opacity = 1,100)
    }
    else{
        loginForm.style.opacity = 0
        clickedForm = false
        setTimeout(()=>loginForm.style.display = "none",800)
    }
}

function clickOutsideForm(e){
    if(clickedForm){
        if(e.target.id.slice(0,7) == "outside"){
            toggleLoginForm(false)
            toggleRegistrationForm(false)
        }
    }
}

registerButton.addEventListener('click',()=>{clickedForm = true; toggleRegistrationForm(true)})
loginButton.addEventListener('click',()=>{clickedForm = true; toggleLoginForm(true)})
window.addEventListener('click',clickOutsideForm)
regForm.addEventListener('submit',registerNewUser)
loginForm.addEventListener('submit',loginUser)