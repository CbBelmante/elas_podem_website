<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { CBButton, CBCard, CBIcon, CBNavbar, type INavbarMenuItem } from '@cb/components';
import { useI18n } from 'vue-i18n';
import '@cb/components/style.css';
import '../assets/css/theme.css';

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

const currentPath = ref('/');

const { t } = useI18n();

const menuItems = computed<INavbarMenuItem[]>(() => [
  {
    label: t('navbar.home'),
    to: '/',
  },
  {
    label: t('navbar.about'),
    to: '/sobre',
  },
  {
    label: t('navbar.projects'),
    to: '/projetos',
  },
  {
    label: t('navbar.blog'),
    to: '/blog',
  },
]);

const handleNavigate = ({ path }: { path: string }) => {
  currentPath.value = path;
  console.log('Navegou para:', path);
};

const handleLogoClick = () => {
  currentPath.value = '/';
  console.log('Logo clicado - voltando ao home');
};

// Animações de scroll
onMounted(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('isVisible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animateOnScroll').forEach((el) => {
    observer.observe(el);
  });
});
</script>

<template>
  <div class="pageWrapper">
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
        <img src="/logo-elas-podem.png" alt="Elas Podem" class="navbarLogo" />
      </template>
    </CBNavbar>

    <!-- Hero Section - REDESENHADO -->
    <section class="heroSection">
      <div class="heroContent">
        <!-- Badge superior -->
        <div class="heroBadge animateOnScroll">
          <CBIcon icon="luc-sparkles" size="1rem" color="var(--cb-primary)" class="heroBadgeIcon" />
          <span>{{ $t('hero.badge') }}</span>
        </div>

        <!-- Título principal com gradiente -->
        <h1 class="heroTitle animateOnScroll">
          {{ $t('hero.title') }}
        </h1>

        <!-- Subtítulo -->
        <p class="heroSubtitle animateOnScroll">
          {{ $t('hero.subtitle') }}
        </p>

        <!-- Botões com efeitos premium -->
        <div class="heroActions animateOnScroll">
          <CBButton
            :label="$t('hero.btnDonate')"
            size="lg"
            :bg-gradient="'var(--gradient-primary)'"
            :rounded="14"
            prepend-icon="luc-heart"
            shine
            glow
            class="btnHero"
          />

          <CBButton
            :label="$t('hero.btnHistory')"
            size="lg"
            variant="outline"
            :color="'var(--cb-secondary)'"
            :rounded="14"
            append-icon="luc-arrow-right"
            class="btnHeroSecondary"
          />
        </div>

        <!-- Estatísticas com glassmorphism -->
        <div class="heroStats animateOnScroll">
          <div class="heroStatCard">
            <CBIcon icon="luc-award" size="2rem" color="var(--cb-primary)" class="heroStatIcon" />
            <div class="heroStatNumber">{{ $t('hero.stats.headquarter.number') }}</div>
            <div class="heroStatLabel">{{ $t('hero.stats.headquarter.label') }}</div>
          </div>

          <div class="heroStatCard">
            <CBIcon
              icon="luc-megaphone"
              size="2rem"
              color="var(--cb-primary)"
              class="heroStatIcon"
            />
            <div class="heroStatNumber">{{ $t('hero.stats.conference.number') }}</div>
            <div class="heroStatLabel">{{ $t('hero.stats.conference.label') }}</div>
          </div>

          <div class="heroStatCard">
            <CBIcon icon="luc-users" size="2rem" color="var(--cb-primary)" class="heroStatIcon" />
            <div class="heroStatNumber">{{ $t('hero.stats.location.number') }}</div>
            <div class="heroStatLabel">{{ $t('hero.stats.location.label') }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Section - MODERNIZADA -->
    <section class="missionSection">
      <div class="missionContainer">
        <div class="missionContent animateOnScroll">
          <div class="sectionBadge">
            <CBIcon
              icon="luc-target"
              size="1rem"
              color="var(--cb-primary)"
              class="sectionBadgeIcon"
            />
            <span>{{ $t('mission.badge') }}</span>
          </div>

          <h2 class="sectionTitle">
            {{ $t('mission.title') }}
          </h2>

          <p class="missionText">
            {{ $t('mission.text1') }}
          </p>

          <p class="missionText">
            {{ $t('mission.text2') }}
          </p>

          <CBButton
            :label="$t('mission.btnLearnMore')"
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
                  <stop stop-color="#C084FC" stop-opacity="0.3" />
                  <stop offset="1" stop-color="#EC4899" stop-opacity="0.1" />
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
              <div class="missionImageText">{{ $t('mission.imageAlt') }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Programs Section - CARDS PREMIUM -->
    <section class="programsSection">
      <div class="programsContainer">
        <div class="programsHeader animateOnScroll">
          <div class="sectionBadge">
            <CBIcon
              icon="luc-lightbulb"
              size="1rem"
              color="var(--cb-primary)"
              class="sectionBadgeIcon"
            />
            <span>{{ $t('programs.badge') }}</span>
          </div>

          <h2 class="sectionTitle">
            {{ $t('programs.title') }}
          </h2>
        </div>

        <div class="programsGrid">
          <!-- Card 1 -->
          <div class="programCard animateOnScroll">
            <div class="programCardGlow"></div>
            <div class="programCardContent">
              <div class="programIconWrapper programIconWrapper--purple">
                <CBIcon
                  icon="luc-megaphone"
                  size="2rem"
                  color="var(--accent-color)"
                  class="programIcon"
                />
              </div>
              <h3 class="programTitle">{{ $t('programs.items.communication.title') }}</h3>
              <p class="programDescription">
                {{ $t('programs.items.communication.description') }}
              </p>
              <div class="programCardFooter">
                <span class="programCardLink">{{ $t('programs.items.communication.link') }}</span>
              </div>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="programCard animateOnScroll">
            <div class="programCardGlow"></div>
            <div class="programCardContent">
              <div class="programIconWrapper programIconWrapper--pink">
                <CBIcon
                  icon="luc-graduation-cap"
                  size="2rem"
                  color="var(--accent-color)"
                  class="programIcon"
                />
              </div>
              <h3 class="programTitle">{{ $t('programs.items.education.title') }}</h3>
              <p class="programDescription">
                {{ $t('programs.items.education.description') }}
              </p>
              <div class="programCardFooter">
                <span class="programCardLink">{{ $t('programs.items.education.link') }}</span>
              </div>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="programCard animateOnScroll">
            <div class="programCardGlow"></div>
            <div class="programCardContent">
              <div class="programIconWrapper programIconWrapper--violet">
                <CBIcon
                  icon="luc-users"
                  size="2rem"
                  color="var(--accent-color)"
                  class="programIcon"
                />
              </div>
              <h3 class="programTitle">{{ $t('programs.items.social.title') }}</h3>
              <p class="programDescription">
                {{ $t('programs.items.social.description') }}
              </p>
              <div class="programCardFooter">
                <span class="programCardLink">{{ $t('programs.items.social.link') }}</span>
              </div>
            </div>
          </div>

          <!-- Card 4 -->
          <div class="programCard animateOnScroll">
            <div class="programCardGlow"></div>
            <div class="programCardContent">
              <div class="programIconWrapper programIconWrapper--fuchsia">
                <CBIcon
                  icon="luc-scale"
                  size="2rem"
                  color="var(--accent-color)"
                  class="programIcon"
                />
              </div>
              <h3 class="programTitle">{{ $t('programs.items.political.title') }}</h3>
              <p class="programDescription">
                {{ $t('programs.items.political.description') }}
              </p>
              <div class="programCardFooter">
                <span class="programCardLink">{{ $t('programs.items.political.link') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonial Section - ELEGANTE -->
    <section class="testimonialSection">
      <div class="testimonialContainer animateOnScroll">
        <div class="testimonialCard">
          <div class="testimonialCardGlow"></div>
          <div class="testimonialQuoteIcon">"</div>
          <blockquote class="testimonialQuote">
            {{ $t('testimonial.quote') }}
          </blockquote>
          <div class="testimonialAuthor">
            <div class="testimonialAuthorAvatar">M</div>
            <div class="testimonialAuthorInfo">
              <div class="testimonialAuthorName">{{ $t('testimonial.author.name') }}</div>
              <div class="testimonialAuthorRole">{{ $t('testimonial.author.role') }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Supporters Section - MODERNA -->
    <section class="supportersSection">
      <div class="supportersContainer">
        <div class="supportersHeader animateOnScroll">
          <div class="sectionBadge">
            <CBIcon
              icon="luc-handshake"
              size="1rem"
              color="var(--cb-primary)"
              class="sectionBadgeIcon"
            />
            <span>{{ $t('supporters.badge') }}</span>
          </div>

          <h2 class="sectionTitle">
            {{ $t('supporters.title') }}
          </h2>

          <p class="supportersSubtitle">
            {{ $t('supporters.subtitle') }}
          </p>
        </div>

        <div class="supportersGrid animateOnScroll">
          <div class="supporterCard">
            <div class="supporterCardInner">Apoiador 1</div>
          </div>
          <div class="supporterCard">
            <div class="supporterCardInner">Apoiador 2</div>
          </div>
          <div class="supporterCard">
            <div class="supporterCardInner">Apoiador 3</div>
          </div>
          <div class="supporterCard">
            <div class="supporterCardInner">Apoiador 4</div>
          </div>
          <div class="supporterCard">
            <div class="supporterCardInner">Apoiador 5</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section - REDESENHADA -->
    <section class="contactSection">
      <div class="contactContainer">
        <div class="contactInfo animateOnScroll">
          <div class="sectionBadge">
            <span class="sectionBadgeIcon">📧</span>
            <span>{{ $t('contact.badge') }}</span>
          </div>

          <h2 class="sectionTitle">{{ $t('contact.title') }}</h2>

          <p class="contactDescription">
            {{ $t('contact.description') }}
          </p>

          <div class="contactMethods">
            <CBCard
              variant="outlined"
              :rounded="16"
              hover
              density="regular"
              bg-color="var(--bg-light)"
              border-color="var(--border-light)"
              :border-width="1"
              class="contactMethodCard"
            >
              <div class="contactMethodWrapper">
                <CBIcon
                  icon="luc-instagram"
                  size="2rem"
                  color="var(--cb-primary)"
                  class="contactMethodIcon"
                />
                <div class="contactMethodContent">
                  <div class="contactMethodLabel">{{ $t('contact.methods.instagram.label') }}</div>
                  <div class="contactMethodValue">{{ $t('contact.methods.instagram.value') }}</div>
                </div>
              </div>
            </CBCard>

            <CBCard
              variant="outlined"
              :rounded="16"
              hover
              density="regular"
              bg-color="var(--bg-light)"
              border-color="var(--border-light)"
              :border-width="1"
              class="contactMethodCard"
            >
              <div class="contactMethodWrapper">
                <CBIcon
                  icon="luc-user-check"
                  size="2rem"
                  color="var(--cb-primary)"
                  class="contactMethodIcon"
                />
                <div class="contactMethodContent">
                  <div class="contactMethodLabel">{{ $t('contact.methods.president.label') }}</div>
                  <div class="contactMethodValue">{{ $t('contact.methods.president.value') }}</div>
                </div>
              </div>
            </CBCard>

            <CBCard
              variant="outlined"
              :rounded="16"
              hover
              density="regular"
              bg-color="var(--bg-light)"
              border-color="var(--border-light)"
              :border-width="1"
              class="contactMethodCard"
            >
              <div class="contactMethodWrapper">
                <CBIcon
                  icon="luc-map-pin"
                  size="2rem"
                  color="var(--cb-primary)"
                  class="contactMethodIcon"
                />
                <div class="contactMethodContent">
                  <div class="contactMethodLabel">{{ $t('contact.methods.location.label') }}</div>
                  <div class="contactMethodValue">{{ $t('contact.methods.location.value') }}</div>
                </div>
              </div>
            </CBCard>
          </div>
        </div>

        <div class="contactFormWrapper animateOnScroll">
          <CBCard variant="elevated" :rounded="24" class="contactFormCard">
            <form class="contactForm">
              <div class="formGroup">
                <label class="formLabel">{{ $t('contact.form.name.label') }}</label>
                <input
                  type="text"
                  class="formInput"
                  :placeholder="$t('contact.form.name.placeholder')"
                  required
                />
              </div>

              <div class="formGroup">
                <label class="formLabel">{{ $t('contact.form.email.label') }}</label>
                <input
                  type="email"
                  class="formInput"
                  :placeholder="$t('contact.form.email.placeholder')"
                  required
                />
              </div>

              <div class="formGroup">
                <label class="formLabel">{{ $t('contact.form.subject.label') }}</label>
                <select class="formInput">
                  <option>{{ $t('contact.form.subject.placeholder') }}</option>
                  <option>{{ $t('contact.form.subject.options.volunteer') }}</option>
                  <option>{{ $t('contact.form.subject.options.donate') }}</option>
                  <option>{{ $t('contact.form.subject.options.partnership') }}</option>
                  <option>{{ $t('contact.form.subject.options.general') }}</option>
                </select>
              </div>

              <div class="formGroup">
                <label class="formLabel">{{ $t('contact.form.message.label') }}</label>
                <textarea
                  class="formInput formTextarea"
                  rows="5"
                  :placeholder="$t('contact.form.message.placeholder')"
                  required
                ></textarea>
              </div>

              <CBButton
                :label="$t('contact.form.btnSubmit')"
                type="submit"
                size="lg"
                :bg-gradient="'var(--gradient-primary)'"
                :rounded="12"
                append-icon="luc-arrow-right"
                shine
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
          <h2 class="ctaTitle">{{ $t('cta.title') }}</h2>
          <p class="ctaSubtitle">
            {{ $t('cta.subtitle') }}
          </p>
          <div class="ctaActions">
            <CBButton
              :label="$t('cta.btnDonate')"
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
              :label="$t('cta.btnProjects')"
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
</template>

<style scoped>
/* ============================================
   COMPONENTE PRINCIPAL
   ============================================ */
.pageWrapper {
  min-height: 100vh;
  background: var(--bg-white);
  color: var(--text-primary);
  font-family: 'Lato', sans-serif; /* Aplicando Lato */
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
.customNavbar {
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
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

/* Gradiente de fundo animado */
.heroGradientBg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(147, 51, 234, 0.05) 0%,
    rgba(192, 132, 252, 0.03) 50%,
    rgba(236, 72, 153, 0.05) 100%
  );
  animation: gradientPulse 8s ease-in-out infinite;
}

@keyframes gradientPulse {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.7;
  }
}

/* Orbs de gradiente flutuantes */
.heroGradientOrb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
  animation: float 20s ease-in-out infinite;
}

.heroGradientOrb--1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #9333ea 0%, transparent 70%);
  top: -10%;
  left: -10%;
  animation-delay: 0s;
}

.heroGradientOrb--2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #c084fc 0%, transparent 70%);
  bottom: -10%;
  right: -5%;
  animation-delay: 7s;
}

.heroGradientOrb--3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #ec4899 0%, transparent 70%);
  top: 50%;
  right: 20%;
  animation-delay: 14s;
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

/* Grid de fundo sutil */
.heroGrid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(147, 51, 234, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(147, 51, 234, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;
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
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: var(--badge-bg);
  border: 1px solid var(--badge-border);
  border-radius: 100px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--cb-secondary);
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.heroBadge:hover {
  background: var(--badge-bg-hover);
  border-color: var(--border-hover);
  transform: translateY(-2px);
}

.heroBadgeIcon {
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.5rem;
}

/* Título com gradiente animado */
.heroTitle {
  font-family: 'Poppins', sans-serif; /* Aplicando Poppins */
  font-size: clamp(3.5rem, 10vw, 7rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
  text-transform: uppercase;
}

.heroTitleGradient {
  background: var(--gradient-hero);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% auto;
  animation: gradientShift 8s ease infinite;
  display: inline-block;
  text-shadow: 0 0 80px var(--shadow-md);
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% center;
  }
  50% {
    background-position: 100% center;
  }
}

/* Subtítulo */
.heroSubtitle {
  font-size: clamp(1.125rem, 2.5vw, 1.375rem);
  line-height: 1.7;
  color: #64748b;
  font-weight: 400;
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
  position: relative;
  padding: 2rem 1.5rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
}

.heroStatCard:hover {
  background: var(--bg-white);
  border-color: var(--border-hover);
  transform: translateY(-5px);
  box-shadow: var(--shadow-xl);
}

.heroStatIcon {
  margin-bottom: 1rem;
  display: block;
}

.heroStatNumber {
  font-family: 'Poppins', sans-serif;
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
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Scroll Indicator */
.heroScrollIndicator {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translate(-50%, 0);
  }
  50% {
    transform: translate(-50%, 10px);
  }
}

.heroScrollMouse {
  width: 28px;
  height: 46px;
  border: 2px solid rgba(147, 51, 234, 0.3);
  border-radius: 20px;
  position: relative;
}

.heroScrollWheel {
  width: 3px;
  height: 8px;
  background: rgba(147, 51, 234, 0.6);
  border-radius: 2px;
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  animation: scrollWheel 2s ease-in-out infinite;
}

@keyframes scrollWheel {
  0% {
    top: 8px;
    opacity: 1;
  }
  50% {
    top: 18px;
    opacity: 0.5;
  }
  100% {
    top: 8px;
    opacity: 1;
  }
}

/* ============================================
   COMPONENTES REUTILIZÁVEIS
   ============================================ */
.sectionBadge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: var(--badge-bg);
  border: 1px solid var(--badge-border);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--cb-primary);
  margin-bottom: 1.5rem;
}

