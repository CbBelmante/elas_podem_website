/**
 * 🔧 About Fallbacks - Dados reais da página About
 *
 * Usado como valor inicial e fallback quando Firebase não responde.
 * Estrutura espelha IAboutPageData (formato Firestore).
 */

import type { IAboutPageData } from '@appTypes/admin';

// ============== FALLBACK ==============

export const ABOUT_FALLBACK: IAboutPageData = {
  content: {
    hero: {
      badge: 'CONHEÇA NOSSA HISTÓRIA',
      title: 'Quem Somos',
      description:
        'Desde 2020, o Coletivo Elas Podem atua em Campo Grande, MS — um movimento feminista de mulheres cis e trans unidas pela equidade de gênero e ampliação da participação feminina em espaços públicos e privados.',
    },

    timeline: {
      badge: 'NOSSA TRAJETÓRIA',
      title: 'Uma História de Luta e Conquistas',
      items: [
        {
          year: '2020',
          title: 'Fundação do Coletivo',
          description:
            'Nasce o Elas Podem em Campo Grande, MS — um movimento feminista de mulheres cis e trans unidas pela equidade de gênero e ampliação da participação feminina em espaços públicos e privados.',
          icon: 'luc-heart',
          color: 'magenta',
        },
        {
          year: '2023',
          title: 'Advocacy e Incidência Política',
          description:
            'Mobilização contra o fechamento do Centro de Parto Natural Magdela Targa do Nascimento em Sidrolândia. Participação na campanha nacional "Nenhuma Ministra a Menos" e no acordo para construção da Casa da Mulher Brasileira em Corumbá e Dourados.',
          icon: 'luc-megaphone',
          color: 'coral',
        },
        {
          year: '2024',
          title: '4ª Conferência Nacional de Cultura',
          description:
            'Presença do coletivo na 4ª Conferência Nacional de Cultura em Brasília, ampliando a voz em discussões sobre políticas culturais e gênero.',
          icon: 'luc-globe',
          color: 'wine-rose',
        },
        {
          year: '2025',
          title: 'Assembleia Geral e Nova Diretoria',
          description:
            'Assembleia Geral Extraordinária em julho define nova diretoria com gestão democrática, reafirmando a missão e fortalecendo os núcleos educacional e de comunicação.',
          icon: 'luc-users',
          color: 'olive',
        },
        {
          year: '2025',
          title: 'Reconhecimento Público',
          description:
            'Moção de Aplausos aprovada na 5ª Conferência Estadual de Políticas Públicas para Mulheres. Presidente Ladielly Souza recebida pela Ministra Márcia Lopes na 5ª Conferência Nacional.',
          icon: 'luc-award',
          color: 'purple-accent',
        },
        {
          year: '2025',
          title: 'Sede Própria',
          description:
            'Conquista da sede própria em Campo Grande — espaço destinado à organização interna, reuniões e desenvolvimento de projetos colaborativos.',
          icon: 'luc-building-2',
          color: 'wine',
        },
      ],
    },

    team: {
      badge: 'NOSSA EQUIPE',
      title: 'Mulheres que Fazem Acontecer',
      subtitle:
        'Conheça a diretoria eleita em julho de 2025, que lidera o coletivo com gestão democrática e compromisso com a equidade.',
      items: [
        {
          name: 'Ladielly de Souza Silva',
          role: 'Presidente',
          bio: 'Psicóloga e ativista, lidera o coletivo na defesa da participação feminina em espaços de decisão. Representou o Elas Podem na 5ª Conferência Nacional junto à Ministra das Mulheres.',
          image: '',
          imageAlt: 'Foto de Ladielly de Souza Silva',
          initials: 'LS',
        },
        {
          name: 'Paola Silvestrini',
          role: 'Vice-presidente',
          bio: 'Arquiteta, atua no fortalecimento da representatividade e na gestão democrática do coletivo.',
          image: '',
          imageAlt: 'Foto de Paola Silvestrini',
          initials: 'PS',
        },
        {
          name: 'Tassiany Pereira',
          role: 'Secretária',
          bio: 'Cientista social, participa das rodas de conversa e ações formativas sobre direito à cidade e violência de gênero.',
          image: '',
          imageAlt: 'Foto de Tassiany Pereira',
          initials: 'TP',
        },
        {
          name: 'Karla Waleska de Melo',
          role: 'Tesoureira',
          bio: 'Cientista social, palestrante sobre violência política contra as mulheres e responsável pela gestão financeira do coletivo.',
          image: '',
          imageAlt: 'Foto de Karla Waleska de Melo',
          initials: 'KM',
        },
        {
          name: 'Aimê Martins',
          role: 'Coordenação de Projetos',
          bio: 'Administradora, coordena as iniciativas e parcerias do coletivo com movimentos sociais e instituições locais.',
          image: '',
          imageAlt: 'Foto de Aimê Martins',
          initials: 'AM',
        },
      ],
    },

    pillars: {
      badge: 'O QUE NOS MOVE',
      title: 'Missão, Visão e Valores',
      items: [
        {
          icon: 'luc-heart-handshake',
          title: 'Nossa Missão',
          description:
            'Promover o debate sobre os papéis sociais de gênero e ampliar a participação das mulheres (cis e trans) em espaços públicos e privados, fortalecendo a representatividade feminina e os direitos humanos em todo o país.',
          color: 'coral',
        },
        {
          icon: 'luc-eye',
          title: 'Nossa Visão',
          description:
            'Uma sociedade mais justa, plural e democrática, onde todas as mulheres ocupam espaços de decisão e têm sua dignidade respeitada.',
          color: 'purple-accent',
        },
        {
          icon: 'luc-scale',
          title: 'Nossos Valores',
          description:
            'Equidade, Liberdade, Sororidade e Respeito à Dignidade Humana.',
          color: 'orange',
        },
      ],
    },

    cta: {
      title: 'Faça Parte Dessa História',
      subtitle:
        'Junte-se a nós e ajude a fortalecer a participação feminina em espaços de decisão.',
      btnDonate: 'Doe Agora',
      btnDonateColor: 'gradient:primary',
      btnDonateVariant: 'solid',
      btnContact: 'Entre em Contato',
      btnContactColor: '#FFFFFF',
      btnContactVariant: 'outline',
    },
  },

  seo: {
    title: 'Sobre — Elas Podem',
    description:
      'Conheça a história, a equipe e a missão do Coletivo Elas Podem. Desde 2020 promovendo equidade de gênero e participação feminina em Campo Grande, MS.',
    keywords: ['elas podem', 'sobre', 'quem somos', 'equidade de gênero', 'mulheres', 'campo grande'],
    ogImage: '',
    og: {
      type: 'website',
      siteName: 'Elas Podem',
      locale: 'pt_BR',
    },
  },

  lastUpdated: '',
  updatedById: '',
  updatedByName: '',
};
