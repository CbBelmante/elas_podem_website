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
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      btnDonate: 'Lorem Ipsum',
      btnDonateColor: 'gradient:primary',
      btnDonateVariant: 'solid',
      btnHistory: 'Lorem Dolor',
      btnHistoryColor: 'wine-mid',
      btnHistoryVariant: 'outline',
      heroImage: 'https://picsum.photos/1920/1080?random=1',
      heroImageOpacity: 100,
      logo: '',
      logoAlt: '',
      logoSize: 200,
      stats: [
        { icon: 'luc-award', number: '000', label: 'Lorem Ipsum' },
        { icon: 'luc-megaphone', number: '0a', label: 'Lorem Dolor' },
        { icon: 'luc-users', number: 'XX', label: 'Lorem Sit' },
      ],
    },

    mission: {
      badge: 'LOREM IPSUM',
      title: 'Lorem Ipsum Dolor Sit Amet Consectetur',
      paragraphs: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
      ],
      btnText: 'Lorem Ipsum Dolor',
      btnColor: 'gradient:primary',
      btnVariant: 'solid',
      image: '',
      imageOpacity: 100,
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
          tags: ['Lorem tag', 'Ipsum dolor'],
          tagColor: 'magenta',
        },
        {
          title: 'Dolor Sit Amet',
          description:
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
          icon: 'luc-graduation-cap',
          color: 'coral',
          link: 'Lorem ipsum →',
          tags: ['Dolor sit', 'Amet consectetur'],
          tagColor: 'coral',
        },
        {
          title: 'Consectetur Elit',
          description:
            'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.',
          icon: 'luc-users',
          color: 'wine-rose',
          link: 'Lorem ipsum →',
          tags: ['Consectetur', 'Adipiscing elit'],
          tagColor: 'wine-rose',
        },
        {
          title: 'Adipiscing Tempor',
          description:
            'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.',
          icon: 'luc-scale',
          color: 'olive',
          link: 'Lorem ipsum →',
          tags: ['Tempor incididunt'],
          tagColor: 'olive',
        },
      ],
    },

    testimonials: {
      autoplay: true,
      autoplayInterval: 6000,
      items: [
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
    },

    supporters: {
      badge: 'LOREM IPSUM',
      title: 'Lorem Ipsum Dolor Sit',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.',
      marqueeSpeed: 18,
      items: [
        {
          name: 'Lorem 1',
          icon: 'luc-building-2',
          image: '',
          imageAlt: '',
          url: '',
          logoSize: 48,
        },
        {
          name: 'Lorem 2',
          icon: 'luc-heart-handshake',
          image: '',
          imageAlt: '',
          url: '',
          logoSize: 48,
        },
        { name: 'Lorem 3', icon: 'luc-globe', image: '', imageAlt: '', url: '', logoSize: 48 },
        { name: 'Lorem 4', icon: 'luc-star', image: '', imageAlt: '', url: '', logoSize: 48 },
        { name: 'Lorem 5', icon: 'luc-award', image: '', imageAlt: '', url: '', logoSize: 48 },
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
        { label: 'Amet', value: 'Lorem - IP', icon: 'luc-map-pin', color: 'wine-rose', url: '' },
      ],
      formSubjects: ['Lorem ipsum', 'Dolor sit', 'Amet consectetur', 'Adipiscing elit'],
    },

    values: [
      { title: 'Lorem Ipsum', subtitle: 'Lorem ipsum dolor sit amet consectetur', color: 'wine' },
      {
        title: 'Dolor Sit',
        subtitle: 'Ut enim ad minim veniam quis nostrud',
        color: 'magenta',
      },
      {
        title: 'Amet Elit',
        subtitle: 'Duis aute irure dolor in reprehenderit',
        color: 'wine-mid',
      },
      {
        title: 'Consectetur',
        subtitle: 'Excepteur sint occaecat cupidatat non',
        color: 'purple-night',
      },
    ],

    cta: {
      title: 'Lorem Ipsum Dolor Sit',
      subtitle:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore!',
      btnDonate: 'Lorem Ipsum',
      btnDonateColor: 'gradient:primary',
      btnDonateVariant: 'solid',
      btnProjects: 'Lorem Dolor',
      btnProjectsColor: '#FFFFFF',
      btnProjectsVariant: 'outline',
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
