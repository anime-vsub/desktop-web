<template>
  <q-btn round unelevated class="mr-2">
    <Icon
      :icon="
        showMenuNotify
          ? 'clarity:notification-solid'
          : 'clarity:notification-line'
      "
      width="24"
      height="24"
    />

    <q-badge
      v-if="notificationStore.syncing"
      floating
      rounded
      transparent
      class="top-0 right-auto left-0 bg-main animate-ping animate-duration-[2s] min-w-0 min-h-0 w-2 h-2 px-0 py-0"
    />

    <q-badge
      floating
      rounded
      transparent
      class="top-0"
      :label="
        notificationStore.max +
        ((settingsStore.showCountNotify
          ? notificationStore.maxInDB?.notify_count
          : notificationStore.maxInDB?.notify_chap_count) ?? 0)
      "
    />

    <q-menu
      v-model="showMenuNotify"
      class="flex flex-nowrap column bg-dark-page shadow-xl min-w-380px max-w-100%"
      ref="menuRef"
    >
      <q-card-section
        class="flex flex-nowrap items-center justify-between pt-2 pb-1"
      >
        <div class="flex flex-nowrap items-center">
          <span class="text-16px mr-1 whitespace-nowrap">Thông báo</span>

          <q-tabs
            v-model="tab"
            align="justify"
            narrow-indicator
            dense
            no-caps
            inline-label
            class="text-gray-200"
          >
            <q-tab no-caps name="api" label="API">
              <q-badge
                floating
                rounded
                transparent
                class="top-0"
                :label="notificationStore.max"
              />
            </q-tab>
            <q-tab no-caps name="db" label="Database">
              <q-badge
                floating
                rounded
                transparent
                class="top-0"
                :label="notificationStore.maxInDB?.notify_count"
              />
            </q-tab>
          </q-tabs>
        </div>

        <div class="flex flex-nowrap items-center">
          <q-toggle v-model="settingsStore.autoSyncNotify" label="Đồng bộ" />

          <q-btn round unelevated @click="notificationStore.startSync">
            <i-fluent-arrow-sync-24-regular
              width="24"
              height="24"
              class="animate-duration-2s"
              :class="{ 'animate-spin': notificationStore.syncing }"
              :style="{ 'animation-timing-function': 'ease' }"
            />
          </q-btn>
        </div>
      </q-card-section>
      <q-card
        class="bg-transparent w-[435px] max-w-100% flex flex-col scrollbar-custom overflow-y-auto"
        ref="cardRef"
      >
        <q-card-section class="pt-0 pr-0">
          <q-tab-panels
            v-model="tab"
            animated
            transition-prev="scale"
            transition-next="scale"
            class="transparent overflow-visible"
          >
            <q-tab-panel name="api" class="px-0 py-0">
              <q-list v-if="notificationStore.loading" class="bg-transparent">
                <q-item v-for="item in 12" :key="item" class="rounded-xl">
                  <q-item-section>
                    <q-item-label class="text-subtitle1 text-weight-normal">
                      <q-skeleton type="text" width="40%" />
                      <q-skeleton type="text" width="60%" />
                    </q-item-label>
                    <q-item-label>
                      <q-skeleton type="text" width="100" height="15px" />
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-responsive
                      :ratio="120 / 81"
                      class="w-[120px] rounded-sm"
                    >
                      <q-skeleton type="rect" class="absolute w-full h-full" />
                    </q-responsive>
                  </q-item-section>
                </q-item>
              </q-list>

              <q-list v-else class="bg-transparent">
                <transition-group name="notify">
                  <q-item
                    v-for="item in notificationStore.items"
                    :key="item.id"
                    :to="item.path"
                    class="hidden-focus-helper"
                  >
                    <q-item-section>
                      <q-item-label class="text-subtitle1 text-weight-normal"
                        >{{ item.name }}
                        <span class="text-grey"> {{ t("da-cap-nhat") }} </span
                        >{{ $t("Tap") }} {{ item.chap }}</q-item-label
                      >
                      <q-item-label class="text-grey">{{
                        item.time
                      }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="flex flex-nowrap">
                        <q-img
                          no-spinner
                          :src="forceHttp2(item.image!)"
                          referrerpolicy="no-referrer"
                          width="128px"
                          :ratio="120 / 81"
                          class="rounded-sm"
                        />
                        <div class="mr-[-32px]">
                          <q-btn
                            round
                            dense
                            unelevated
                            icon="close"
                            @click.prevent="notificationStore.remove(item.id)"
                          />
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </transition-group>
              </q-list>

              <div
                v-if="notificationStore.items.length < notificationStore.max"
                class="text-grey text-center mt-3 mx-2 mb-3"
              >
                {{
                  t(
                    "do-api-server-khong-day-du-ban-phai-xoa-nhung-thong-bao-moi-de-xem-nhung-thong-bao-cu"
                  )
                }}
              </div>
            </q-tab-panel>
            <q-tab-panel name="db" class="px-0 py-0 overflow-visible">
              <notify-database
                @update="menuRef?.updatePosition()"
                :scroll-target="cardRef?.$el"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
    </q-menu>
  </q-btn>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import { QCard, QMenu } from "quasar"
import { forceHttp2 } from "src/logic/forceHttp2"
import { useNotificationStore } from "stores/notification"
import { useSettingsStore } from "stores/settings"

import NotifyDatabase from "./components/notify-database.vue"

const notificationStore = useNotificationStore()
const settingsStore = useSettingsStore()

const { t } = useI18n()

const showMenuNotify = ref(false)

const tab = ref<"api" | "db">(settingsStore.autoSyncNotify ? "db" : "api")

const menuRef = ref<InstanceType<typeof QMenu>>()

watch(tab, async () => {
  await nextTick()
  menuRef.value?.updatePosition()
})

const cardRef = ref<QCard>()
</script>

<style lang="scss" scoped>
.notify {
  &-move,
  &-enter-active,
  &-leave-active {
    transition: all 0.22s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  &-leave-active {
    position: absolute;
  }
}
</style>

<style lang="scss" scoped>
.hidden-focus-helper :deep(.q-focus-helper) {
  display: none !important;
}
</style>