.sectionBadgeIcon {
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.5rem;
}

.sectionTitle {
  font-family: 'Poppins', sans-serif; /* Aplicando Poppins */
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.sectionTitleAccent {
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ============================================
   MISSION SECTION
   ============================================ */
.missionSection {
  padding: 3rem 2rem;
  background: #f9fafb;
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
  font-size: 1.125rem;
  line-height: 1.8;
  color: #64748b;
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
    rgba(147, 51, 234, 0.2) 0%,
    rgba(192, 132, 252, 0.1) 50%,
    rgba(236, 72, 153, 0.2) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px; /* Mantido o original, ajustando se necessário */
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
  font-family: 'Poppins', sans-serif; /* Aplicando Poppins */
  font-size: 1.5rem;
  font-weight: 600;
}

/* ============================================
   PROGRAMS SECTION
   ============================================ */
.programsSection {
  padding: 3rem 2rem;
  background: #ffffff;
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
  position: relative;
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 1.5rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.programCard:hover {
  background: var(--bg-tint);
  border-color: var(--border-hover);
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.programCardGlow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.programCard:hover .programCardGlow {
  opacity: 1;
}

.programCardContent {
  position: relative;
  z-index: 1;
}

.programIconWrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 14px;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.programIconWrapper--purple {
  background: rgba(147, 51, 234, 0.15);
  border: 1px solid rgba(147, 51, 234, 0.3);
}

.programIconWrapper--pink {
  background: rgba(236, 72, 153, 0.15);
  border: 1px solid rgba(236, 72, 153, 0.3);
}

.programIconWrapper--violet {
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.3);
}

.programIconWrapper--fuchsia {
  background: rgba(217, 70, 239, 0.15);
  border: 1px solid rgba(217, 70, 239, 0.3);
}

.programCard:hover .programIconWrapper {
  transform: scale(1.1) rotate(5deg);
}

.programIcon {
  display: block;
}

.programTitle {
  font-family: 'Poppins', sans-serif; /* Aplicando Poppins */
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
}

.programDescription {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #64748b;
  margin-bottom: 1rem;
}

.programCardFooter {
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
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
  background: #f9fafb;
}

.testimonialContainer {
  max-width: 900px;
  margin: 0 auto;
}

.testimonialCard {
  position: relative;
  padding: 4rem 3rem;
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
  background: radial-gradient(circle at top center, rgba(147, 51, 234, 0.15) 0%, transparent 70%);
  opacity: 0.5;
  pointer-events: none;
}

.testimonialQuoteIcon {
  font-size: 8rem;
  font-weight: 700;
  color: rgba(147, 51, 234, 0.1);
  line-height: 1;
  margin-bottom: 1rem;
}

.testimonialQuote {
  font-family: 'Poppins', sans-serif; /* Aplicando Poppins */
  position: relative;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-style: italic;
  line-height: 1.6;
  color: #1a1a1a;
  margin: 0 0 2.5rem 0;
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
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--bg-white);
}

.testimonialAuthorName {
  font-family: 'Poppins', sans-serif; /* Aplicando Poppins */
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.testimonialAuthorRole {
  font-size: 0.9rem;
  color: #64748b;
}

/* ============================================
   SUPPORTERS SECTION
   ============================================ */
.supportersSection {
  padding: 3rem 2rem;
  background: #ffffff;
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
  font-size: 1.125rem;
  line-height: 1.6;
  color: #64748b;
  margin-top: 1rem;
}

.supportersGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.supporterCard {
  position: relative;
  height: 120px;
  background: var(--bg-light);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.supporterCard:hover {
  background: var(--bg-white);
  border-color: var(--border-hover);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.supporterCardInner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
}

/* ============================================
   CONTACT SECTION
   ============================================ */
.contactSection {
  padding: 3rem 2rem;
  background: #f9fafb;
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
  font-size: 1.125rem;
  line-height: 1.6;
  color: #64748b;
  margin-bottom: 3rem;
}

.contactMethods {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contactMethodCard {
  transition: all 0.3s ease !important;
  box-shadow: var(--shadow-sm);
}

.contactMethodCard:hover {
  transform: translateX(5px);
  background: var(--bg-white) !important;
  border-color: var(--border-hover) !important;
  box-shadow: var(--shadow-lg) !important;
}

.contactMethodCard:hover .contactMethodIcon {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}

.contactMethodWrapper {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
}

.contactMethodIcon {
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.contactMethodLabel {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8;
  margin-bottom: 0.5rem;
}

.contactMethodValue {
  font-size: 1.125rem;
  font-weight: 500;
  color: #1a1a1a;
}

/* Formulário */
.contactFormCard {
  /* Os estilos do card já são aplicados pelo CBCard */
}

.contactForm {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.formGroup {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.formLabel {
  font-family: 'Poppins', sans-serif; /* Aplicando Poppins */
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
}

.formInput {
  width: 100%;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  color: var(--text-primary);
  background: var(--bg-light);
  border: 1.5px solid var(--border-light);
  border-radius: 12px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.formInput:focus {
  outline: none;
  background: var(--bg-white);
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--badge-bg);
}

.formInput::placeholder {
  color: #94a3b8;
}

.formTextarea {
  resize: vertical;
  min-height: 120px;
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

.btnFormSubmit {
  width: 100%;
}

/* ============================================
   CTA SECTION
   ============================================ */
.ctaSection {
  position: relative;
  padding: 3rem 2rem;
  background: #ffffff;
  overflow: hidden;
}

.ctaGradientBg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(147, 51, 234, 0.15) 0%,
    rgba(192, 132, 252, 0.1) 50%,
    rgba(236, 72, 153, 0.15) 100%
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
  font-family: 'Poppins', sans-serif; /* Aplicando Poppins */
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
}

.ctaSubtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #64748b;
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

  .supportersGrid {
    grid-template-columns: repeat(2, 1fr);
  }

  .ctaContent {
    padding: 3rem 2rem;
  }

  .contactFormCard {
    padding: 2rem;
  }
}
</style>
