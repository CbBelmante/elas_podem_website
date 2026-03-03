<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import {
  CBButton,
  CBCard,
  CBCarousel,
  CBIcon,
  CBImage,
  CBInput,
  CBLabel,
  CBMarquee,
  CBNavbar,
  CBSelect,
  CBTextarea,
  createGradient,
  createGlow,
  type INavbarMenuItem,
} from '@cb/components';
import { useI18n } from 'vue-i18n';
import FrontBadge from '@components/front/FrontBadge.vue';
import FrontButton from '@components/front/FrontButton.vue';
import { resolveColorValue } from '@utils/colorResolver';
import {
  HERO_DEFAULTS,
  MISSION_DEFAULTS,
  SUPPORTERS_SECTION_DEFAULTS,
} from '@definitions/sectionDefaults';

// ============== FIREBASE DATA ==============

const { hero, mission, programs, testimonials, supporters, contact, values, cta, seo, status } =
  useHomePublicData();

// CSS custom properties por cor (compoe createGradient + createGlow da CbColorUtils)
const colorVars = (color: string) => {
  const c = resolveColorValue(color);
  return {
    '--c-gradient': createGradient(c),
    '--c-glow': createGlow(c),
    '--c-glow-hover': createGlow(c, 24, 0.45),
  };
};

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

// ============== NAVBAR (i18n) ==============

const currentPath = ref('/');
const { t } = useI18n();

const menuItems = computed<INavbarMenuItem[]>(() => [
  { label: t('navbar.home'), to: '/' },
  { label: t('navbar.about'), to: '/sobre' },
  { label: t('navbar.projects'), to: '/projetos' },
  { label: t('navbar.blog'), to: '/blog' },
]);

const handleNavigate = ({ path }: { path: string }) => {
  currentPath.value = path;
};

const handleLogoClick = () => {
  currentPath.value = '/';
};

// ============== CONTACT FORM ==============

const formName = ref('');
const formEmail = ref('');
const formSubject = ref<string | undefined>(undefined);
const formMessage = ref('');

const subjectItems = computed(() =>
  contact.value.formSubjects.map((s) => ({ value: s, label: s }))
);

// ============== TESTIMONIALS CAROUSEL ==============

const testimonialIndex = ref(0);

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

// Re-observa elementos novos quando dados do Firestore carregam (v-for recria DOM nodes)
watch(status, async () => {
  await nextTick();
  observeAnimatedElements();
});
</script>

