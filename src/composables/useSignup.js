import { ref } from "vue"
import {projectAuth} from '../firebase/config'

 
const error = ref(null)
const isPending = ref(false)
const userID = ref(null)

const signup = async (email, password, displayName) => {
    error.value = null
    isPending.value = true

    
    try{
        const res = await projectAuth.createUserWithEmailAndPassword(email, password)
        if (!res){
            throw new Error ('Could not complete the signup')
        }
        await res.user.updateProfile({displayName})
        userID.value = res.user.uid;

        console.log(userID.value);
        
        error.value = null

        isPending.value = false
        
        return res
    }
    catch(err){
        error.value = err.message
        console.log(error.value)
        isPending.value = false
    }

    return userID;
}

const useSignup = () => {
    return {error, signup, isPending}
}

export default useSignup