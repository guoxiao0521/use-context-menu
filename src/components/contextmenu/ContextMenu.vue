<template>
    <div
        v-show="visible"
        ref="contextMenuRef"
        class="context-menu"
        :style="{ top: position.y + 'px', left: position.x + 'px' }"
    >
        <div
            v-for="(item, index) in menuItems"
            :key="index"
            class="menu-item"
            @click="handleItemClick(item)"
            @mouseenter="handleMouseEnter($event, item)"
        >
            <span>{{ item.label }}</span>
            <span v-if="item.children" class="arrow">▶</span>

            <!-- 递归渲染子菜单 -->
            <context-menu
                v-if="item.children"
                :visible="item.showSubMenu"
                :menu-items="item.children"
                :position="subMenuPosition"
                class="sub-menu"
                @select="handleSelect"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { IMenuItem } from '@/composables/useContextMenu.ts';

const props = withDefaults(
    defineProps<{
        visible?: boolean;
        menuItems: IMenuItem[];
        position: { x: number; y: number };
    }>(),
    {
        menuItems: () => [],
    }
);
const contextMenuRef = ref();

const emit = defineEmits(['select', 'close']);
const subMenuPosition = ref({ x: 0, y: 0 });

// 处理菜单项点击
const handleItemClick = (item: IMenuItem) => {
    if (!item.children && item.action) {
        emit('select', item);
    }
};

// 处理鼠标悬停显示子菜单
const handleMouseEnter = (event: MouseEvent, item: IMenuItem) => {
    // 重置所有菜单项的子菜单显示状态
    props.menuItems.forEach((i) => {
        if (i !== item) {
            i.showSubMenu = false;
        }
    });

    if (item.children) {
        item.showSubMenu = true;
        // 计算子菜单位置
        const rect = event?.target?.getBoundingClientRect?.();
        if (!rect) {
            return;
        }
        subMenuPosition.value = {
            x: rect.width,
            y: 0,
        };
    }
};

// 处理子菜单选择
const handleSelect = (item: IMenuItem) => {
    emit('select', item);
};

// 递归将菜单项的子菜单显示状态重置为false
const resetSubMenuVisibility = (items: IMenuItem[]) => {
    items.forEach((item) => {
        item.showSubMenu = false;
        if (item.children) {
            resetSubMenuVisibility(item.children);
        }
    });
};
onClickOutside(contextMenuRef, () => {
    emit('close');
});
onBeforeUnmount(() => {
    resetSubMenuVisibility(props.menuItems);
});
</script>

<style scoped>
.context-menu {
    position: fixed;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px 0;
    min-width: 150px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
}

.menu-item {
    padding: 8px 16px;
    cursor: pointer;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.menu-item:hover {
    background-color: #f5f5f5;
}

.arrow {
    font-size: 12px;
    margin-left: 8px;
}

.sub-menu {
    position: absolute;
    left: 100%;
    top: 0;
}
</style>