<template>
  <div>
    <ClientOnly>
      <LoadingOverlay :visible="status !== 'success'" />
    </ClientOnly>

    <!-- Navbar -->
    <CBNavbar
      :menu-items="menuItems"
      :current-path="currentPath"
      menu-style="underline"
      placement="fixed"
      :elevation="2"
      mobile-mode="popover"
      class="customNavbar"
      @navigate="handleNavigate"
      @logo-click="handleLogoClick"
    >
      <template #logo>
        <CBImage
          src="/logo-elas-podem.png"
          alt="Elas Podem"
          size="auto"
          :height="48"
          fit="contain"
          :eager="true"
          class="navbarLogo"
        />
      </template>
    </CBNavbar>

    <div class="pageWrapper">
      <!-- ════════ HERO ════════ -->
      <section
        class="heroSection"
        :style="{
          '--hero-image-opacity': (hero.heroImageOpacity ?? HERO_DEFAULTS.heroImageOpacity) / 100,
        }"
      >
        <CBImage
          :src="hero.heroImage || 'https://picsum.photos/1920/1080?random=1'"
          alt="Imagem de fundo do hero"
          size="auto"
          fit="cover"
          class="heroBgImage"
        />
        <div class="dotDecoration dot1"></div>
        <div class="dotDecoration dot2"></div>
        <div class="dotDecoration dot3"></div>
        <div class="dotDecoration dot4"></div>
        <div class="dotDecoration dot5"></div>
        <div class="dotDecoration dot6"></div>
        <div class="dotDecoration dot7"></div>

        <div class="heroContainer">
          <div class="heroContent animateOnScroll">
            <FrontBadge
              :content="hero.badge"
              theme-color="vinho-medio"
              variant="outline"
              :icon-size="14"
              weight="bold"
              size="xs"
              class="heroBadge"
            />

            <CBLabel :text="hero.title" tag="h1" weight="black" class="heroTitle animateOnScroll" />

            <CBLabel
              :text="hero.description"
              size="lg"
              color="secondary"
              class="heroDescription animateOnScroll"
            />

            <div class="heroActions animateOnScroll">
              <FrontButton
                :label="hero.btnDonate"
                :theme-color="hero.btnDonateColor"
                :variant="hero.btnDonateVariant"
                size="lg"
                :rounded="50"
                prepend-icon="luc-heart"
                shine
                glow
                class="btnHero"
              />

              <FrontButton
                :label="hero.btnHistory"
                :theme-color="hero.btnHistoryColor"
                :variant="hero.btnHistoryVariant"
                size="lg"
                :rounded="50"
                append-icon="luc-arrow-right"
                class="btnHeroSecondary"
              />
            </div>
          </div>

          <div class="heroVisual animateOnScroll">
            <div class="blobShape"></div>
          </div>
        </div>
      </section>

      <!-- ════════ STATS BAR ════════ -->
      <section class="statsBar">
        <div v-for="(stat, i) in hero.stats" :key="i" class="statItem">
          <CBLabel :text="stat.number" tag="span" weight="black" class="statNumber" />
          <CBLabel :text="stat.label" tag="span" size="xs" class="statLabel" />
        </div>
      </section>

      <!-- ════════ MISSION ════════ -->
      <section class="missionSection">
        <div class="missionContainer">
          <div class="missionContent animateOnScroll">
            <FrontBadge
              :content="mission.badge"
              theme-color="vinho-medio"
              variant="outline"
              :icon-size="14"
              weight="bold"
              size="xs"
              class="sectionBadge"
            />

            <CBLabel :text="mission.title" tag="h2" weight="black" class="sectionTitle" />

            <CBLabel
              v-for="(para, idx) in mission.paragraphs"
              :key="idx"
              :text="para"
              size="md"
              color="secondary"
              class="missionText"
            />

            <FrontButton
              :label="mission.btnText"
              :theme-color="mission.btnColor"
              :variant="mission.btnVariant"
              size="lg"
              :rounded="50"
              append-icon="luc-arrow-right"
              class="btnMission"
            />
          </div>

          <div class="missionVisual animateOnScroll">
            <div class="missionDot mDot1"></div>
            <div class="missionDot mDot2"></div>
            <div class="missionDot mDot3"></div>
            <CBImage
              :src="mission.image || 'https://picsum.photos/600/500?random=42'"
              :alt="mission.imageAlt"
              size="auto"
              fit="cover"
              :rounded="20"
              class="missionImage"
              :style="{ opacity: (mission.imageOpacity ?? MISSION_DEFAULTS.imageOpacity) / 100 }"
            />
          </div>
        </div>
      </section>

      <!-- ════════ PROGRAMS ════════ -->
      <section class="programsSection">
        <div class="programsContainer">
          <div class="programsHeader animateOnScroll">
            <FrontBadge
              :content="programs.badge"
              theme-color="vinho-medio"
              variant="outline"
              :icon-size="14"
              weight="bold"
              size="xs"
              class="sectionBadge"
            />

            <CBLabel :text="programs.title" tag="h2" weight="black" class="sectionTitle" />

            <CBLabel
              v-if="programs.subtitle"
              :text="programs.subtitle"
              size="md"
              color="secondary"
              class="programsSubtitle"
            />
          </div>

          <div class="programsGrid">
            <CBCard
              v-for="program in programs.items"
              :key="program.title"
              variant="outlined"
              :rounded="24"
              hover
              bg-color="var(--bg-white)"
              border-color="rgba(var(--color-vinho-rgb), 0.06)"
              :border-width="1"
              class="programCard animateOnScroll"
              :style="{ '--program-color': resolveColorValue(program.color) }"
            >
              <div class="programBody">
                <div class="programIconWrapper">
                  <CBIcon :icon="program.icon" size="1.5rem" />
                </div>
                <CBLabel
                  :text="program.title"
                  tag="h3"
                  size="lg"
                  weight="black"
                  class="programTitle"
                />
                <CBLabel
                  :text="program.description"
                  size="sm"
                  color="secondary"
                  class="programDescription"
                />
                <div v-if="program.tags?.length" class="programTags">
                  <FrontBadge
                    v-for="(tag, tagIdx) in program.tags"
                    :key="tagIdx"
                    :content="tag"
                    :theme-color="program.tagColor || program.color"
                    variant="solid"
                    size="xs"
                    weight="semibold"
                    :rounded="20"
                  />
                </div>
                <div class="programFooter">
                  <CBLabel
                    :text="program.link"
                    tag="span"
                    size="sm"
                    weight="bold"
                    dense
                    class="programCardLink"
                  />
                  <CBIcon
                    icon="luc-arrow-right"
                    size="1rem"
                    :color="resolveColorValue(program.color)"
                    class="programLinkIcon"
                  />
                </div>
              </div>
            </CBCard>
          </div>
        </div>
      </section>

      <!-- ════════ TESTIMONIALS ════════ -->
      <section class="testimonialSection">
        <div class="testimonialContainer animateOnScroll">
          <CBCarousel
            v-model="testimonialIndex"
            :total="testimonials.items.length"
            :autoplay="testimonials.autoplay"
            :autoplay-interval="testimonials.autoplayInterval"
            transition-type="horizontal"
            :show-navigation="false"
            pause-on-hover
            class="testimonialCarousel"
          >
            <template #slide="{ index }">
              <div class="testimonialCard">
                <div class="testimonialCardGlow"></div>
                <div class="testimonialQuoteIcon">&ldquo;</div>
                <blockquote class="testimonialQuote">
                  {{ testimonials.items[index].quote }}
                </blockquote>
                <div
                  v-if="testimonials.items[index].initials || testimonials.items[index].image || testimonials.items[index].name || testimonials.items[index].role"
                  class="testimonialAuthor"
                >
                  <CBImage
                    v-if="testimonials.items[index].image"
                    :src="testimonials.items[index].image"
                    :alt="testimonials.items[index].imageAlt || testimonials.items[index].name"
                    :width="60"
                    :height="60"
                    fit="cover"
                    :rounded="999"
                    class="testimonialAuthorPhoto"
                  />
                  <div v-else-if="testimonials.items[index].initials" class="testimonialAuthorAvatar">
                    {{ testimonials.items[index].initials }}
                  </div>
                  <div
                    v-if="testimonials.items[index].name || testimonials.items[index].role"
                    class="testimonialAuthorInfo"
                  >
                    <CBLabel
                      v-if="testimonials.items[index].name"
                      :text="testimonials.items[index].name"
                      tag="span"
                      weight="semibold"
                      dense
                      class="testimonialAuthorName"
                    />
                    <CBLabel
                      v-if="testimonials.items[index].role"
                      :text="testimonials.items[index].role"
                      tag="span"
                      size="sm"
                      color="secondary"
                      dense
                      class="testimonialAuthorRole"
                    />
                  </div>
                </div>
              </div>
            </template>
          </CBCarousel>
        </div>
      </section>

      <!-- ════════ SUPPORTERS ════════ -->
      <section class="supportersSection">
        <div class="supportersContainer">
          <div class="supportersHeader animateOnScroll">
            <FrontBadge
              :content="supporters.badge"
              theme-color="vinho-medio"
              variant="outline"
              :icon-size="14"
              weight="bold"
              size="xs"
              class="sectionBadge"
            />

            <CBLabel :text="supporters.title" tag="h2" weight="black" class="sectionTitle" />

            <CBLabel
              v-if="supporters.subtitle"
              :text="supporters.subtitle"
              size="md"
              color="secondary"
              class="supportersSubtitle"
            />
          </div>

          <CBMarquee
            :gap="0"
            :speed="supporters.marqueeSpeed ?? SUPPORTERS_SECTION_DEFAULTS.marqueeSpeed"
            slow-on-hover
            :slow-on-hover-rate="0.2"
            :fade-size="100"
            class="supportersMarquee animateOnScroll"
          >
            <template v-for="supporter in supporters.items" :key="supporter.name">
              <a
                :href="supporter.url || undefined"
                :target="supporter.url ? '_blank' : undefined"
                :rel="supporter.url ? 'noopener noreferrer' : undefined"
                class="supporterItem"
              >
                <CBImage
                  v-if="supporter.image"
                  :src="supporter.image"
                  :alt="supporter.imageAlt || supporter.name"
                  size="auto"
                  :height="32"
                  fit="contain"
                  class="supporterLogo"
                />
                <CBLabel
                  v-else
                  :text="supporter.name"
                  size="lg"
                  weight="bold"
                  class="supporterName"
                />
              </a>
              <span class="supporterDivider">·</span>
            </template>
          </CBMarquee>
        </div>
      </section>

      <!-- ════════ VALUES STRIP ════════ -->
      <section class="valuesStrip">
        <div
          v-for="value in values"
          :key="value.title"
          class="valueItem"
          :style="{ background: resolveColorValue(value.color) }"
        >
          <CBLabel :text="value.title" tag="h3" weight="black" class="valueTitle" />
          <CBLabel :text="value.subtitle" tag="p" size="sm" class="valueSubtitle" />
        </div>
      </section>

      <!-- ════════ CONTACT ════════ -->
      <section class="contactSection">
        <div class="contactContainer">
          <div class="contactInfo animateOnScroll">
            <FrontBadge
              :content="contact.badge"
              theme-color="vinho-medio"
              variant="outline"
              :icon-size="14"
              weight="bold"
              size="xs"
              class="sectionBadge"
            />

            <CBLabel :text="contact.title" tag="h2" weight="black" class="sectionTitle" />

            <CBLabel
              :text="contact.description"
              size="md"
              color="secondary"
              class="contactDescription"
            />

            <div class="contactMethods">
              <CBCard
                v-for="method in contact.methods"
                :key="method.label"
                variant="outlined"
                :rounded="16"
                hover
                bg-color="var(--bg-white)"
                border-color="rgba(var(--color-vinho-rgb), 0.04)"
                class="contactMethodCard"
              >
                <div class="contactMethodInner">
                  <div class="contactMethodIconWrapper" :style="colorVars(method.color)">
                    <CBIcon :icon="method.icon" size="1.5rem" color="var(--bg-white)" />
                  </div>
                  <div class="contactMethodContent">
                    <CBLabel
                      :text="method.label"
                      tag="span"
                      size="xs"
                      color="tertiary"
                      weight="bold"
                      dense
                      class="contactMethodLabel"
                    />
                    <CBLabel
                      :text="method.value"
                      tag="span"
                      size="md"
                      weight="semibold"
                      dense
                      class="contactMethodValue"
                    />
                  </div>
                  <CBIcon
                    icon="luc-arrow-up-right"
                    size="1.25rem"
                    color="var(--text-tertiary)"
                    class="contactMethodArrow"
                  />
                </div>
              </CBCard>
            </div>
          </div>

          <div class="contactFormWrapper animateOnScroll">
            <CBCard
              variant="outlined"
              :rounded="24"
              bg-color="var(--bg-white)"
              border-color="var(--border-light)"
              class="contactFormCard"
            >
              <form class="contactForm">
                <CBInput
                  v-model="formName"
                  name="contact-name"
                  :label="$t('contact.form.name.label')"
                  :placeholder="$t('contact.form.name.placeholder')"
                  :rounded="12"
                  prepend-icon="luc-user"
                  required
                />

                <CBInput
                  v-model="formEmail"
                  name="contact-email"
                  type="email"
                  :label="$t('contact.form.email.label')"
                  :placeholder="$t('contact.form.email.placeholder')"
                  :rounded="12"
                  prepend-icon="luc-mail"
                  required
                />

                <CBSelect
                  v-model="formSubject"
                  name="contact-subject"
                  :items="subjectItems"
                  :label="$t('contact.form.subject.label')"
                  :placeholder="$t('contact.form.subject.placeholder')"
                  :rounded="12"
                />

                <CBTextarea
                  v-model="formMessage"
                  name="contact-message"
                  :label="$t('contact.form.message.label')"
                  :placeholder="$t('contact.form.message.placeholder')"
                  :rows="5"
                  :rounded="12"
                  required
                />

                <CBButton
                  :label="$t('contact.form.btnSubmit')"
                  type="submit"
                  size="lg"
                  :bg-gradient="'var(--gradient-primary)'"
                  :rounded="50"
                  append-icon="luc-arrow-right"
                  shine
                  block
                  class="btnFormSubmit"
                />
              </form>
            </CBCard>
          </div>
        </div>
      </section>

      <!-- ════════ CTA ════════ -->
      <section class="ctaSection">
        <div class="ctaDecorCircle"></div>
        <div class="ctaContainer animateOnScroll">
          <CBLabel :text="cta.title" tag="h2" weight="black" class="ctaTitle" />
          <CBLabel :text="cta.subtitle" size="lg" class="ctaSubtitle" />
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
              :label="cta.btnProjects"
              :theme-color="cta.btnProjectsColor"
              :variant="cta.btnProjectsVariant"
              size="lg"
              :rounded="50"
              append-icon="luc-arrow-right"
              class="btnCtaOutline"
            />
          </div>
        </div>
      </section>
    </div>
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
   KEYFRAMES
   ============================================ */
