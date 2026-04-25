<template>
  <q-btn round unelevated class="mr-2">
    <q-circular-progress
      v-if="updatingCache && installedSW"
      indeterminate
      rounded
      show-value
      size="35px"
      color="main"
    >
      <Icon icon="codicon:github-inverted" width="24" height="24" />
    </q-circular-progress>
    <Icon v-else icon="codicon:github-inverted" width="24" height="24" />

    <q-menu
      anchor="bottom right"
      self="top right"
      class="rounded-xl bg-dark-page shadow-xl"
    >
      <q-card class="transparent w-[280px] px-2 pb-3">
        <q-list>
          <q-item class="rounded-xl">
            <q-item-section class="text-[15px]">
              {{ t("ve-ung-dung") }}
            </q-item-section>
          </q-item>

          <!-- <q-separator class="bg-[rgba(255,255,255,0.1)]" /> -->

          <q-item
            clickable
            v-ripple
            class="rounded-xl"
            target="_blank"
            href="https://github.com/anime-vsub/desktop-web"
          >
            <q-item-section avatar class="min-w-0">
              <Icon icon="carbon:repo-source-code" width="20" height="20" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t("ma-nguon-mo-tren-github") }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            class="rounded-xl"
            target="_blank"
            href="https://github.com/anime-vsub/desktop-web/issues"
          >
            <q-item-section avatar class="min-w-0">
              <Icon
                icon="fluent:person-feedback-24-regular"
                width="20"
                height="20"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t("phan-hoi-hoac-bao-loi") }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            class="rounded-xl"
            target="_blank"
            href="https://github.com/anime-vsub/desktop-web/discussions"
          >
            <q-item-section avatar class="min-w-0">
              <Icon
                icon="fluent:plug-disconnected-24-regular"
                width="20"
                height="20"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t("thao-luan") }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            class="rounded-xl"
            target="_blank"
            href="https://anime-vsub.github.io/about/sponsors"
          >
            <q-item-section avatar class="min-w-0">
              <Icon icon="octicon:sponsor-tiers-24" width="20" height="20" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t("tai-tro-ung-ho") }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple class="rounded-xl" @click="checkForUpdate">
            <q-item-section avatar class="min-w-0">
              <Icon
                icon="charm:refresh"
                width="20"
                height="20"
                :class="{
                  'animate-spin': checkingForUpdate
                }"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t("kiem-tra-cap-nhat") }}</q-item-label>
              <q-item-label caption>
                {{ version }}
                <template v-if="newVersionAble">
                  ({{
                    t("da-co-ban-cap-nhat-moi-_newVersion", [newVersionAble])
                  }}
                  &bull;
                  <q-btn flat rounded no-caps @click="updateApp">{{
                    t("cap-nhat")
                  }}</q-btn
                  >)
                </template>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import semverGt from "semver/functions/gt"
import { version } from "src/../package.json"
import { parseMdBasic } from "src/logic/parseMdBasic"
import { installedSW, updatingCache } from "src/logic/state-sw"

const { t } = useI18n()
const $q = useQuasar()

const newVersionAble = ref<string | null>(null)
const checkingForUpdate = ref(false)
function updateApp() {
  location.reload()
}
async function checkForUpdate() {
  checkingForUpdate.value = true

  const { tag_name: tagName, body }: { tag_name: string; body: string } =
    await fetch(
      "https://api.github.com/repos/anime-vsub/desktop-web/releases/latest"
    ).then((res) => res.json())

  checkingForUpdate.value = false
  if (semverGt(tagName.slice(1), version)) {
    // new version available
    newVersionAble.value = tagName.slice(1)
    $q.dialog({
      title: t("da-co-ban-cap-nhat-moi"),
      message:
        t(
          "phien-ban-animevsub-da-co-ban-cap-nhat-moi-tai-lai-trang-de-cap-nhat"
        ) + `<div style='margin-top: 10px'>${parseMdBasic(body)}</div>`,
      html: true,
      ok: { flat: true, rounded: true },
      cancel: { flat: true, rounded: true },
      focus: "cancel",
      class: "card-changelog"
    }).onOk(updateApp)
  }
}
</script>
