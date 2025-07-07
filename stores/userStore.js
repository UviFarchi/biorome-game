import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const userStore = defineStore('user', () => {
    const name = ref('')
    const avatar = ref('')
    const gold = ref(100)
    const difficulty = ref(3)
    if (localStorage.getItem('bioromeUser')) {
        const data = JSON.parse(localStorage.getItem('bioromeUser'))
        name.value = data.name || ''
        avatar.value = data.avatar || ''
        difficulty.value = data.difficulty || 0
    }

    watch([name, avatar, difficulty], () => {
        localStorage.setItem('bioromeUser', JSON.stringify({
            name: name.value,
            avatar: avatar.value,
            difficulty: difficulty.value
        }))
    })
    return { name, avatar, gold, difficulty }
})