@keyframes blobMorph {
  0%,
  100% {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  }
  25% {
    border-radius: 58% 42% 60% 40% / 45% 55% 45% 55%;
  }
  50% {
    border-radius: 50% 50% 33% 67% / 55% 40% 60% 45%;
  }
  75% {
    border-radius: 40% 60% 55% 45% / 60% 35% 65% 40%;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-12px);
  }
}

@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ============================================
   NAVBAR
   ============================================ */
.customNavbar :deep(.cbNavbar) {
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.customNavbar :deep(.cbNavbar__logoSection) {
  margin-left: 80px;
}

.customNavbar :deep(.cbNavbar__menuContainer) {
  justify-content: center;
}

.navbarLogo {
  height: 48px;
  width: auto;
  cursor: pointer;
  transition: transform 0.35s ease;
}

.navbarLogo:hover {
  transform: scale(1.05);
}

/* ============================================
   SHARED: SECTION BADGE
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
  color: var(--text-primary);
  margin-bottom: 1rem;
}

/* ============================================
   HERO — 2 COLUNAS + BLOB
   ============================================ */
.heroSection {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 140px 7% 80px;
  overflow: hidden;
  background: var(--bg-hero);
}

.heroSection .heroBgImage {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: var(--hero-image-opacity, 1);
  z-index: 0;
  pointer-events: none;
}

.heroSection::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(var(--color-vinho-rgb), 0.03) 0%, transparent 70%);
  top: -150px;
  left: -150px;
  border-radius: 50%;
}

