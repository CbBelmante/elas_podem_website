<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  CBBadge,
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
import '@cb/components/style.css';
import '../assets/css/theme.css';

// ============== FIREBASE DATA ==============

const { hero, mission, programs, testimonials, supporters, contact, cta, seo } =
  useHomePublicData();

// Cores ciclicas para hero stats (IHeroStat nao tem campo color)
const STAT_COLORS = ['magenta', 'coral', 'rosa', 'oliva', 'laranja'] as const;

// Resolve nome do tema para CSS variable (passthrough se ja for hex/rgb/hsl/var)
const toVar = (color: string) =>
  color.startsWith('#') ||
  color.startsWith('rgb') ||
  color.startsWith('hsl') ||
  color.startsWith('var(')
    ? color
    : `var(--color-${color})`;

// CSS custom properties por cor (compoe createGradient + createGlow da CbColorUtils)
const colorVars = (color: string) => {
  const c = toVar(color);
  return {
    '--c-gradient': createGradient(c),
    '--c-glow': createGlow(c),
    '--c-glow-hover': createGlow(c, 24, 0.45),
  };
};

// ============== SEO ==============

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Lato:wght@400;700&display=swap',
    },
  ],
});

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

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('isVisible');
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
  );

  document.querySelectorAll('.animateOnScroll').forEach((el) => {
    observer.observe(el);
  });
});
</script>

