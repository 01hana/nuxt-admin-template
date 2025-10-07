import type { Ref, ComputedRef } from 'vue';

export interface ModalProps {
  id: Ref<string | undefined>;
  type: Ref<'ADD' | 'EDIT' | undefined>;
  show: Ref<boolean>;
  title: Ref<string>;
  subtitle: Ref<string>;
  loading: Ref<boolean>;
  spinner: Ref<boolean>;
  setTitle: (title: string, subtitle?: string) => void;
  afterEnter: () => void;
  afterLeave: () => void;
  setModal: (statusOrId: boolean | string | number, isPreview?: boolean | undefined) => void;
  setLoading: (state: boolean) => void;
  setSpinner: (state: boolean) => void;
  isShown: ComputedRef<boolean>;
  isPreview: ComputedRef<boolean>;
  isAdd: ComputedRef<boolean>;
  isEdit: ComputedRef<boolean>;
}

export const useModalKey = Symbol('useModal') as InjectionKey<ModalProps>;

export function useModal(): ModalProps {
  const [loading, setLoading] = useAppState(false);
  const [spinner, setSpinner] = useAppState(false);

  const id = ref();
  const type = ref();
  const show = ref(false);
  const title = ref('');
  const subtitle = ref('');

  const _shown = shallowRef(false);

  const isShown = computed(() => _shown.value);
  const isPreview = computed(() => type.value === 'PREVIEW');
  const isAdd = computed(() => type.value === 'ADD');
  const isEdit = computed(() => type.value === 'EDIT');

  function setTitle(modalTitle: string, modalSubtitle?: string) {
    title.value = modalTitle;
    subtitle.value = modalSubtitle ?? '';
  }

  function afterEnter() {
    _shown.value = true;
  }

  function afterLeave() {
    _shown.value = false;

    id.value = undefined;
    type.value = undefined;

    setLoading(false);
    setSpinner(false);
  }

  function setModal(statusOrId: boolean | string | number, isPreview?: boolean | undefined) {
    if (typeof statusOrId === 'boolean') {
      if (!statusOrId) {
        show.value = false;

        return;
      }

      id.value = undefined;
      type.value = 'ADD';
      subtitle.value = '新增';
      show.value = true;

      return;
    }

    id.value = statusOrId;

    type.value = !isPreview ? 'EDIT' : 'PREVIEW';
    subtitle.value = !isPreview ? '編輯' : '瀏覽';
    show.value = true;
  }

  return {
    id,
    type,
    show,
    title,
    subtitle,
    loading,
    spinner,
    isShown,
    isPreview,
    isAdd,
    isEdit,

    afterEnter,
    afterLeave,
    setModal,
    setTitle,
    setLoading,
    setSpinner,
  };
}