.heroContainer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  gap: 4rem;
}

.heroContent {
  max-width: 560px;
  position: relative;
  z-index: 2;
  animation: slideRight 0.8s ease-out;
}

/* Dots decorativos flutuantes */
.dotDecoration {
  position: absolute;
  border-radius: 50%;
  animation: float 4s ease-in-out infinite;
  z-index: 1;
}

.dot1 {
  width: 12px;
  height: 12px;
  background: var(--color-coral-claro);
  top: 90px;
  right: 16%;
}

.dot2 {
  width: 8px;
  height: 8px;
  background: var(--color-vinho-medio);
  bottom: 120px;
  left: 46%;
  animation-delay: 1s;
}

.dot3 {
  width: 16px;
  height: 16px;
  background: var(--color-nude-quente);
  top: 42%;
  right: 9%;
  animation-delay: 2s;
}

.dot4 {
  width: 40px;
  height: 40px;
  background: var(--color-magenta);
  opacity: 0.1;
  top: 15%;
  left: 8%;
  animation-delay: 0.5s;
}

.dot5 {
  width: 10px;
  height: 10px;
  background: var(--color-vinho);
  bottom: 25%;
  left: 52%;
  opacity: 0.6;
  animation-delay: 3.5s;
}

.dot6 {
  width: 24px;
  height: 24px;
  background: var(--color-coral);
  opacity: 0.2;
  bottom: 15%;
  left: 5%;
  animation-delay: 1.2s;
}

