<script setup lang="ts">
/**
 * 🧩 About — Página pública "Quem Somos".
 *
 * Dados dinâmicos via useAboutPublicData (Firestore → cache → fallback).
 */

import { onMounted } from 'vue';
import { CBCard, CBIcon, CBImage, CBLabel } from '@cb/components';
import FrontBadge from '@components/front/FrontBadge.vue';
import FrontButton from '@components/front/FrontButton.vue';
import { resolveColorValue } from '@utils/colorResolver';

// ============== FIREBASE DATA ==============

const { hero, timeline, team, pillars, cta, seo } = useAboutPublicData();

// ============== SEO ==============

useSeoMeta({
  title: () => seo.value.title,
  description: () => seo.value.description,
  keywords: () => seo.value.keywords.join(', '),
  ogTitle: () => seo.value.title,
  ogDescription: () => seo.value.description,
  ogImage: () => seo.value.ogImage,
  ogType: () => seo.value.og.type as 'website',
  ogSiteName: () => seo.value.og.siteName,
  ogLocale: () => seo.value.og.locale,
});

// ============== SCROLL ANIMATIONS ==============

let scrollObserver: IntersectionObserver | null = null;

function observeAnimatedElements() {
  if (!scrollObserver) return;
  document.querySelectorAll('.animateOnScroll:not(.isVisible)').forEach((el) => {
    scrollObserver!.observe(el);
  });
}

onMounted(() => {
  scrollObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('isVisible');
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
  );
  observeAnimatedElements();
});
</script>

