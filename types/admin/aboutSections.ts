/**
 * About Section Data Types - Elas Podem Admin
 *
 * Camada 1: Interfaces que espelham o formato exato dos dados no Firestore.
 * Hierarquia: pages/about → { content: { hero, timeline, team, pillars, cta }, seo, lastUpdated, updatedBy }
 */

import type { ButtonVariant, ISeo } from './homeSections';

// ============================================================
// HERO
// ============================================================

export interface IAboutHeroSection {
  badge: string;
  title: string;
  description: string;
}

// ============================================================
// TIMELINE
// ============================================================

export interface IAboutTimelineItem {
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface IAboutTimelineSection {
  badge: string;
  title: string;
  items: IAboutTimelineItem[];
}

// ============================================================
// TEAM
// ============================================================

export interface IAboutTeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  imageAlt: string;
  initials: string;
}

export interface IAboutTeamSection {
  badge: string;
  title: string;
  subtitle: string;
  items: IAboutTeamMember[];
}

// ============================================================
// PILLARS (Missao/Visao/Valores)
// ============================================================

export interface IAboutPillar {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface IAboutPillarsSection {
  badge: string;
  title: string;
  items: IAboutPillar[];
}

// ============================================================
// CTA
// ============================================================

export interface IAboutCtaSection {
  title: string;
  subtitle: string;
  btnDonate: string;
  btnDonateColor: string;
  btnDonateVariant: ButtonVariant;
  btnContact: string;
  btnContactColor: string;
  btnContactVariant: ButtonVariant;
}

// ============================================================
// PAGINA COMPLETA — Documento Firestore (pages/about)
// ============================================================

export interface IAboutPageData {
  content: {
    hero: IAboutHeroSection;
    timeline: IAboutTimelineSection;
    team: IAboutTeamSection;
    pillars: IAboutPillarsSection;
    cta: IAboutCtaSection;
  };
  seo: ISeo;
  lastUpdated: string;
  updatedById: string;
  updatedByName: string;
}