.dot7 {
  width: 14px;
  height: 14px;
  background: var(--color-roxo-acento);
  top: 22%;
  right: 25%;
  opacity: 0.4;
  animation-delay: 2.8s;
}

/* Hero badge */
.heroBadge {
  letter-spacing: 1.5px;
  margin-bottom: 24px;
}

/* Titulo */
.heroTitle {
  font-family: var(--font-heading);
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  font-weight: 900;
  line-height: 1.12;
  letter-spacing: -0.02em;
  margin-bottom: 22px;
  color: var(--text-primary);
}

.heroDescription {
  line-height: 1.75;
  margin-bottom: 36px;
  max-width: 480px;
}

.heroActions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

/* Blob visual */
.heroVisual {
  position: relative;
  z-index: 2;
  animation: slideRight 1s ease-out 0.3s both;
}

.blobShape {
  width: 400px;
  height: 400px;
  background: linear-gradient(
    135deg,
    var(--color-vinho) 0%,
    var(--color-magenta) 40%,
    var(--color-coral) 75%,
    var(--color-coral-claro) 100%
  );
  animation: blobMorph 8s ease-in-out infinite;
  box-shadow: 22px 22px 0px var(--color-nude-quente);
}

/* ============================================
   STATS BAR — FAIXA ESCURA
   ============================================ */
.statsBar {
  display: flex;
  background: var(--gradient-stats-bar);
}