<template>
  <div>
    <!-- Navbar fora do pageWrapper para position:fixed funcionar com viewport -->
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
      <!-- Hero Section - REDESENHADO -->
      <section class="heroSection">
        <div class="heroContent">
          <!-- Badge superior -->
          <CBBadge
            :content="hero.badge"
            variant="outline"
            icon="luc-sparkles"
            :icon-size="14"
            weight="bold"
            size="xs"
            class="heroBadge animateOnScroll"
          />

          <CBLabel :text="hero.title" tag="h1" weight="black" class="heroTitle animateOnScroll" />

          <CBLabel
            :text="hero.subtitle"
            size="lg"
            color="secondary"
            class="heroSubtitle animateOnScroll"
          />

          <div class="heroActions animateOnScroll">
            <CBButton
              :label="hero.btnDonate"
              size="lg"
              :bg-gradient="'var(--gradient-primary)'"
              :rounded="14"
              prepend-icon="luc-heart"
              shine
              glow
              class="btnHero"
            />

            <CBButton
              :label="hero.btnHistory"
              size="lg"
              variant="outline"
              :color="'var(--cb-secondary)'"
              :rounded="14"
              append-icon="luc-arrow-right"
              class="btnHeroSecondary"
            />
          </div>

          <div class="heroStats animateOnScroll">
            <CBCard
              v-for="(stat, i) in hero.stats"
              :key="i"
              variant="outlined"
              :rounded="20"
              hover
              bg-color="var(--glass-bg)"
              border-color="var(--glass-border)"
              :border-width="1"
              class="heroStatCard"
            >
              <div class="heroStatInner">
                <div
                  class="heroStatIconWrapper"
                  :style="colorVars(STAT_COLORS[i % STAT_COLORS.length])"
                >
                  <CBIcon :icon="stat.icon" size="1.75rem" color="#ffffff" />
                </div>
                <CBLabel
                  :text="stat.number"
                  tag="span"
                  weight="extrabold"
                  dense
                  class="heroStatNumber"
                />
                <CBLabel
                  :text="stat.label"
                  tag="span"
                  size="sm"
                  weight="medium"
                  dense
                  class="heroStatLabel"
                />
              </div>
            </CBCard>
          </div>
        </div>
      </section>

      <!-- Mission Section - MODERNIZADA -->
      <section class="missionSection">
        <div class="missionContainer">
          <div class="missionContent animateOnScroll">
            <CBBadge
              :content="mission.badge"
              variant="outline"
              icon="luc-target"
              :icon-size="14"
              weight="bold"
              size="xs"
              class="sectionBadge"
            />

            <CBLabel :text="mission.title" tag="h2" weight="bold" class="sectionTitle" />

            <CBLabel :text="mission.text1" size="md" color="secondary" class="missionText" />

            <CBLabel :text="mission.text2" size="md" color="secondary" class="missionText" />

            <CBButton
              :label="mission.btnText"
              size="lg"
              :bg-gradient="'var(--gradient-primary)'"
              :rounded="12"
              append-icon="luc-arrow-right"
              class="btnMission"
            />
          </div>

          <div class="missionVisual animateOnScroll">
            <div class="missionImageCard">
              <!-- SVG Placeholder -->
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="missionImageSvg"
              >
                <path
                  d="M263.5 400C166.5 373.5 48.5 322 0 206C88 153.5 142.5 15.5 263.5 0.5C384.5 15.5 427 122 400 206C373 290 360.5 426.5 263.5 400Z"
                  fill="url(#paint0_linear_101_2)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_101_2"
                    x1="0"
                    y1="0"
                    x2="400"
                    y2="400"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#E6346B" stop-opacity="0.3" />
                    <stop offset="1" stop-color="#D42D5E" stop-opacity="0.1" />
                  </linearGradient>
                </defs>
              </svg>
              <div class="missionImageContent">
                <CBIcon
                  icon="luc-sparkles"
                  size="3rem"
                  color="var(--cb-primary)"
                  class="missionImageIcon"
                />
                <CBLabel
                  :text="mission.imageAlt"
                  tag="span"
                  weight="semibold"
                  dense
                  class="missionImageText"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Programs Section - CARDS PREMIUM -->
      <section class="programsSection">
        <div class="programsContainer">
          <div class="programsHeader animateOnScroll">
            <CBBadge
              :content="programs.badge"
              variant="outline"
              icon="luc-lightbulb"
              :icon-size="14"
              weight="bold"
              size="xs"
              class="sectionBadge"
            />

            <CBLabel :text="programs.title" tag="h2" weight="bold" class="sectionTitle" />

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
              :rounded="20"
              hover
              border-color="var(--border-light)"
              class="programCard animateOnScroll"
            >
              <div class="programIconWrapper" :style="colorVars(program.color)">
                <CBIcon :icon="program.icon" size="2rem" color="#ffffff" />
              </div>
              <CBLabel
                :text="program.title"
                tag="h3"
                size="lg"
                weight="bold"
                class="programTitle"
              />
              <CBLabel
                :text="program.description"
                size="sm"
                color="secondary"
                class="programDescription"
              />
              <div class="programCardFooter">
                <CBLabel
                  :text="program.link"
                  tag="span"
                  size="sm"
                  weight="semibold"
                  dense
                  class="programCardLink"
                />
              </div>
            </CBCard>
          </div>
        </div>
      </section>

      <!-- Testimonial Section - CAROUSEL -->
      <section class="testimonialSection">
        <div class="testimonialContainer animateOnScroll">
          <CBCarousel
            v-model="testimonialIndex"
            :total="testimonials.length"
            autoplay
            :autoplay-interval="6000"
            transition-type="horizontal"
            :show-navigation="false"
            pause-on-hover
            class="testimonialCarousel"
          >
            <template #slide="{ index }">
              <div class="testimonialCard">
                <div class="testimonialCardGlow"></div>
                <div class="testimonialQuoteIcon">"</div>
                <blockquote class="testimonialQuote">
                  {{ testimonials[index].quote }}
                </blockquote>
                <div class="testimonialAuthor">
                  <div class="testimonialAuthorAvatar">
                    {{ testimonials[index].initials }}
                  </div>
                  <div class="testimonialAuthorInfo">
                    <CBLabel
                      :text="testimonials[index].name"
                      tag="span"
                      weight="semibold"
                      dense
                      class="testimonialAuthorName"
                    />
                    <CBLabel
                      :text="testimonials[index].role"
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

      <!-- Supporters Section - MODERNA -->
      <section class="supportersSection">
        <div class="supportersContainer">
          <div class="supportersHeader animateOnScroll">
            <CBBadge
              :content="supporters.badge"
              variant="outline"
              icon="luc-handshake"
              :icon-size="14"
              weight="bold"
              size="xs"
              class="sectionBadge"
            />

            <CBLabel :text="supporters.title" tag="h2" weight="bold" class="sectionTitle" />

            <CBLabel
              v-if="supporters.subtitle"
              :text="supporters.subtitle"
              size="md"
              color="secondary"
              class="supportersSubtitle"
            />
          </div>

          <CBMarquee
            :gap="24"
            :speed="40"
            slow-on-hover
            :slow-on-hover-rate="0.3"
            :fade-size="60"
            class="supportersMarquee animateOnScroll"
          >
            <CBCard
              v-for="supporter in supporters.items"
              :key="supporter.name"
              variant="outlined"
              :rounded="16"
              hover
              bg-color="var(--bg-white)"
              border-color="var(--border-light)"
              :border-width="1"
              class="supporterCard"
            >
              <div class="supporterCardInner">
                <div class="supporterIconWrapper" :style="colorVars(supporter.color)">
                  <CBIcon :icon="supporter.icon" size="1.5rem" color="#ffffff" />
                </div>
                <CBLabel :text="supporter.name" size="md" weight="semibold" class="supporterName" />
              </div>
            </CBCard>
          </CBMarquee>
        </div>
      </section>

      <!-- Contact Section - REDESENHADA -->
      <section class="contactSection">
        <div class="contactContainer">
          <div class="contactInfo animateOnScroll">
            <CBBadge
              :content="contact.badge"
              variant="outline"
              icon="luc-mail"
              :icon-size="14"
              weight="bold"
              size="xs"
              class="sectionBadge"
            />

            <CBLabel :text="contact.title" tag="h2" weight="bold" class="sectionTitle" />

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
                border-color="var(--border-light)"
                :border-width="1"
                class="contactMethodCard"
              >
                <div class="contactMethodInner">
                  <div class="contactMethodIconWrapper" :style="colorVars(method.color)">
                    <CBIcon :icon="method.icon" size="1.5rem" color="#ffffff" />
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
            <CBCard variant="elevated" :rounded="24" class="contactFormCard">
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
                  :rounded="12"
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

      <!-- CTA Final - IMPACTANTE -->
      <section class="ctaSection">
        <div class="ctaGradientBg"></div>
        <div class="ctaContainer animateOnScroll">
          <div class="ctaContent">
            <CBLabel :text="cta.title" tag="h2" weight="extrabold" class="ctaTitle" />
            <CBLabel :text="cta.subtitle" size="lg" color="secondary" class="ctaSubtitle" />
            <div class="ctaActions">
              <CBButton
                :label="cta.btnDonate"
                size="lg"
                :bg-gradient="'var(--gradient-primary)'"
                :rounded="14"
                prepend-icon="luc-heart"
                shine
                glow
                pulse
                class="btnCtaPrimary"
              />

              <CBButton
                :label="cta.btnProjects"
                size="lg"
                variant="outline"
                :color="'var(--cb-secondary)'"
                :rounded="14"
                append-icon="luc-arrow-right"
                class="btnCtaSecondary"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ============================================
   COMPONENTE PRINCIPAL
   ============================================ */
