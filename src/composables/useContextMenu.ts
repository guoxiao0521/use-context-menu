import ContextMenu from '@/components/contextmenu/ContextMenu.vue';
import { createApp, h, ref, Ref } from 'vue';
import { MaybeElementRef, useEventListener } from '@vueuse/core';

export interface IMenuItem {
    label: string;
    action?: string;
    children?: IMenuItem[];
    showSubMenu?: boolean;
}
export interface IUseContextMenuProps {
    menuItems: Ref<IMenuItem[]>;
    handleEl: MaybeElementRef<HTMLDivElement>;
    onSelect?: (item: IMenuItem) => void;
    onClose?: () => void;
}

export const useContextMenu = ({
    menuItems,
    handleEl,
    onSelect,
    onClose,
}: IUseContextMenuProps) => {
    const visible = ref(true);
    const vNode = ref();
    let container: HTMLDivElement | null = null;

    const mountContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        const unmount = () => {
            if (vNode.value) {
                vNode.value.unmount();
                vNode.value = null;
                if (container) {
                    container.remove();
                    container = null;
                }
            }
        };
        return new Promise((resolve, reject) => {
            if (vNode.value) {
                unmount();
            }
            if (!container) {
                container = document.createElement('div');
                document.body.appendChild(container);
            }
            document.body.appendChild(container);
            const com = h(ContextMenu, {
                visible: visible.value,
                menuItems: menuItems.value,
                position: { x: e.x, y: e.y },
                onSelect: (item) => {
                    resolve(item);
                    unmount();
                },
                onClose: () => {
                    unmount();
                    reject();
                },
            });
            vNode.value = createApp(com);
            vNode.value?.mount?.(container);
        });
    };
    useEventListener(handleEl, 'contextmenu', async (e) => {
        try {
            const r = await mountContextMenu(e);
            onSelect?.(r as IMenuItem);
        } catch (e) {
            console.error('cancel select', e);
            onClose?.();
        }
    });
};