.statItem {
  flex: 1;
  text-align: center;
  padding: 44px 30px;
  border-right: 1px solid rgba(var(--color-magenta-rgb), 0.12);
  transition: background 0.35s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.statItem:last-child {
  border-right: none;
}

.statItem:hover {
  background: rgba(var(--color-magenta-rgb), 0.08);
}

.statNumber {
  font-family: var(--font-heading);
  font-size: 2.8rem;
  font-weight: 900;
  color: var(--color-coral-claro);
  line-height: 1;
}

.statLabel {
  font-size: 0.75rem;
  color: rgba(247, 159, 193, 0.5);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 500;
}

/* ============================================
   MISSION — QUOTE CARD
   ============================================ */
.missionSection {
  padding: 100px 7%;
  background: var(--bg-light);
  position: relative;
}

.missionContainer {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 70px;
  align-items: center;
}

.missionText {
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.btnMission {
  margin-top: 0.5rem;
}

/* Imagem da missao */
.missionVisual {
  position: relative;
}

.missionImage {
  box-shadow: var(--shadow-soft);
  position: relative;
  z-index: 2;
}

/* Dots decorativos na Missão */
.missionDot {
  position: absolute;
  border-radius: 50%;
  animation: float 5s ease-in-out infinite;
  z-index: 1;
}

.mDot1 {
  width: 20px;
  height: 20px;
  background: var(--color-coral);
  top: -10px;
  left: -10px;
  opacity: 0.6;
}

.mDot2 {
  width: 14px;
  height: 14px;
  background: var(--color-vinho-medio);
  bottom: 20px;
  right: -7px;
  animation-delay: 1.5s;
}

.mDot3 {
  width: 32px;
  height: 32px;
  background: var(--color-nude-quente);
  bottom: -15px;
  left: 40px;
  opacity: 0.4;
  animation-delay: 3s;
}

/* ============================================
   PROGRAMS — TOP-BORDER HOVER
   ============================================ */
.programsSection {
  padding: 100px 7%;
  background: var(--bg-white);
}

.programsContainer {
  max-width: 1100px;
  margin: 0 auto;
}

.programsHeader {
  text-align: center;
  margin-bottom: 52px;
}

.programsSubtitle {
  max-width: 600px;
  margin: 12px auto 0;
  line-height: 1.6;
}

.programsGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

/* Item ímpar sozinho na última linha → centraliza */
.programsGrid > :last-child:nth-child(odd) {
  grid-column: 1 / -1;
  max-width: calc(50% - 16px);
  justify-self: center;
}

.programCard {
  position: relative;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  /* Background e Border definidos via Props do CBCard */
}

.programCard:hover {
  transform: translateY(-5px);
  border-color: rgba(var(--color-vinho-rgb), 0.15);
  box-shadow: 0 15px 35px rgba(var(--color-vinho-rgb), 0.08);
}

/* Blob Orgânico de Fundo - Variação Padrão (1, 5, 9...) */
.programCard::before {
  content: '';
  position: absolute;
  top: -60px;
  right: -60px;
  width: 240px;
  height: 240px;
  background: var(--program-color);
  opacity: 0.06;
  border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%;
  transition: all 0.7s ease-in-out;
  z-index: 0;
  pointer-events: none;
}

/* Variação 2 (Pares: 2, 4, 6...) - Blob no Canto Inferior Esquerdo */
.programCard:nth-child(2n)::before {
  border-radius: 58% 42% 38% 62% / 50% 50% 50% 50%;
  top: auto;
  right: auto;
  bottom: -70px;
  left: -70px;
}

/* Variação 3 (3, 6, 9...) - Blob no Canto Superior Esquerdo e Forma Diferente */
.programCard:nth-child(3n)::before {
  border-radius: 30% 70% 50% 50% / 30% 30% 70% 70%;
  top: -50px;
  left: -50px;
  right: auto;
}

/* Variação 4 (4, 8, 12...) - Blob no Canto Inferior Direito e Forma mais Esticada */
.programCard:nth-child(4n)::before {
  border-radius: 70% 30% 30% 70% / 60% 40% 60% 40%;
  top: auto;
  left: auto;
  bottom: -60px;
  right: -60px;
}

.programCard:hover::before {
  transform: scale(1.35) rotate(10deg);
  opacity: 0.12;
}

.programBody {
  position: relative;
  z-index: 1; /* Conteúdo acima do blob */
  padding: 42px 36px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.programIconWrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  margin-bottom: 22px;
  background: color-mix(in srgb, var(--program-color) 8%, transparent);
  color: var(--program-color);
  border: 1px solid color-mix(in srgb, var(--program-color) 18%, transparent);
  transition: all 0.4s ease;
}

.programCard:hover .programIconWrapper {
  background: var(--program-color);
  border-color: var(--program-color);
  color: white;
  transform: scale(1.1);
}

.programTitle {
  margin-bottom: 12px;
  font-family: var(--font-heading); /* Garante a fonte do título */
  color: var(--text-primary);
  font-size: 1.5rem; /* Um pouco maior */
  letter-spacing: -0.02em;
}

.programDescription {
  line-height: 1.75;
  margin-bottom: 1.125rem;
  color: var(--text-secondary);
  flex-grow: 1;
}

.programTags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 1.25rem;
}

/* Tags sao labels estaticos — neutraliza hover do CBBadge */
.programTags .cbBadge {
  pointer-events: none;
}

.programFooter {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  transition: gap 0.3s ease;
}

.programCard:hover .programFooter {
  gap: 12px;
}

.programCardLink {
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--program-color);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  position: relative;
}

/* Linha decorativa no link */
.programCardLink::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0%;
  height: 2px;
  background: var(--program-color);
  transition: width 0.3s ease;
  opacity: 0.4;
}

.programCard:hover .programCardLink::after {
  width: 100%;
}

.programLinkIcon {
  transition: transform 0.3s ease;
  opacity: 0.7;
}

.programCard:hover .programLinkIcon {
  transform: translateX(3px);
  opacity: 1;
}

/* ============================================
   TESTIMONIALS
   ============================================ */
