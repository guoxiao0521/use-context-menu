<script setup lang="ts">
import {createApp, h, ref} from "vue";
import ContextMenu from "@/components/contextmenu/ContextMenu.vue";
import {useEventListener} from "@vueuse/core";

// 菜单数据
const menuItems = ref([
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
const visible = ref(true)
const _app = ref()
const useContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    const unmount = () => {
        if (_app.value) {
            _app.value.unmount();
            _app.value = null;
        }
    }
    return new Promise((resolve, reject) => {
        if (_app.value) {
            unmount();
        }
        const container = document.createElement('div');
        document.body.appendChild(container);
        const com = h(
            ContextMenu,
            {
                visible: visible.value,
                menuItems: menuItems.value,
                position: { x: e.x, y: e.y },
                onSelect: (item) => {
                    resolve(item)
                    container.remove();
                    unmount();
                },
                onClose: () => {
                    container.remove();
                    unmount();
                    reject();
                }
            },
        )
        _app.value = createApp(com);
        _app.value?.mount?.(container);
    })
}
const wrapper = ref()

useEventListener('contextmenu', async (e) => {
    try {
        const r = await useContextMenu(e);
        console.log(r)
    } catch (e) {
        console.error('cancel select')
    }
})

</script>

<template>
  <div class="w-full h-full" ref="wrapper">

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
