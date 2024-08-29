<template>
  <q-btn flat round unelevated>
    <q-avatar v-if="authStore.isLogged" size="35px">
      <q-img-custom
        v-if="authStore.user_data?.avatar"
        :src="forceHttp2(authStore.user_data.avatar)"
        no-spinner
        referrerpolicy="no-referrer"
      />
      <Icon
        v-else
        icon="fluent:person-circle-24-filled"
        width="30"
        height="30"
      />
    </q-avatar>
    <Icon v-else icon="fluent:settings-24-regular" width="30" height="30" />

    <q-menu
      v-model="showMenuAccount"
      class="rounded-xl bg-dark-page shadow-xl scrollbar-custom overflow-y-auto overflow-x-hidden"
    >
      <q-card class="transparent w-[280px] px-2 pb-3">
        <q-list v-if="tabMenuAccountActive === 'normal'">
          <template v-if="authStore.isLogged">
            <q-item class="rounded-xl">
              <q-item-section avatar>
                <q-avatar size="45px">
                  <img
                    v-if="authStore.user_data?.avatar"
                    :src="forceHttp2(authStore.user_data.avatar)"
                    referrerpolicy="no-referrer"
                  />
                  <Icon
                    v-else
                    icon="fluent:person-circle-24-filled"
                    width="45"
                    height="45"
                  />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="font-weight-medium text-subtitle1">{{
                  authStore.user_data!.name
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator class="bg-[rgba(255,255,255,0.1)]" />

            <q-item
              clickable
              v-ripple
              to="/tai-khoan/edit-profile"
              active-class=""
              class="rounded-xl"
            >
              <q-item-section avatar class="min-w-0">
                <Icon icon="fluent:info-24-regular" width="20" height="20" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ t("trung-tam-ca-nhan") }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-else>
            <q-item class="rounded-xl">
              <q-item-section>
                {{ t("cai-dat") }}
              </q-item-section>
            </q-item>

            <q-separator class="bg-[rgba(255,255,255,0.1)]" />
          </template>

          <q-item
            clickable
            v-ripple
            class="rounded-xl"
            @click="tabMenuAccountActive = 'locale'"
          >
            <q-item-section avatar class="min-w-0">
              <Icon icon="carbon:translate" width="20" height="20" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t("ngon-ngu") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <Icon icon="fluent:chevron-right-24-regular" />
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            class="rounded-xl"
            @click="tabMenuAccountActive = 'setting'"
          >
            <q-item-section avatar class="min-w-0">
              <Icon icon="fluent:settings-24-regular" width="20" height="20" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t("cai-dat-chung") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <Icon icon="fluent:chevron-right-24-regular" />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="rounded-xl">
            <q-item-section avatar class="min-w-0">
              <Icon
                icon="fluent:phone-vertical-scroll-24-regular"
                width="20"
                height="20"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t("cuon-vo-han") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                v-model="settingsStore.infinityScroll"
                dense
                color="main"
              />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="rounded-xl">
            <q-item-section avatar class="min-w-0">
              <Icon
                icon="fluent:phone-vertical-scroll-24-regular"
                width="20"
                height="20"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{
                t("khoi-phuc-tap-cuoi-cung-bo-anime")
              }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                v-model="settingsStore.restoreLastEp"
                dense
                color="main"
              />
            </q-item-section>
          </q-item>

          <!-- <q-item clickable v-ripple class="rounded-xl">
            <q-item-section avatar class="min-w-0">
              <Icon
                icon="fluent:phone-vertical-scroll-24-regular"
                width="20"
                height="20"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{
                t("luu-tien-trinh-xem-khi-offline")
              }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                v-model="settingsStore.enablePersistent"
                dense
                color="main"
              />
            </q-item-section>
          </q-item> -->

          <q-item clickable v-ripple class="rounded-xl">
            <q-item-section avatar class="min-w-0">
              <Icon
                icon="fluent:phone-vertical-scroll-24-regular"
                width="20"
                height="20"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>Hiện số anime thông báo</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                v-model="settingsStore.showCountNotify"
                dense
                color="main"
              />
            </q-item-section>
          </q-item>

          <q-item
            v-if="authStore.isLogged"
            clickable
            v-ripple
            class="rounded-xl"
            @click="logout"
          >
            <q-item-section avatar class="min-w-0">
              <Icon icon="fa:sign-out" width="20" height="20" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t("thoat") }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-list v-if="tabMenuAccountActive === 'locale'">
          <q-item class="rounded-xl">
            <q-item-section avatar class="min-w-0">
              <q-btn
                round
                dense
                unelevated
                @click="tabMenuAccountActive = 'normal'"
              >
                <Icon
                  icon="fluent:ios-arrow-ltr-24-regular"
                  width="20"
                  height="20"
                />
              </q-btn>
            </q-item-section>
            <q-item-section>
              {{ t("chon-ngon-ngu-cua-ban") }}
            </q-item-section>
          </q-item>

          <!-- <q-separator class="bg-[rgba(255,255,255,0.1)]" /> -->

          <q-item
            v-for="{ name, code } in langs"
            :key="code"
            clickable
            v-ripple
            class="rounded-xl"
            @click="settingsStore.locale = code"
          >
            <q-item-section avatar class="min-w-0">
              <Icon
                v-if="settingsStore.locale === code"
                icon="fluent:checkmark-24-regular"
                width="20"
                height="20"
              />
              <span v-else class="block w-[20px]" />
            </q-item-section>
            <q-item-section>{{ name }}</q-item-section>
          </q-item>
        </q-list>

        <q-list v-if="tabMenuAccountActive === 'setting'">
          <q-item class="rounded-xl">
            <q-item-section avatar class="min-w-0">
              <q-btn
                round
                dense
                unelevated
                @click="tabMenuAccountActive = 'normal'"
              >
                <Icon
                  icon="fluent:ios-arrow-ltr-24-regular"
                  width="20"
                  height="20"
                />
              </q-btn>
            </q-item-section>
            <q-item-section> {{ t("cai-dat-chung") }} </q-item-section>
          </q-item>

          <!-- <q-separator class="bg-[rgba(255,255,255,0.1)]" /> -->

          <q-item clickable v-ripple class="rounded-xl">
            <q-item-section>
              <q-item-label>{{ t("tu-dong-phat") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                v-model="settingsStore.player.autoNext"
                size="sm"
                color="green"
              />
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple class="rounded-xl">
            <q-item-section>
              <q-item-label>{{ t("nhac-toi-tam-dung-xem") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                v-model="settingsStore.player.enableRemindStop"
                size="sm"
                color="green"
              />
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple class="rounded-xl">
            <q-item-section>
              <q-item-label>{{
                $t("hien-thi-thoi-gian-trong-trinh-phat")
              }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                v-model="settingsStore.ui.currentTime"
                size="sm"
                color="green"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import QImgCustom from "components/QImgCustom"
import { forceHttp2 } from "src/logic/forceHttp2"
import { useAuthStore } from "src/stores/auth"
import { useSettingsStore } from "src/stores/settings"
import langs from "virtual:i18n-langs"

const { t } = useI18n()
const $q = useQuasar()

const authStore = useAuthStore()
const settingsStore = useSettingsStore()

const showMenuAccount = ref(false)

// account
// showMenuAccount
const tabMenuAccountActive = ref<"normal" | "locale" | "setting">("normal")
watch(showMenuAccount, (val) => {
  if (val) tabMenuAccountActive.value = "normal"
})

// // ======= notify reload app apply change =======
// watch(
//   () => settingsStore.enablePersistent,
//   () => {
//     $q.notify({
//       message: t("tuy-chon-nay-can-tai-lai-trang-de-ap-dung-thay-doi"),
//       position: "bottom-right",
//       timeout: 0,
//       actions: [
//         {
//           label: t("tai-lai"),
//           color: "yellow",
//           noCaps: true,
//           handler: () => location.reload()
//         },
//         {
//           label: t("de-sau"),
//           round: true
//         }
//       ]
//     })
//   }
// )

async function logout() {
  authStore.logout()
  $q.notify({
    position: "bottom-right",
    message: t("da-dang-xuat")
  })
}
</script>
