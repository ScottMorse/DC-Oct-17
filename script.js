const database = firebase.database()

const dataStores = database.ref("masterList/stores")

const storeForm = document.getElementById('store-form')
const storeTextBox = document.getElementById('store-text-box')
const submitStoreButton = document.getElementById('submit-store')

const storeLists = document.getElementById('store-lists')

let stores = []

let s = 0
function configureObservers(){
    dataStores.on('value', snapshot => {
        stores = []
        if(s != 0){
            console.log('Value changed to stores.')
        }
        snapshot.forEach(childStore => {
            const storeObj = childStore.val()
            storeObj.key = childStore.key
            stores.push(storeObj)
        })
        updateStores()
        s++
    })
}
configureObservers()

function submitStore(e){
    e.preventDefault()
    const storeTextName = storeTextBox.value
    storeTextBox.value = ''
    dataStores.push().set({name: storeTextName})
}

function removeStore(){
    let storeId = this.parentElement.parentElement.id
    storeId = storeId.slice(1,storeId.length)
    dataStores.child(storeId).remove()
        .then(result => console.log('Remove store successful.'))
}

function updateStores(){
    storeLists.innerHTML = ''
    stores.forEach(store => {
        const newDiv = document.createElement('div')
        newDiv.id = 'a' + store.key
        newDiv.classList.add('store')
        newDiv.innerHTML = `
        <div class="store-header">
            <h3 class="store-title">${store.name}</h3>
            <form class="add-item-form">
                <input class="add-item-text-box" type="text" placeholder="Item name" required/>
                <input class="submit-item" type="submit" value="Add Item"/>
            </form>
            <button class="delete-store-button">Delete Store</button>
        </div>
        `
        const newForm = newDiv.children[0].children[1]
        newForm.addEventListener('submit',enterItem)

        const newItems = document.createElement('div')
        newItems.classList.add('items')
        if(store.hasOwnProperty('items')){
            Object.keys(store.items).forEach(itemKey => {
                const item = store.items[itemKey]
                const newItem = document.createElement('div')
                newItem.classList.add('item')
                newItem.id = 'a' + item.key
                const newRemoveItem = document.createElement('div')
                newRemoveItem.classList.add('remove-item-button')
                newRemoveItem.innerHTML = "X"
                newRemoveItem.addEventListener('click',removeItem)
                newItem.innerHTML = item.name
                newItem.appendChild(newRemoveItem)
                newItems.appendChild(newItem)
            })
        }

        const deleteButton = newForm.parentElement.children[2]
        deleteButton.addEventListener('click',removeStore)

        newDiv.appendChild(newItems)
        storeLists.appendChild(newDiv)
    })
}

storeForm.addEventListener('submit',submitStore)

function enterItem(e){
    e.preventDefault()
    this.focus()
    const text = this.children[0].value
    let storeId = this.parentElement.parentElement.id
    storeId = storeId.slice(1,storeId.length)
    const dataStoreRef = database.ref('masterList/stores/' + storeId + '/items')
    const newItemRef = dataStoreRef.push()
    newItemRef.set({name: text,key: newItemRef.key})
}

function removeItem(){
    let itemId = this.parentElement.id
    itemId = itemId.slice(1,itemId.length)
    let storeId = this.parentElement.parentElement.parentElement.id
    storeId = storeId.slice(1,storeId.length)
    const itemRef = dataStores.child(storeId).child('items').child(itemId)
    itemRef.remove()
        .then(result => console.log('Remove item successful.'))
}