<script setup lang="ts">
import { Suspense, defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import HeaderBlock from './components/Header.vue'
import FooterBlock from './components/Footer.vue'
import { store } from './store'
import Cookies from 'js-cookie'
import notie from 'notie'
</script>

<template>
  <HeaderBlock />
  <Suspense fallback="Loading...">
    <RouterView
      v-slot="{ Component }"
      :key="componentKey"
      @success="success"
      @error="error"
      @warning="warning"
      @forceUpdate="forceUpdate"
    >
      <KeepAlive include="Books">
        <Component :is="Component" />
      </KeepAlive>
    </RouterView>
  </Suspense>
  <FooterBlock />
</template>

<script lang="ts">
export default defineComponent({
  name: 'App',
  data() {
    return {
      store,
      componentKey: 0
    }
  },
  beforeMount() {
    const cookieData = Cookies.get('_site_data')

    if (cookieData) {
      const cookieDataParsed = JSON.parse(cookieData)
      store.token = cookieDataParsed.token.token
      store.user = {
        id: cookieDataParsed.user.id,
        first_name: cookieDataParsed.user.first_name,
        last_name: cookieDataParsed.user.last_name,
        email: cookieDataParsed.user.email
      }
    }
  },
  methods: {
    success(message: string) {
      notie.alert({
        type: 'success',
        text: message
      })
    },
    error(message: string) {
      notie.alert({
        type: 'error',
        text: message
      })
    },
    warning(message: string) {
      notie.alert({
        type: 'warning',
        text: message
      })
    },
    forceUpdate() {
      this.componentKey++
    }
  }
})
</script>

<style scoped></style>
