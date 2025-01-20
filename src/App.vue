<script setup lang="ts">
import {ref} from "vue";
import {IMenuItem, useContextMenu} from "@/composables/useContextMenu.ts";

const menuItems = ref<IMenuItem[]>([
    {
        label: '新建',
        children: [
            { label: '文件', action: 'new-file' },
            { label: '文件夹', action: 'new-folder' }
        ]
    },
    {
        label: '编辑',
        children: [
            { label: '复制', action: 'copy' },
            { label: '粘贴', action: 'paste' },
            { label: '剪切', action: 'cut' }
        ]
    },
    { label: '删除', action: 'delete' },
    { label: '刷新', action: 'refresh' }
])
const handleEl = ref()

useContextMenu({
    menuItems,
    handleEl,
    onSelect: (item) => {
        console.log(item)
    },
    onClose: () => {
        console.log('close')
    }
})

</script>

<template>
  <div class="h-dvh w-dvw" ref="handleEl">

  </div>

</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
