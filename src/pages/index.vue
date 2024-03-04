<route lang="yaml">
meta:
  footer: true
  forceScrollBehavior: true
</route>

<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>
