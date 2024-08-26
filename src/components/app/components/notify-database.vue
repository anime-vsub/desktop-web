<template>
  <q-list v-if="loading" class="bg-transparent">
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
        <q-responsive :ratio="120 / 81" class="w-[120px] rounded-sm">
          <q-skeleton type="rect" class="absolute w-full h-full" />
        </q-responsive>
      </q-item-section>
    </q-item>
  </q-list>

  <q-list v-else class="bg-transparent">
    <transition-group name="notify">
      <q-item
        v-for="(item, index) in data"
        :key="item.season"
        :to="`/phim/${item.season}/${parseChapName(
          (item.episodes as Episode[])[0].name
        )}-${(item.episodes as Episode[])[0].chap_id}`"
        class="hidden-focus-helper pr-0"
      >
        <q-item-section>
          <q-item-label class="text-subtitle1 text-weight-normal"
            >{{ item.name }}
            <span class="text-grey lowercase"> {{ t("da-cap-nhat") }} </span>
            {{ $t("tap-_chap", [(item.episodes as Episode[])[0].name]) }}
          </q-item-label>
          <q-item-label class="text-grey">{{
            dayjs((item.episodes as Episode[])[0].time).fromNow()
          }}</q-item-label>
          <q-item-label caption @click.stop>
            <router-link
              v-for="episode in item.episodes as Episode[]"
              :key="episode.chap_id"
              :to="`/phim/${item.season}/${parseChapName(
                episode.name
              )}-${episode.chap_id}`"
            >
              <q-chip
                rounded
                no-caps
                unelevated
                outline
                dense
                color="gray-300 px-2 py-1 mx-1 text-12px border-gray-400 border-opacity-30"
                clickable
                removable
                @remove="removeNotifyChap(episode, item)"
              >
                {{ episode.name }}
                <q-tooltip
                  >{{ dayjs(episode.time).fromNow() }} -
                  {{ dayjs(episode.time).format("dd DD/MM/YYYY") }}</q-tooltip
                >
              </q-chip>
            </router-link>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="flex flex-nowrap">
            <q-img-custom
              no-spinner
              :src="forceHttp2(addHostUrlImage(item.image!))"
              referrerpolicy="no-referrer"
              width="128px"
              :ratio="120 / 81"
              class="rounded-sm"
            />
            <div>
              <q-btn
                round
                dense
                unelevated
                icon="close"
                @click.prevent="
                  notificationStore.remove(item.season, true),
                    data?.splice(index, 1)
                "
              />
            </div>
          </div>
        </q-item-section>
      </q-item>
    </transition-group>
  </q-list>
</template>

<script lang="ts" setup>
import type { Database } from "app/database"
import QImgCustom from "components/QImgCustom"
import dayjs from "src/logic/dayjs"
import { forceHttp2 } from "src/logic/forceHttp2"
import { parseChapName } from "src/logic/parseChapName"
import { sleep } from "src/logic/sleep"
import { addHostUrlImage } from "src/logic/urlImage"
import { useNotificationStore } from "stores/notification"
import { useRequest } from "vue-request"

const notificationStore = useNotificationStore()

type Episode = Database["public"]["Tables"]["notify_chap"]["Insert"]

const { t } = useI18n()
const emit = defineEmits<{
  (name: "update"): void
}>()

const $q = useQuasar()

let page = 1
const { data, loading } = useRequest(() =>
  notificationStore.queryDb(page++).then((data) => reactive(data))
)

watch(data, async (_, old) => {
  if (old) return

  await nextTick()
  await sleep(70)

  emit("update")
})

function removeNotifyChap(
  episode: Episode,
  notify: Awaited<ReturnType<typeof notificationStore.queryDb>>[0]
) {
  $q.dialog({
    title: "Xóa thông báo tập này?",
    message:
      "Việc này có thể ảnh hưởng đến thứ tự thông báo bạn đang nhìn thấy",
    focus: "none",

    cancel: {
      label: t("huy"),
      noCaps: true,
      color: "grey",
      text: true,
      flat: true,
      rounded: true
    },
    ok: { color: "green", text: true, flat: true, rounded: true }
  }).onOk(() => {
    notificationStore.remove(notify.season, true, episode.chap_id)

    notify.episodes = (notify.episodes as Episode[])?.filter(
      (e) => e.chap_id !== episode.chap_id
    )

    if (notify.episodes.length < 1)
      data.value?.splice(data.value.indexOf(notify) >>> 0, 1)
  })
}
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
