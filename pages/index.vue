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

const { hero, mission, programs, testimonials, supporters, contact, values, cta, seo, status } =
  useHomePublicData();

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

// Top-border gradient para program cards (baseado na cor do Firestore)
const topBorderGradient = (color: string) => {
  const colorMap: Record<string, string> = {
    magenta: 'linear-gradient(90deg, var(--color-magenta), var(--color-coral))',
    coral: 'linear-gradient(90deg, var(--color-coral), var(--color-laranja))',
    rosa: 'linear-gradient(90deg, var(--color-rosa), var(--color-magenta))',
    oliva: 'linear-gradient(90deg, var(--color-oliva), var(--color-verde-claro))',
    laranja: 'linear-gradient(90deg, var(--color-laranja), var(--color-coral-claro))',
    vinho: 'linear-gradient(90deg, var(--color-vinho), var(--color-vinho-medio))',
    'vinho-medio': 'linear-gradient(90deg, var(--color-vinho-medio), var(--color-rosa))',
    'roxo-noite': 'linear-gradient(90deg, var(--color-roxo-acento), var(--color-roxo-noite))',
    'roxo-acento': 'linear-gradient(90deg, var(--color-roxo-acento), var(--color-roxo-noite))',
  };
  return colorMap[color] || 'linear-gradient(90deg, var(--color-magenta), var(--color-coral))';
};