.pageWrapper {
  min-height: 100vh;
  background: var(--bg-white);
  color: var(--text-primary);
  font-family: var(--font-body);
  overflow-x: hidden;
}

.hideOnMobile {
  display: inline;
}

@media (max-width: 768px) {
  .hideOnMobile {
    display: none;
  }
}

/* ============================================
   ANIMAÇÕES DE SCROLL
   ============================================ */
.animateOnScroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.animateOnScroll.isVisible {
  opacity: 1;
  transform: translateY(0);
}

/* ============================================
   NAVBAR CUSTOMIZAÇÃO
   ============================================ */
.customNavbar :deep(.cbNavbar) {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
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
  transition: transform 0.3s ease;
}

.navbarLogo:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .customNavbar :deep(.cbNavbar__logoSection) {
    margin-left: 1rem;
  }

  .navbarLogo {
    height: 40px;
  }
}

/* ============================================
   HERO SECTION - REDESENHADO
   ============================================ */
.heroSection {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rem 2rem 6rem;
  overflow: hidden;
  background: var(--bg-hero);
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* Conteúdo do Hero */
.heroContent {
  position: relative;
  z-index: 2;
  max-width: 900px;
  text-align: center;
}

/* Badge superior */
.heroBadge {
  margin-bottom: 2rem;
  letter-spacing: 2px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.heroBadge:hover {
  transform: translateY(-2px);
}

/* Título com gradiente animado */
.heroTitle {
  font-family: var(--font-heading);
  font-size: clamp(3.5rem, 10vw, 7rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  text-transform: uppercase;
}

/* Subtítulo */
.heroSubtitle {
  line-height: 1.7;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

/* Botões do Hero */
.heroActions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
}

/* Estatísticas com glassmorphism */
.heroStats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.heroStatCard {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.heroStatCard:hover {
  transform: translateY(-5px);
}

.heroStatInner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Icon wrappers com gradiente (cor via buildColorStyles) */
.heroStatIconWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  margin-bottom: 1.25rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--c-gradient);
  box-shadow: var(--c-glow);
}

.heroStatCard:hover .heroStatIconWrapper {
  transform: scale(1.1) rotate(5deg);
  filter: brightness(1.1);
  box-shadow: var(--c-glow-hover);
}

.heroStatNumber {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 800;
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.heroStatLabel {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ============================================
   COMPONENTES REUTILIZÁVEIS
   ============================================ */
.sectionBadge {
  margin-bottom: 1.5rem;
  letter-spacing: 2px;
}

.sectionTitle {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

/* ============================================
   MISSION SECTION
   ============================================ */
.missionSection {
  padding: 3rem 2rem;
  background: var(--bg-light);
  position: relative;
}

.missionContainer {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.missionText {
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.missionVisual {
  position: relative;
}

.missionImageCard {
  position: relative;
  height: 500px;
  background: linear-gradient(
    135deg,
    rgba(var(--color-magenta-rgb), 0.2) 0%,
    rgba(var(--color-coral-claro-rgb), 0.1) 50%,
    rgba(var(--color-rosa-rgb), 0.2) 100%
  );
  border: 1px solid var(--border-light);
  border-radius: 24px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* CSS para o placeholder SVG da imagem */
.missionImageCard .missionImageOverlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 0%, rgba(10, 10, 10, 0.5) 100%);
}

.missionImageCard .missionImageSvg {
  position: absolute;
  inset: -50%; /* Faz o SVG preencher e vazar para criar o efeito desejado */
  width: 200%;
  height: 200%;
  object-fit: cover;
  animation: float 30s ease-in-out infinite reverse; /* Reutilizando animação existente */
}

.missionImageCard .missionImageContent {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1); /* Suave sobreposição */
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.missionImageCard .missionImageIcon {
  font-size: 3rem;
}
.missionImageCard .missionImageText {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 600;
}

/* ============================================
   PROGRAMS SECTION
   ============================================ */
.programsSection {
  padding: 3rem 2rem;
  background: var(--bg-white);
}

.programsContainer {
  max-width: 1100px;
  margin: 0 auto;
}

.programsHeader {
  text-align: center;
  margin-bottom: 4rem;
}

.programsGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.programCard {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.programCard:hover {
  transform: translateY(-8px);
}

.programIconWrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  margin-bottom: 1.25rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: var(--c-gradient);
  box-shadow: var(--c-glow);
}

.programCard:hover .programIconWrapper {
  transform: scale(1.1) rotate(5deg);
  filter: brightness(1.1);
  box-shadow: var(--c-glow-hover);
}

.programTitle {
  margin-bottom: 0.75rem;
}

.programDescription {
  line-height: 1.5;
  margin-bottom: 1rem;
}

.programCardFooter {
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
}

.programCardLink {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--cb-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.programCardLink:hover {
  color: var(--cb-secondary);
}

/* ============================================
   TESTIMONIAL SECTION
   ============================================ */
.testimonialSection {
  padding: 3rem 2rem;
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
  border: 1px solid var(--border-light);
  border-radius: 32px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.testimonialCardGlow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at top center,
    rgba(var(--color-magenta-rgb), 0.15) 0%,
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
  font-size: 7rem;
  font-weight: 900;
  color: rgba(var(--color-magenta-rgb), 0.08);
  line-height: 1;
  pointer-events: none;
  user-select: none;
}

.testimonialQuote {
  font-family: var(--font-heading);
  position: relative;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-style: italic;
  line-height: 1.6;
  color: var(--text-primary);
  margin: 0 0 2rem 0;
  padding-top: 0.5rem;
}

.testimonialAuthor {
  display: flex;
  align-items: center;
  gap: 1rem;
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
   SUPPORTERS SECTION
   ============================================ */
.supportersSection {
  padding: 3rem 2rem;
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

.supporterCard {
  width: 180px;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
}

.supporterCard:hover {
  transform: translateY(-3px);
}

.supporterCardInner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.5rem 0;
}

/* Icon wrappers com gradiente (cor via buildColorStyles) */
.supporterIconWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--c-gradient);
  box-shadow: var(--c-glow);
}

.supporterCard:hover .supporterIconWrapper {
  transform: scale(1.08);
  filter: brightness(1.1);
  box-shadow: var(--c-glow-hover);
}

.supporterName {
  color: var(--text-primary);
}

/* ============================================
   CONTACT SECTION
   ============================================ */
.contactSection {
  padding: 3rem 2rem;
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
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
}

.contactMethodCard:hover {
  transform: translateY(-3px);
}

.contactMethodInner {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

/* Icon wrappers com gradiente (cor via buildColorStyles) */
.contactMethodIconWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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

/* Formulário */
.contactForm {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Efeito de mover seta para frente no hover */
.btnHeroSecondary :deep(.cbButton__icon),
.btnMission :deep(.cbButton__icon),
.btnCtaSecondary :deep(.cbButton__icon),
.btnFormSubmit :deep(.cbButton__icon) {
  transition: transform 0.3s ease;
}

.btnHeroSecondary:hover :deep(.cbButton__icon),
.btnMission:hover :deep(.cbButton__icon),
.btnCtaSecondary:hover :deep(.cbButton__icon),
.btnFormSubmit:hover :deep(.cbButton__icon) {
  transform: translateX(4px);
}

/* ============================================
   CTA SECTION
   ============================================ */
.ctaSection {
  position: relative;
  padding: 3rem 2rem;
  background: var(--bg-white);
  overflow: hidden;
}

.ctaGradientBg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(var(--color-magenta-rgb), 0.15) 0%,
    rgba(var(--color-coral-claro-rgb), 0.1) 50%,
    rgba(var(--color-rosa-rgb), 0.15) 100%
  );
}

.ctaContainer {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
}

.ctaContent {
  text-align: center;
  padding: 4rem 3rem;
  background: linear-gradient(135deg, var(--bg-tint) 0%, var(--cb-primary-10) 100%);
  border: 1px solid var(--badge-border);
  border-radius: 32px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--shadow-md);
}

.ctaTitle {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.ctaSubtitle {
  line-height: 1.6;
  margin-bottom: 3rem;
}

.ctaActions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1024px) {
  .missionContainer,
  .contactContainer {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .programsGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .heroSection {
    padding: 6rem 1.5rem 3rem;
  }

  .heroTitle {
    font-size: clamp(2.5rem, 10vw, 4rem);
  }

  .heroStats {
    grid-template-columns: 1fr;
  }

  .programsGrid {
    grid-template-columns: 1fr;
  }

  .ctaContent {
    padding: 3rem 2rem;
  }

  .contactFormCard {
    padding: 2rem;
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
}
</style>