<template>
  <div class="pageWrapper">
    <!-- ════════ HERO ════════ -->
    <section class="heroSection">
      <div class="heroContainer animateOnScroll">
        <FrontBadge
          :content="hero.badge"
          theme-color="wine-mid"
          variant="outline"
          :icon-size="14"
          weight="bold"
          size="xs"
          class="sectionBadge"
        />

        <CBLabel :text="hero.title" tag="h1" weight="black" class="heroTitle" />

        <CBLabel
          :text="hero.description"
          size="lg"
          color="secondary"
          class="heroDescription"
        />
      </div>
    </section>

    <!-- ════════ TIMELINE ════════ -->
    <section class="timelineSection">
      <div class="sectionContainer">
        <div class="sectionHeader animateOnScroll">
          <FrontBadge
            :content="timeline.badge"
            theme-color="wine-mid"
            variant="outline"
            :icon-size="14"
            weight="bold"
            size="xs"
            class="sectionBadge"
          />
          <CBLabel
            :text="timeline.title"
            tag="h2"
            weight="black"
            class="sectionTitle"
          />
        </div>

        <div class="timelineTrack">
          <div class="timelineLine"></div>
          <div v-for="item in timeline.items" :key="item.year" class="timelineItem animateOnScroll">
            <div class="timelineIcon" :style="{ background: resolveColorValue(item.color) }">
              <CBIcon :icon="item.icon" size="1.25rem" color="var(--color-white)" />
            </div>
            <div class="timelineContent">
              <CBLabel :text="item.year" size="sm" weight="bold" class="timelineYear" />
              <CBLabel :text="item.title" tag="h3" weight="bold" class="timelineTitle" />
              <CBLabel :text="item.description" size="sm" color="secondary" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ PILLARS (Missao/Visao/Valores) ════════ -->
    <section class="pillarsSection">
      <div class="sectionContainer">
        <div class="sectionHeader animateOnScroll">
          <FrontBadge
            :content="pillars.badge"
            theme-color="wine-mid"
            variant="outline"
            :icon-size="14"
            weight="bold"
            size="xs"
            class="sectionBadge"
          />
          <CBLabel :text="pillars.title" tag="h2" weight="black" class="sectionTitle" />
        </div>

        <div class="pillarsGrid">
          <div v-for="pillar in pillars.items" :key="pillar.title" class="pillarCard animateOnScroll">
            <div class="pillarIcon" :style="{ background: resolveColorValue(pillar.color) }">
              <CBIcon :icon="pillar.icon" size="1.75rem" color="var(--color-white)" />
            </div>
            <CBLabel :text="pillar.title" tag="h3" weight="bold" class="pillarTitle" />
            <CBLabel :text="pillar.description" size="sm" color="secondary" class="pillarText" />
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ TEAM ════════ -->
    <section class="teamSection">
      <div class="sectionContainer">
        <div class="sectionHeader animateOnScroll">
          <FrontBadge
            :content="team.badge"
            theme-color="wine-mid"
            variant="outline"
            :icon-size="14"
            weight="bold"
            size="xs"
            class="sectionBadge"
          />
          <CBLabel
            :text="team.title"
            tag="h2"
            weight="black"
            class="sectionTitle"
          />
          <CBLabel
            :text="team.subtitle"
            size="md"
            color="secondary"
            class="sectionSubtitle"
          />
        </div>

        <div class="teamGrid">
          <CBCard
            v-for="member in team.items"
            :key="member.name"
            variant="outlined"
            :rounded="20"
            hover
            bg-color="var(--bg-white)"
            border-color="rgba(var(--color-wine-rgb), 0.06)"
            :border-width="1"
            class="teamCard animateOnScroll"
          >
            <div class="teamCardInner">
              <div v-if="member.image" class="teamAvatar">
                <CBImage
                  :src="member.image"
                  :alt="member.name"
                  size="auto"
                  :height="100"
                  :width="100"
                  fit="cover"
                  :rounded="50"
                />
              </div>
              <div v-else class="teamAvatarPlaceholder">
                <CBLabel :text="member.initials" size="xl" weight="black" />
              </div>

              <CBLabel :text="member.name" tag="h3" weight="bold" class="teamName" />
              <CBLabel :text="member.role" size="sm" weight="semibold" class="teamRole" />
              <CBLabel :text="member.bio" size="sm" color="secondary" class="teamBio" />
            </div>
          </CBCard>
        </div>
      </div>
    </section>

    <!-- ════════ CTA ════════ -->
    <section class="ctaSection">
      <div class="ctaDecorCircle"></div>
      <div class="ctaContainer animateOnScroll">
        <CBLabel
          :text="cta.title"
          tag="h2"
          weight="black"
          :color="'var(--color-white)'"
          class="ctaTitle"
        />
        <CBLabel
          :text="cta.subtitle"
          size="lg"
          :color="'var(--color-nude-warm)'"
          class="ctaSubtitle"
        />
        <div class="ctaActions">
          <FrontButton
            :label="cta.btnDonate"
            :theme-color="cta.btnDonateColor"
            :variant="cta.btnDonateVariant"
            size="lg"
            :rounded="50"
            prepend-icon="luc-heart"
            class="btnCtaWhite"
          />
          <FrontButton
            :label="cta.btnContact"
            :theme-color="cta.btnContactColor"
            :variant="cta.btnContactVariant"
            size="lg"
            :rounded="50"
            append-icon="luc-arrow-right"
            class="btnCtaOutline"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ============================================
   PAGE WRAPPER
   ============================================ */
.pageWrapper {
  min-height: 100vh;
  background: var(--bg-white);
  color: var(--text-primary);
  font-family: var(--font-body);
  overflow-x: hidden;
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
.animateOnScroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animateOnScroll.isVisible {
  opacity: 1;
  transform: translateY(0);
}

/* ============================================
   SHARED
   ============================================ */
.sectionBadge {
  letter-spacing: 1.5px;
  margin-bottom: 14px;
  pointer-events: none;
}

.sectionTitle {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}

.sectionSubtitle {
  max-width: 560px;
  line-height: 1.65;
}

.sectionContainer {
  max-width: 1200px;
  margin: 0 auto;
}

.sectionHeader {
  margin-bottom: 56px;
}

/* ============================================
   HERO
   ============================================ */
.heroSection {
  position: relative;
  padding: 160px 7% 80px;
  background: var(--bg-hero);
  text-align: center;
  overflow: hidden;
}

.heroSection::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(var(--color-wine-rgb), 0.04) 0%, transparent 70%);
  top: -150px;
  right: -100px;
  border-radius: 50%;
  pointer-events: none;
}