// ============== SEO ==============

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,800;9..144,900&family=DM+Sans:wght@300;400;500;600;700&display=swap',
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
    <LoadingOverlay :visible="status !== 'success'" />

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
      <section class="heroSection">
        <CBImage
          :src="hero.heroImage || 'https://picsum.photos/1920/1080?random=1'"
          alt="Imagem de fundo do hero"
          size="100%"
          fit="cover"
          class="heroBgImage"
        />
        <div class="dotDecoration dot1"></div>
        <div class="dotDecoration dot2"></div>
        <div class="dotDecoration dot3"></div>

        <div class="heroContainer">
          <div class="heroContent animateOnScroll">
            <CBBadge
              :content="hero.badge"
              variant="outline"
              :icon-size="14"
              weight="bold"
              size="xs"
              bg-color="rgba(92, 26, 42, 0.06)"
              text-color="var(--color-vinho-medio)"
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
              <CBButton
                :label="hero.btnDonate"
                size="lg"
                :bg-gradient="'var(--gradient-primary)'"
                :rounded="50"
                prepend-icon="luc-heart"
                shine
                glow
                class="btnHero"
              />

              <CBButton
                :label="hero.btnHistory"
                size="lg"
                variant="outline"
                :color="'var(--color-vinho-medio)'"
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
            <CBBadge
              :content="mission.badge"
              variant="outline"
              :icon-size="14"
              weight="bold"
              size="xs"
              bg-color="rgba(92, 26, 42, 0.06)"
              text-color="var(--color-vinho-medio)"
              class="sectionBadge"
            />

            <CBLabel :text="mission.title" tag="h2" weight="black" class="sectionTitle" />

            <CBLabel :text="mission.text1" size="md" color="secondary" class="missionText" />

            <CBButton
              :label="mission.btnText"
              size="lg"
              :bg-gradient="'var(--gradient-primary)'"
              :rounded="50"
              append-icon="luc-arrow-right"
              class="btnMission"
            />
          </div>

          <div class="missionVisual animateOnScroll">
            <CBImage
              :src="mission.image || 'https://picsum.photos/600/500?random=42'"
              :alt="mission.imageAlt"
              size="100%"
              fit="cover"
              :rounded="20"
              class="missionImage"
            />
          </div>
        </div>
      </section>

      <!-- ════════ PROGRAMS ════════ -->
      <section class="programsSection">
        <div class="programsContainer">
          <div class="programsHeader animateOnScroll">
            <CBBadge
              :content="programs.badge"
              variant="outline"
              :icon-size="14"
              weight="bold"
              size="xs"
              bg-color="rgba(92, 26, 42, 0.06)"
              text-color="var(--color-vinho-medio)"
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
            <div
              v-for="program in programs.items"
              :key="program.title"
              class="programCard animateOnScroll"
              :style="{ '--program-color': toVar(program.color) }"
            >
              <div class="programAccent"></div>
              <div class="programBody">
                <div class="programIconWrapper">
                  <CBIcon :icon="program.icon" size="1.25rem" :color="toVar(program.color)" />
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
                <CBLabel
                  :text="program.link"
                  tag="span"
                  size="sm"
                  weight="semibold"
                  dense
                  class="programCardLink"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ════════ TESTIMONIALS ════════ -->
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
                <div class="testimonialQuoteIcon">&ldquo;</div>
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

      <!-- ════════ SUPPORTERS ════════ -->
      <section class="supportersSection">
        <div class="supportersContainer">
          <div class="supportersHeader animateOnScroll">
            <CBBadge
              :content="supporters.badge"
              variant="outline"
              :icon-size="14"
              weight="bold"
              size="xs"
              bg-color="rgba(92, 26, 42, 0.06)"
              text-color="var(--color-vinho-medio)"
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
            :speed="18"
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
          :style="{ background: toVar(value.color) }"
        >
          <CBLabel :text="value.title" tag="h3" weight="black" class="valueTitle" />
          <CBLabel :text="value.subtitle" tag="p" size="sm" class="valueSubtitle" />
        </div>
      </section>

      <!-- ════════ CONTACT ════════ -->
      <section class="contactSection">
        <div class="contactContainer">
          <div class="contactInfo animateOnScroll">
            <CBBadge
              :content="contact.badge"
              variant="outline"
              :icon-size="14"
              weight="bold"
              size="xs"
              bg-color="rgba(92, 26, 42, 0.06)"
              text-color="var(--color-vinho-medio)"
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
                border-color="rgba(92, 26, 42, 0.04)"
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
            <CBButton
              :label="cta.btnDonate"
              size="lg"
              bg-color="var(--color-branco)"
              text-color="var(--color-vinho)"
              :rounded="50"
              prepend-icon="luc-heart"
              class="btnCtaWhite"
            />

            <CBButton
              :label="cta.btnProjects"
              size="lg"
              variant="outline"
              :color="'rgba(255,255,255,0.8)'"
              :rounded="50"
              append-icon="luc-arrow-right"
              class="btnCtaOutline"
            />
          </div>
        </div>
      </section>

      <!-- ════════ FOOTER ════════ -->
      <footer class="siteFooter">
        <div class="footerContainer">
          <div class="footerContent">
            <div class="footerBrand">
              <CBImage
                src="/logo-elas-podem.png"
                alt="Elas Podem"
                size="auto"
                :height="40"
                fit="contain"
                class="footerLogo"
              />
              <CBLabel
                text="Movimento feminista de Campo Grande - MS. Equidade, liberdade, sororidade e respeito a dignidade humana desde 2020."
                tag="p"
                size="sm"
                class="footerBrandText"
              />
            </div>

            <div class="footerLinks">
              <div class="footerColumn">
                <h4>Eixos</h4>
                <ul>
                  <li><a href="#">Comunicacao</a></li>
                  <li><a href="#">Educacao</a></li>
                  <li><a href="#">Acao Social</a></li>
                  <li><a href="#">Participacao Politica</a></li>
                </ul>
              </div>

              <div class="footerColumn">
                <h4>Valores</h4>
                <ul>
                  <li><a href="#">Equidade</a></li>
                  <li><a href="#">Liberdade</a></li>
                  <li><a href="#">Sororidade</a></li>
                  <li><a href="#">Dignidade</a></li>
                </ul>
              </div>

              <div class="footerColumn">
                <h4>Contato</h4>
                <ul>
                  <li><a href="#">Campo Grande - MS</a></li>
                  <li>
                    <a href="https://instagram.com/coletivoelaspodem" target="_blank" rel="noopener">
                      @coletivoelaspodem
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="footerBottom">
            <span class="footerCopyright">&copy; 2025 Coletivo Elas Podem. Todos os direitos reservados.</span>
            <div class="footerSocial">
              <a
                href="https://instagram.com/coletivoelaspodem"
                target="_blank"
                rel="noopener"
                class="footerSocialLink"
              >
                <CBIcon icon="luc-instagram" size="1.25rem" color="rgba(255,255,255,0.35)" />
              </a>
            </div>
          </div>
        </div>
      </footer>
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

