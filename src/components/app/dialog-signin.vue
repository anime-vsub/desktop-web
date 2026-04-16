<template>
  <q-dialog v-model="showDialogLogin">
    <q-card class="h-[60vh] bg-dark-500 min-w-[300px] rounded-xl">
      <q-card-section>
        <div class="flex justify-between">
          <q-btn dense round flat unelevated />

          <div class="flex-1 text-center text-subtitle1">
            {{ t("dang-nhap-de-dong-bo-du-lieu") }}
          </div>

          <q-btn dense round unelevated icon="close" v-close-popup />
        </div>
      </q-card-section>

      <q-card-section>
        <form @submit.prevent="login">
          <div>
            <q-input
              v-model="email"
              outlined
              required
              type="email"
              name="email"
              class="login-input w-full"
              placeholder="E-mail"
              @keydown.stop
            />
          </div>
          <div class="mt-4 relative flex items-center flex-nowrap input-wrap">
            <q-input
              v-model="password"
              outlined
              required
              :type="showPassword ? 'text' : 'password'"
              name="password"
              class="login-input w-full"
              :placeholder="t('mat-khau')"
              @keydown.stop
            >
              <template v-slot:append>
                <q-btn
                  round
                  unelevated
                  class="mr-1"
                  @click="showPassword = !showPassword"
                >
                  <Icon
                    v-if="showPassword"
                    icon="fluent:eye-24-regular"
                    width="22"
                    height="22"
                  />
                  <Icon v-else icon="fluent:eye-off-24-regular" />
                </q-btn>
              </template>
            </q-input>
          </div>

          <div class="text-center text-gray-300 my-3">
            {{ t("dang-nhap-bang-tai-khoan-cua-ban-tren") }}
            <a href="https://animevietsub.cc" target="_blank">AnimeVietsub</a>.
            {{ t("du-lieu-cua-ban-se-duoc-dong-bo-ca-o-do-va-day") }}
          </div>

          <div class="text-grey text-center mt-5 mb-4">
            {{ t("tim-lai-mat-khau") }}
          </div>

          <q-btn
            type="submit"
            no-caps
            rounded
            unelevated
            class="bg-main w-full"
            :disable="!email || !password"
            >{{ t("dang-nhap") }}</q-btn
          >
        </form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { useAuthStore } from "stores/auth"

const showDialogLogin = defineModel<boolean>("modelValue", { required: true })
const { t } = useI18n()
const authStore = useAuthStore()

const showPassword = ref(false)

const email = ref("")
const password = ref("")

const $q = useQuasar()

async function login() {
  const loader = $q.loading.show({
    message: t("dang-xac-thuc-vui-long-doi"),
    boxClass: "bg-dark text-light-9",
    spinnerColor: "main",
    delay: Infinity
  })

  try {
    const data = await authStore.login(email.value, password.value)

    showDialogLogin.value = false
    email.value = ""
    password.value = ""
    $q.notify({
      position: "bottom-right",
      message: t("da-dang-nhap-voi-tu-cach-_user", [data.name])
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err)
    $q.notify({
      position: "bottom-right",
      message: t("dang-nhap-that-bai"),
      caption: err.message
    })
  } finally {
    loader()
  }
}
</script>

<style lang="scss" scoped>
.login-input :deep(.q-field__native) {
  background-color: transparent !important;

  &,
  &:focus,
  &:focus-visible {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }
}
.login-input :deep(.q-field__control),
.login-input :deep(.q-field__append) {
  height: 45px !important;
}
</style>