.testimonialSection {
  padding: 100px 7%;
  background: var(--bg-light);
}

.testimonialContainer {
  max-width: 900px;
  margin: 0 auto;
}

.testimonialCarousel {
  background: transparent;
  padding-bottom: 2.5rem;
}

.testimonialCarousel :deep(.cbCarousel__indicators) {
  bottom: 4px;
}

.testimonialCard {
  position: relative;
  padding: 4rem 3rem 2rem;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--bg-white);
  border: 1px solid rgba(var(--color-vinho-rgb), 0.06);
  border-radius: 32px;
  overflow: hidden;
}

.testimonialCardGlow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at top center,
    rgba(var(--color-magenta-rgb), 0.12) 0%,
    transparent 70%
  );
  opacity: 0.5;
  pointer-events: none;
}

.testimonialQuoteIcon {
  position: absolute;
  top: 1.5rem;
  left: 2rem;
  font-family: var(--font-heading);
  font-size: 8rem;
  font-weight: 900;
  color: rgba(var(--color-magenta-rgb), 0.1);
  line-height: 1;
  pointer-events: none;
  user-select: none;
}

.testimonialQuote {
  font-family: var(--font-heading);
  position: relative;
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  font-weight: 500;
  font-style: italic;
  line-height: 1.5;
  color: var(--color-vinho);
  margin: 0 0 2rem 0;
  padding-top: 0.5rem;
}

.testimonialAuthor {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.testimonialAuthorPhoto {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.testimonialAuthorAvatar {
  width: 60px;
  height: 60px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--bg-white);
  flex-shrink: 0;
}

.testimonialAuthorName {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.testimonialAuthorRole {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* ============================================
   SUPPORTERS
   ============================================ */
.supportersSection {
  padding: 100px 7%;
  background: var(--bg-white);
}

.supportersContainer {
  max-width: 1100px;
  margin: 0 auto;
}

.supportersHeader {
  text-align: center;
  margin-bottom: 4rem;
}

.supportersSubtitle {
  line-height: 1.6;
  margin-top: 1rem;
}

.supportersMarquee {
  margin-top: 1rem;
}

.supporterItem {
  display: inline-flex;
  align-items: center;
  padding: 0 1.5rem;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.supporterItem:hover {
  opacity: 0.6;
}

.supporterLogo {
  filter: grayscale(100%);
  opacity: 0.5;
  transition: all 0.3s ease;
}

.supporterItem:hover .supporterLogo {
  filter: grayscale(0%);
  opacity: 1;
}

.supporterName {
  color: var(--color-carvao);
  opacity: 0.35;
  white-space: nowrap;
  font-family: var(--font-heading);
  letter-spacing: -0.5px;
  transition: opacity 0.3s ease;
}

.supporterItem:hover .supporterName {
  opacity: 0.7;
}

.supporterDivider {
  color: var(--color-carvao);
  opacity: 0.15;
  font-size: 2rem;
  line-height: 1;
  user-select: none;
}

/* ============================================
   VALUES STRIP
   ============================================ */
.valuesStrip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.valueItem {
  padding: 50px 30px;
  text-align: center;
  transition: filter 0.35s ease;
  position: relative;
  overflow: hidden;
}

.valueItem::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 1px;
}

.valueItem:hover {
  filter: brightness(1.15);
}

.valueTitle {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: white;
  margin-bottom: 8px;
}

.valueSubtitle {
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  max-width: 200px;
  margin: 0 auto;
}

/* ============================================
   CONTACT
   ============================================ */
.contactSection {
  padding: 100px 7%;
  background: var(--bg-light);
}

.contactContainer {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 5rem;
  align-items: start;
}

.contactDescription {
  line-height: 1.6;
  margin-bottom: 3rem;
}

.contactMethods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contactMethodCard {
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: none; /* Remove sombra pesada inicial */
  /* Background e Border definidos via Props do CBCard */
}

.contactMethodCard:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--color-vinho-rgb), 0.15);
  box-shadow: 0 12px 24px rgba(var(--color-vinho-rgb), 0.06); /* Sombra leve apenas no hover */
}

.contactMethodInner {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.contactMethodIconWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  flex-shrink: 0;
  transition: all 0.35s ease;
  background: var(--c-gradient);
  box-shadow: var(--c-glow);
}

.contactMethodCard:hover .contactMethodIconWrapper {
  transform: scale(1.08);
  filter: brightness(1.1);
  box-shadow: var(--c-glow-hover);
}

.contactMethodContent {
  flex: 1;
  min-width: 0;
}

.contactMethodLabel {
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.25rem;
  display: block;
}

.contactMethodValue {
  display: block;
}

.contactMethodArrow {
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.3s ease;
}