.heroBgImage {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  opacity: 0.07;
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
.missionImage {
  box-shadow: var(--shadow-soft);
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
  margin-bottom: 50px;
}

.programsGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.programCard {
  display: flex;
  background: var(--bg-white);
  border: 1px solid rgba(var(--color-vinho-rgb), 0.06);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s ease;
}

.programCard:hover {
  border-color: rgba(var(--color-vinho-rgb), 0.12);
  box-shadow: 0 8px 30px rgba(var(--color-vinho-rgb), 0.06);
}

.programAccent {
  width: 4px;
  flex-shrink: 0;
  background: var(--program-color);
  opacity: 0.4;
  transition: opacity 0.4s ease;
}

.programCard:hover .programAccent {
  opacity: 1;
}

.programBody {
  padding: 32px 28px;
  flex: 1;
}

.programIconWrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  margin-bottom: 18px;
  background: color-mix(in srgb, var(--program-color) 8%, transparent);
}

.programTitle {
  margin-bottom: 10px;
}

.programDescription {
  line-height: 1.7;
  margin-bottom: 1.25rem;
}

.programCardLink {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--program-color);
  cursor: pointer;
  transition: opacity 0.25s ease;
}

.programCardLink:hover {
  opacity: 0.65;
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
  box-shadow: var(--shadow-soft);
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
  font-size: clamp(1.3rem, 3vw, 1.5rem);
  font-weight: 700;
  font-style: italic;
  line-height: 1.4;
  color: var(--color-vinho);
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
  transition: all 0.35s ease;
  box-shadow: var(--shadow-soft);
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

/* Outline button hover: fill with vinho */
.btnHeroSecondary:hover {
  background: var(--color-vinho) !important;
  border-color: var(--color-vinho) !important;
  color: white !important;
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
   FOOTER
   ============================================ */
.siteFooter {
  background: var(--color-preto);
  padding: 60px 7% 30px;
  color: rgba(255, 255, 255, 0.4);
}

.footerContainer {
  max-width: 1200px;
  margin: 0 auto;
}

.footerContent {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 40px;
  margin-bottom: 40px;
}

.footerBrand {
  max-width: 300px;
}

.footerLogo {
  margin-bottom: 12px;
  filter: brightness(0) invert(1) opacity(0.8);
}

.footerBrandText {
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.6;
}

.footerLinks {
  display: flex;
  justify-content: space-between;
  gap: 30px;
}

.footerColumn h4 {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 16px;
}

.footerColumn ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footerColumn ul li {
  margin-bottom: 10px;
}

.footerColumn ul li a {
  font-size: 0.86rem;
  color: rgba(255, 255, 255, 0.35);
  text-decoration: none;
  transition: color 0.35s ease;
}

.footerColumn ul li a:hover {
  color: var(--color-coral-claro);
}

.footerBottom {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footerCopyright {
  font-size: 0.78rem;
}

.footerSocial {
  display: flex;
  gap: 16px;
}

.footerSocialLink {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.35s ease;
}

.footerSocialLink:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
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

  .footerContent {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footerBrand {
    max-width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footerLinks {
    justify-content: center;
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

  .contactFormCard {
    padding: 2rem;
  }

  .siteFooter {
    padding: 40px 5% 24px;
  }

  .footerLinks {
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    gap: 16px;
  }

  .footerColumn h4 {
    font-size: 0.65rem;
    letter-spacing: 1.5px;
    margin-bottom: 10px;
  }

  .footerColumn ul li {
    margin-bottom: 7px;
  }

  .footerColumn ul li a {
    font-size: 0.78rem;
  }

  .footerBottom {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .siteFooter {
    padding: 32px 5% 20px;
  }

  .footerBrandText {
    font-size: 0.78rem;
  }

  .footerLinks {
    gap: 12px;
  }

  .footerColumn h4 {
    font-size: 0.6rem;
    margin-bottom: 8px;
  }

  .footerColumn ul li a {
    font-size: 0.72rem;
  }

  .footerCopyright {
    font-size: 0.68rem;
  }

  .statItem {
    padding: 30px 16px;
  }

  .statNumber {
    font-size: 2rem;
  }
}

@media (max-width: 360px) {
  .footerLinks {
    flex-direction: column;
    gap: 0;
    align-items: stretch;
  }

  .footerColumn {
    padding: 14px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .footerColumn:last-child {
    border-bottom: none;
  }

  .footerColumn h4 {
    margin-bottom: 6px;
  }

  .footerColumn ul {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
  }

  .footerColumn ul li {
    margin-bottom: 0;
  }

  .footerCopyright {
    font-size: 0.62rem;
  }

  .statItem {
    flex: 1 1 100%;
  }
}

</style>
