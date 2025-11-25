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
        body: 'sm:py-0 w-full',
      },
    },
    dropdownMenu: {
      slots: {
        item: 'cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-gray-800',
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
    navigationMenu: {
      slots: {
        root: 'flex-1 p-4 space-y-1 overflow-y-auto',
        list: 'flex flex-col gap-1.5',
        link: 'text-base font-normal',
      },
      variants: {
        active: {
          true: {
            link: 'bg-primary-100 text-primary-700 rounded-md',
            linkLeadingIcon: 'text-primary-700',
            linkLabel: 'text-primary-700',
            childLink: 'text-primary-700 !bg-transparent before:bg-transparent',
          },
          false: {
            link: 'text-default rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
            linkLeadingIcon: 'text-default dark:text-gray-300',
          },
        },
      },
      compoundVariants: [
        {
          class: {
            childList: 'border-0 gap-1.5 flex flex-col py-1',
          },
        },
      ],
      defaultVariants: {
        color: undefined,
        variant: undefined,
        highlightColor: undefined,
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
