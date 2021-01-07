import {ref} from 'vue'
import {projectFirestore} from '../firebase/config'


//collection is a string, which is the name of the firebase collection
const useDocument = (collection, id) => {

    const error = ref(null)
    const isPending = ref(false)
    

    let docRef = projectFirestore.collection(collection).doc(id)

    const deleteDoc = async () => {
        isPending.value = true
        error.value = null  

        try{
            const res = await docRef.delete()
            isPending.value = false
            return res
        }
        catch(err){
            console.log(err.message)
            isPending.value = false
            error.value = 'could not delete the document', 'err code: ' , err.message
        }
    }

    const updateDoc = async (updates) => {
        isPending.value = true
        error.value = null  

        try{
            const res = await docRef.update(updates)
            isPending.value = false
            return res
        }
        catch(err){
            console.log(err.message)
            isPending.value = false
            error.value = 'could not update the document', 'err code: ' , err.message
        }
    }



    

    return {deleteDoc, updateDoc, isPending, error}
}

export default useDocument