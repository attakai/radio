<template lang="pug">
  .wrap
    button.start(@click="startRadio") ラジオを聴く
    button.stop(@click="stop") 読み上げを停止
  .place 現在地 {{ place }}
  .subtitle(@click="isOpen = !isOpen" :class="{ open: isOpen }")
    span.read {{ readText }}
    span.unread {{ unreadText || '今いる場所の雑学を聞いてみましょう。' }}
</template>

<script setup>
const msg = ref('')
const place = ref('')
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
            res.address.city +
            res.address.suburb
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
      interest: '地名の由来',
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
  speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  utterance.rate = 1.2 // 話すスピード
  utterance.onboundary = (event) => {
    currentIndex.value = event.charIndex
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
  box-shadow 0 16px 40px rgba(79,140,255,.25)
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
  padding 0 24px
  font-size 14px
  color #777
  text-align center

.subtitle
  max-width 700px
  margin 24px 5%
  padding 24px
  background rgba(255,255,255,.8)
  backdrop-filter blur(16px)
  border-radius 24px
  box-shadow 0 8px 32px rgba(0,0,0,.08)

  display -webkit-box
  -webkit-box-orient vertical
  -webkit-line-clamp 3

  overflow hidden
  cursor pointer
  position relative

  line-height 1.8
  font-size 18px

  transition all .3s ease

  .read
    color #4f8cff
  .unread
    color #aaa
  &::after
    content ""
    position absolute
    left 0
    right 0
    bottom 0
    height 80px

    background linear-gradient(
      rgba(255,255,255,0),
      rgba(255,255,255,1)
    )

    transition opacity .3s ease

  &.open
    -webkit-line-clamp unset

    &::after
      opacity 0
</style>