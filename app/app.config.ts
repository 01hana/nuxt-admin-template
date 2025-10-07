export default defineAppConfig({
  ui: {
    container: {
      base: 'w-full max-w-1280',
    },
    colors: {
      primary: 'sky',
      neutral: 'zinc',
    },
    button: {
      slots: {
        base: 'cursor-pointer',
      },
      defaultVariants: {
        color: 'primary',
        variant: 'subtle',
        size: 'lg',
      },
    },
    card: {
      slots: {
        header: 'border-none',
        body: 'sm:py-0',
      },
    },
    dropdownMenu: {
      slots: {
        item: 'block w-full text-center cursor-pointer px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
      },
    },
    tooltip: {
      slots: {
        content: 'text-base',
      },
    },
    modal: {
      slots: {
        wrapper: 'flex items-center',
        content: 'ring-0',
        title: 'text-lg',
        description: 'px-3 py-1 mx-2 bg-sky-100 text-primary rounded-full',
        footer: 'justify-center',
      },
    },
    switch: {
      variants: {
        color: {
          primary: {
            base: 'data-[state=checked]:bg-teal-500 data-[state=unchecked]:bg-red-400',
            icon: 'group-data-[state=checked]:text-teal-500 group-data-[state=unchecked]:text-red-400',
          },
        },
      },
    },
    inputNumber: {
      slots: {
        increment: '',
        decrement: '',
      },
      variants: {
        color: {
          primary: 'bg-teal-500 text-teal-500',
        },
      },
    },
    accordion: {
      slots: {
        label: 'text-base',
      },
    },
  },
  icon: {
    size: '20px',
    class: 'icon',
    mode: 'css',
    aliases: {
      nuxt: 'logos:nuxt-icon',
    },
    cssLayer: 'base',
  },
});
