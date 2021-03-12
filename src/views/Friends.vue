<template>
<div class="content">
    <div v-if="!friends" class="loading-spinner"><i class="pi pi-spin pi-spinner" style="fontSize: 2rem"></i></div>
    <div v-if="friends" class="friends">
        <h2>Friends</h2>
        <div v-for="friend in friends" :key="friend.id">
            <Friend :friend="friend"/>
        </div>
        <Button v-if="!showForm" @click="showForm = !showForm"><i class="material-icons">add_circle</i></button>
        <div v-if="showForm" @submit.prevent="addNewFriend">
            
            <form>
                <h4>Add Friend</h4>
                <input type="text"
                placeholder="email"
                required
                v-model="friendInput">
                <button>Request</button>
                <button @click.prevent="{showForm = false; friendInput = '';}">Cancel</button>
            </form>
        </div>
        <h2>Requests</h2>
        <div v-for="request in requests" :key="request.id">
            <div class="card">
                <h3>{{request.displayName}}</h3>
                <p>{{request.email}}</p>
                <button @click="() => {accept(request)}">Accept</button>
                <button @click="() => {decline(request.id)}">Decline</button>
            </div>
        </div>

    </div>

</div>
</template>

<script>
import { ref } from 'vue';
import getCollection from '@/composables/getCollection'
import useCollection from '@/composables/useCollection'
import useDocument from '@/composables/useDocument'
import getUser from '@/composables/getUser'
import Button from 'primevue/button';

import Friend from '@/components/Friend.vue'

export default {
    components: {Friend, Button},
    setup(){
        const showForm = ref(false);
        const {user} = getUser(); 
        const friendInput = ref('');

        const {documents: requests} = getCollection('users/' + user.value.uid + '/friendRequests')
        const {documents: friends} = getCollection('users/' + user.value.uid + '/friends');

        const addNewFriend = async () => {
           const {documents, error} = getCollection('users', ['email', '==', friendInput.value])
           setTimeout(() => {
               if(documents.value){
                   console.log(documents.value[0].id);
                   const {addDoc} = useCollection('users/' + documents.value[0].id + '/friendRequests');
                   addDoc({
                       displayName: user.value.displayName,
                       email: user.value.email,
                       userId: user.value.uid,
                       time: new Date().toString()
                   })
               }
               else if (error) {
                console.log(error)
                   }
                else {
                    console.log('user not found');
                }
                showForm.value = false;
                friendInput.value = false;
           }, 500)
        }

        const accept = async (request) => {
            const {addDoc: myFriend} = useCollection('users/' + user.value.uid + '/friends');
            myFriend({
                displayName: request.displayName,
                userId: request.userId,
                email: request.email,
            })
            const {addDoc: theirFriend} = useCollection('users/' + request.userId + '/friends');
            theirFriend({
                displayName: user.value.displayName,
                userId: user.value.uid,
                email: user.value.email,
            })
            decline(request.id);
        }

        const decline = async (requestId) => {
            console.log(requestId);
            const {deleteDoc} = useDocument('users/' + user.value.uid + '/friendRequests', requestId);
            await deleteDoc();
        }

        return {showForm, friendInput, addNewFriend, requests, friends, decline, accept, user}
    }

}
</script>

<style scoped>
.content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 20px;
    display: flex;
    justify-content: center;
}
.friends {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
form {
    text-align: center;
}
button {
    max-width: 100px;
    border-radius: 20px;
    background: var(--primary);
}
div {
    margin-bottom: 20px;
    }
</style>