import {ref, watchEffect} from 'vue'
import {projectFirestore} from '../firebase/config'


//collection is a string, which is the name of the firebase collection
const getDocument = (collection, id) => {
    const document = ref(null)
    const error = ref(null)
    

    let documentRef = projectFirestore.collection(collection).doc(id)

    const unsub = documentRef.onSnapshot((doc) => {
        if(doc.data()){
            document.value = {...doc.data(), id: doc.id}
            console.log(document.value)
            error.value = null
        }
        else{
            error.value = 'That document does not exist'
        }
 
    }, (err) => {
        console.log(err.message)
        error.value = 'could not fetch documents'
    })

    watchEffect((onInvalidate) => {
        //unsub from snapshot whenever watcher is stopped (components unmounted -> logout)
        onInvalidate(() => unsub())
    })

    return {document, error}
}

export default getDocument