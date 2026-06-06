<template lang="pug">
.wrapper
  .wrap
    button.start(@click="startRadio") ラジオを聴く
    button.stop(@click="stop") 読み上げを停止
  .place 現在地 {{ place }}
  .subtitle(@click="isOpen = !isOpen" :class="{ open: isOpen }")
    span.read {{ readText }}
    span.unread {{ unreadText || '待機中...' }}
  input.interest(v-model="interest" placeholder="興味のある話題はなんですか？例）地域の伝説")
</template>

<script setup>
const msg = ref('')
const place = ref('')
const interest = ref('')
const isOpen = ref(false)
const startRadio = async () => {
  place.value = await locate()
  await callApi(place.value)
}
const locate = () => {
  return new Promise((resolve, reject) => {

    if (!navigator.geolocation) {
      reject('位置情報が取得できません')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude
          const lon = position.coords.longitude

          const res = await $fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          )

          resolve(
            res.display_name
          )

        } catch (e) {
          reject(e)
        }
      },
      reject
    )
  })
}

const callApi = async (place) => {
  const data = await $fetch('/api/radio', {
    method: 'POST',
    body: {
      place,
      interest: '',
      mode: 'radio'
    }
  })

  msg.value = data.message
}

watch(msg, (newValue) => {
  if (!newValue) return

  speak(newValue)
})


const speak = (text) => {
  if (!window.speechSynthesis) return

  speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)

  utterance.lang = 'ja-JP'
  utterance.rate = 1.1

  utterance.onstart = () => {
    console.log('speaking start')
  }
  utterance.onboundary = (event) => {
    currentIndex.value = event.charIndex
  }

  utterance.onerror = (e) => {
    console.log('speech error', e)
  }

  speechSynthesis.speak(utterance)
}

const stop = () => {
  speechSynthesis.cancel()
}

const currentIndex = ref(0)

const readText = computed(() =>
  msg.value.slice(0, currentIndex.value)
)

const unreadText = computed(() =>
  msg.value.slice(currentIndex.value)
)

onMounted(() => {
  stop()
  msg.value = ''
})
</script> 

<style lang="stylus">
body
  margin 0
  min-height 100vh
  background #f7f7f7
  color #222

h2
  text-align center
  margin 32px 0 24px
  font-size 32px

.wrap
  display flex
  flex-flow column nowrap
  align-items center
  gap 16px
  margin-top 10%
.wrapper
  display flex
  flex-flow column nowrap
  align-items center
  padding 0 24px
.interest
  width 100%
  display block
  padding 24px
  font-size 14px
  box-sizing border-box
  border-radius 8px
  border 0
  box-shadow 0 0 16px rgba(10, 100, 250, .2)
  &::placeholder
    color #ccc
.start
  width 280px
  height 280px
  border-radius 50%
  border none
  background linear-gradient(135deg, #4f8cff, #7c4dff)
  color #fff
  font-size 32px
  font-weight bold
  cursor pointer
  box-shadow 0 0px 40px rgba(79,140,255,.6)
  transition transform .2s ease
  &:active
    transform scale(.96)

.stop
  border none
  background transparent
  color red
  cursor pointer
  margin-top 24px
.place
  max-width 700px
  margin 32px auto 0
  font-size 14px
  color #777
  text-align center

.subtitle
  max-width 700px
  margin 24px 0

  display -webkit-box
  -webkit-box-orient vertical
  -webkit-line-clamp 3

  overflow hidden
  cursor pointer
  position relative

  line-height 1.8
  font-size 18px
  width 100%
  box-sizing border-box
  transition all .3s ease

  .read
    color #4f8cff
  .unread
    color #aaa

  &.open
    -webkit-line-clamp unset

    &::after
      opacity 0
</style>