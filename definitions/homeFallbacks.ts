/**
 * 🔧 Home Fallbacks - Dados lorem ipsum da homepage
 *
 * Usado como valor inicial e fallback quando Firebase nao responde.
 * Estrutura espelha IHomePageData (formato Firestore).
 */

import type { IHomePageData } from '@appTypes/admin';

// ============== FALLBACK ==============

export const HOME_FALLBACK: IHomePageData = {
  content: {
    hero: {
      badge: 'LOREM IPSUM DOLOR SIT',
      title: 'LOREM IPSUM',
      subtitle:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      btnDonate: 'Lorem Ipsum',
      btnHistory: 'Lorem Dolor',
      stats: [
        { icon: 'luc-award', number: '000', label: 'Lorem Ipsum' },
        { icon: 'luc-megaphone', number: '0a', label: 'Lorem Dolor' },
        { icon: 'luc-users', number: 'XX', label: 'Lorem Sit' },
      ],
    },

    mission: {
      badge: 'LOREM IPSUM',
      title: 'Lorem Ipsum Dolor Sit Amet Consectetur',
      text1:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      text2:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
      btnText: 'Lorem Ipsum Dolor',
      image: '',
      imageAlt: 'Lorem ipsum dolor sit amet',
    },

    programs: {
      badge: 'LOREM IPSUM',
      title: 'Lorem Ipsum Dolor Sit',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      items: [
        {
          title: 'Lorem Ipsum',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.',
          icon: 'luc-megaphone',
          color: 'magenta',
          link: 'Lorem ipsum →',
        },
        {
          title: 'Dolor Sit Amet',
          description:
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
          icon: 'luc-graduation-cap',
          color: 'coral',
          link: 'Lorem ipsum →',
        },
        {
          title: 'Consectetur Elit',
          description:
            'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.',
          icon: 'luc-users',
          color: 'rosa',
          link: 'Lorem ipsum →',
        },
        {
          title: 'Adipiscing Tempor',
          description:
            'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.',
          icon: 'luc-scale',
          color: 'oliva',
          link: 'Lorem ipsum →',
        },
      ],
    },

    testimonials: [
      {
        quote:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
        name: 'Lorem Ipsum',
        role: 'Lorem Dolor',
        initials: 'LI',
        image: '',
        imageAlt: 'Foto de Lorem Ipsum',
      },
      {
        quote:
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat.',
        name: 'Dolor Sit',
        role: 'Lorem Amet',
        initials: 'DS',
        image: '',
        imageAlt: 'Foto de Dolor Sit',
      },
      {
        quote:
          'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        name: 'Amet Consectetur',
        role: 'Lorem Elit',
        initials: 'AC',
        image: '',
        imageAlt: 'Foto de Amet Consectetur',
      },
    ],

    supporters: {
      badge: 'LOREM IPSUM',
      title: 'Lorem Ipsum Dolor Sit',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.',
      items: [
        {
          name: 'Lorem 1',
          icon: 'luc-building-2',
          color: 'magenta',
          image: '',
          imageAlt: '',
          url: '',
        },
        {
          name: 'Lorem 2',
          icon: 'luc-heart-handshake',
          color: 'coral',
          image: '',
          imageAlt: '',
          url: '',
        },
        { name: 'Lorem 3', icon: 'luc-globe', color: 'rosa', image: '', imageAlt: '', url: '' },
        { name: 'Lorem 4', icon: 'luc-star', color: 'oliva', image: '', imageAlt: '', url: '' },
        { name: 'Lorem 5', icon: 'luc-award', color: 'laranja', image: '', imageAlt: '', url: '' },
      ],
    },

    contact: {
      badge: 'LOREM IPSUM',
      title: 'Lorem Ipsum Dolor?',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.',
      methods: [
        {
          label: 'Lorem',
          value: 'lorem@ipsum.com',
          icon: 'luc-instagram',
          color: 'magenta',
          url: '',
        },
        {
          label: 'Dolor',
          value: 'Lorem Ipsum Dolor',
          icon: 'luc-user-check',
          color: 'coral',
          url: '',
        },
        { label: 'Amet', value: 'Lorem - IP', icon: 'luc-map-pin', color: 'rosa', url: '' },
      ],
      formSubjects: ['Lorem ipsum', 'Dolor sit', 'Amet consectetur', 'Adipiscing elit'],
    },

    cta: {
      title: 'Lorem Ipsum Dolor Sit',
      subtitle:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore!',
      btnDonate: 'Lorem Ipsum',
      btnProjects: 'Lorem Dolor',
    },
  },

  seo: {
    title: 'Lorem Ipsum - Dolor Sit Amet',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    keywords: ['lorem', 'ipsum', 'dolor'],
    ogImage: '',
    og: {
      type: 'website',
      siteName: 'Lorem Ipsum',
      locale: 'pt_BR',
    },
  },

  lastUpdated: '',
  updatedById: '',
  updatedByName: '',
};