.contactMethodCard:hover .contactMethodArrow {
  opacity: 1;
  transform: translateX(0);
}

/* Form */
.contactForm {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Arrow icon hover effect on buttons */
.btnHeroSecondary :deep(.cbButton__icon),
.btnMission :deep(.cbButton__icon),
.btnCtaOutline :deep(.cbButton__icon),
.btnFormSubmit :deep(.cbButton__icon) {
  transition: transform 0.3s ease;
}

.btnHeroSecondary:hover :deep(.cbButton__icon),
.btnMission:hover :deep(.cbButton__icon),
.btnCtaOutline:hover :deep(.cbButton__icon),
.btnFormSubmit:hover :deep(.cbButton__icon) {
  transform: translateX(4px);
}

/* ============================================
   CTA — GRADIENT ESCURO
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
  color: white;
  margin-bottom: 16px;
}

.ctaSubtitle {
  color: rgba(255, 255, 255, 0.75);
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

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1024px) {
  .heroContainer {
    gap: 2rem;
  }

  .blobShape {
    width: 320px;
    height: 320px;
  }

  .missionContainer,
  .contactContainer {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .valuesStrip {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .customNavbar :deep(.cbNavbar__logoSection) {
    margin-left: 1rem;
  }

  .navbarLogo {
    height: 40px;
  }

  .heroSection {
    padding: 120px 7% 60px;
  }

  .heroContainer {
    flex-direction: column;
    text-align: center;
    gap: 40px;
  }

  .heroContent {
    max-width: 100%;
  }

  .heroDescription {
    max-width: 100%;
  }

  .heroActions {
    justify-content: center;
  }

  .blobShape {
    width: 260px;
    height: 260px;
  }

  .statsBar {
    flex-wrap: wrap;
  }

  .statItem {
    flex: 1 1 50%;
  }

  .programsGrid {
    grid-template-columns: 1fr;
  }

  .programsGrid > :last-child:nth-child(odd) {
    max-width: 100%;
  }

  .valuesStrip {
    grid-template-columns: 1fr;
  }

  .heroActions,
  .ctaActions {
    flex-direction: column;
    width: 100%;
  }

  .heroActions :deep(.cbButton),
  .ctaActions :deep(.cbButton),
  .btnMission {
    width: 100%;
  }

  .missionSection,
  .programsSection,
  .supportersSection,
  .contactSection {
    padding: 70px 5%;
  }

  .ctaSection {
    padding: 80px 5%;
  }

  .programBody {
    padding: 32px 24px;
  }

  .contactFormCard {
    padding: 28px 20px;
    box-shadow: 0 20px 40px -10px rgba(var(--color-vinho-rgb), 0.06);
  }

  .testimonialSection {
    padding: 60px 5%;
  }

  .testimonialCard {
    padding: 3rem 2rem 1.5rem;
    min-height: auto;
  }

  .testimonialQuoteIcon {
    font-size: 5rem;
    top: 1rem;
    left: 1.5rem;
  }

  .testimonialAuthorPhoto,
  .testimonialAuthorAvatar {
    width: 48px;
    height: 48px;
    font-size: 1.2rem;
  }

  .testimonialAuthorName {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .heroSection {
    padding: 100px 5% 50px;
  }

  .blobShape {
    width: 200px;
    height: 200px;
    box-shadow: 14px 14px 0px var(--color-nude-quente);
  }

  .statItem {
    padding: 30px 16px;
  }

  .statNumber {
    font-size: 2rem;
  }

  .missionSection,
  .programsSection,
  .supportersSection,
  .contactSection {
    padding: 60px 5%;
  }

  .ctaSection {
    padding: 70px 5%;
  }

  .programBody {
    padding: 28px 20px;
  }

  .programIconWrapper {
    width: 44px;
    height: 44px;
    margin-bottom: 16px;
  }

  .programTitle {
    font-size: 1.25rem;
  }

  .contactFormCard {
    padding: 20px 14px;
  }

  .contactDescription {
    margin-bottom: 2rem;
  }

  .valueItem {
    padding: 36px 20px;
  }

  .valueTitle {
    font-size: 1.25rem;
  }

  .testimonialCard {
    padding: 2.5rem 1.25rem 1.25rem;
    border-radius: 20px;
  }

  .testimonialQuoteIcon {
    font-size: 4rem;
    top: 0.5rem;
    left: 1rem;
  }

  .testimonialQuote {
    margin-bottom: 1.5rem;
  }

  .testimonialAuthorPhoto,
  .testimonialAuthorAvatar {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .testimonialAuthor {
    gap: 0.75rem;
  }
}

@media (max-width: 360px) {
  .statItem {
    flex: 1 1 100%;
  }
}
</style>