.heroContainer {
  max-width: 700px;
  margin: 0 auto;
}

.heroTitle {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 20px;
}

.heroDescription {
  line-height: 1.7;
  max-width: 560px;
  margin: 0 auto;
}

/* ============================================
   TIMELINE
   ============================================ */
.timelineSection {
  padding: 100px 7%;
  background: var(--bg-light);
}

.timelineTrack {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.timelineLine {
  position: absolute;
  left: 23px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(var(--color-wine-rgb), 0.1);
}

.timelineItem {
  position: relative;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding-left: 68px;
  padding-bottom: 40px;
}

.timelineItem:last-child {
  padding-bottom: 0;
}

.timelineIcon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.timelineContent {
  flex: 1;
}

.timelineYear {
  color: var(--color-magenta);
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.timelineTitle {
  font-family: var(--font-heading);
  font-size: 1.15rem;
  margin-bottom: 6px;
}

/* ============================================
   TEAM
   ============================================ */
.teamSection {
  padding: 100px 7%;
  background: var(--bg-white);
}

.teamGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.teamCardInner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 28px;
}

.teamAvatarPlaceholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  margin-bottom: 20px;
}

.teamAvatar {
  margin-bottom: 20px;
}

.teamName {
  font-family: var(--font-heading);
  font-size: 1.15rem;
  margin-bottom: 4px;
}

.teamRole {
  color: var(--color-magenta);
  margin-bottom: 12px;
}

.teamBio {
  line-height: 1.6;
}

/* ============================================
   PILLARS
   ============================================ */
.pillarsSection {
  padding: 100px 7%;
  background: var(--bg-light);
}

.pillarsGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.pillarCard {
  background: var(--bg-white);
  border-radius: var(--radius-card);
  padding: 40px 28px;
  text-align: center;
  border: 1px solid rgba(var(--color-wine-rgb), 0.06);
  transition: all var(--transition-smooth);
}

.pillarCard:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.pillarIcon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.pillarTitle {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  margin-bottom: 12px;
}

.pillarText {
  line-height: 1.65;
}

/* ============================================
   CTA
   ============================================ */
.ctaSection {
  position: relative;
  padding: 110px 7%;
  background: var(--gradient-cta);
  overflow: hidden;
  text-align: center;
}

.ctaDecorCircle {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  top: -200px;
  right: -200px;
  pointer-events: none;
}

.ctaContainer {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  z-index: 2;
}

.ctaTitle {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: 900;
  margin-bottom: 16px;
}

.ctaSubtitle {
  line-height: 1.65;
  margin-bottom: 36px;
}

.ctaActions {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

.btnCtaWhite {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.35s ease;
}

.btnCtaWhite:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.2);
}

.btnCtaOutline :deep(.cbButton__icon) {
  transition: transform 0.3s ease;
}

.btnCtaOutline:hover :deep(.cbButton__icon) {
  transform: translateX(4px);
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1024px) {
  .teamGrid,
  .pillarsGrid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .heroSection {
    padding: 120px 5% 60px;
  }

  .timelineSection,
  .teamSection,
  .pillarsSection {
    padding: 70px 5%;
  }

  .ctaSection {
    padding: 80px 5%;
  }

  .teamGrid,
  .pillarsGrid {
    grid-template-columns: 1fr;
  }

  .ctaActions {
    flex-direction: column;
    width: 100%;
  }

  .ctaActions :deep(.cbButton) {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .heroSection {
    padding: 100px 5% 50px;
  }

  .timelineSection,
  .teamSection,
  .pillarsSection {
    padding: 60px 5%;
  }

  .ctaSection {
    padding: 70px 5%;
  }

  .heroTitle {
    font-size: clamp(2rem, 8vw, 2.5rem);
  }
}
</style>
