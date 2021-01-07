import {ref, watchEffect} from 'vue'
import {projectFirestore} from '../firebase/config'


//collection is a string, which is the name of the firebase collection
const getCollection = (collection, query) => {
    const documents = ref(null)
    const error = ref(null)
    

    let collectionRef = projectFirestore.collection(collection)
        .orderBy('createdAt')

    if(query){
        collectionRef = collectionRef.where(...query)
    }

    const unsub = collectionRef.onSnapshot((snap) => {
        let results = []
        snap.docs.forEach((doc) => {
            // wait for the server to create the doc if it does not exist
            doc.data().createdAt && results.push({...doc.data(), id: doc.id})
        })

        documents.value = results
        error.value = null
    }, (err) => {
        console.log(err.message)
        documents.value = null
        error.value = 'could not fetch data'
    })

    watchEffect((onInvalidate) => {
        //unsub from snapshot whenever watcher is stopped (components unmounted -> logout)
        onInvalidate(() => unsub())
    })

    return {documents, error}
}

export default getCollection