<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  CBBadge,
  CBButton,
  CBCard,
  CBIcon,
  CBImage,
  CBInput,
  CBLabel,
  CBNavbar,
  CBSelect,
  CBTextarea,
  type INavbarMenuItem,
} from '@cb/components';
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

// Form state
const formName = ref('');
const formEmail = ref('');
const formSubject = ref<string | undefined>(undefined);
const formMessage = ref('');

const subjectItems = computed(() => [
  { value: 'volunteer', label: t('contact.form.subject.options.volunteer') },
  { value: 'donate', label: t('contact.form.subject.options.donate') },
  { value: 'partnership', label: t('contact.form.subject.options.partnership') },
  { value: 'general', label: t('contact.form.subject.options.general') },
]);

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
            :content="$t('hero.badge')"
            variant="outline"
            icon="luc-sparkles"
            :icon-size="14"
            weight="bold"
            size="xs"
            class="heroBadge animateOnScroll"
          />

          <!-- Título principal com gradiente -->
          <CBLabel
            :text="$t('hero.title')"
            tag="h1"
            weight="black"
            class="heroTitle animateOnScroll"
          />

          <!-- Subtítulo -->
          <CBLabel
            :text="$t('hero.subtitle')"
            size="lg"
            color="secondary"
            class="heroSubtitle animateOnScroll"
          />

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
            <CBCard
              variant="outlined"
              :rounded="20"
              hover
              bg-color="var(--glass-bg)"
              border-color="var(--glass-border)"
              :border-width="1"
              class="heroStatCard heroStatCard--magenta"
            >
              <div class="heroStatInner">
                <div class="heroStatIconWrapper">
                  <CBIcon icon="luc-award" size="1.75rem" color="#ffffff" />
                </div>
                <CBLabel
                  :text="$t('hero.stats.headquarter.number')"
                  tag="span"
                  weight="extrabold"
                  dense
                  class="heroStatNumber"
                />
                <CBLabel
                  :text="$t('hero.stats.headquarter.label')"
                  tag="span"
                  size="sm"
                  weight="medium"
                  dense
                  class="heroStatLabel"
                />
              </div>
            </CBCard>

            <CBCard
              variant="outlined"
              :rounded="20"
              hover
              bg-color="var(--glass-bg)"
              border-color="var(--glass-border)"
              :border-width="1"
              class="heroStatCard heroStatCard--coral"
            >
              <div class="heroStatInner">
                <div class="heroStatIconWrapper">
                  <CBIcon icon="luc-megaphone" size="1.75rem" color="#ffffff" />
                </div>
                <CBLabel
                  :text="$t('hero.stats.conference.number')"
                  tag="span"
                  weight="extrabold"
                  dense
                  class="heroStatNumber"
                />
                <CBLabel
                  :text="$t('hero.stats.conference.label')"
                  tag="span"
                  size="sm"
                  weight="medium"
                  dense
                  class="heroStatLabel"
                />
              </div>
            </CBCard>

            <CBCard
              variant="outlined"
              :rounded="20"
              hover
              bg-color="var(--glass-bg)"
              border-color="var(--glass-border)"
              :border-width="1"
              class="heroStatCard heroStatCard--rosa"
            >
              <div class="heroStatInner">
                <div class="heroStatIconWrapper">
                  <CBIcon icon="luc-users" size="1.75rem" color="#ffffff" />
                </div>
                <CBLabel
                  :text="$t('hero.stats.location.number')"
                  tag="span"
                  weight="extrabold"
                  dense
                  class="heroStatNumber"
                />
                <CBLabel
                  :text="$t('hero.stats.location.label')"
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
              :content="$t('mission.badge')"
              variant="outline"
              icon="luc-target"
              :icon-size="14"
              weight="bold"
              size="xs"
              class="sectionBadge"
            />

            <CBLabel :text="$t('mission.title')" tag="h2" weight="bold" class="sectionTitle" />

            <CBLabel :text="$t('mission.text1')" size="md" color="secondary" class="missionText" />

            <CBLabel :text="$t('mission.text2')" size="md" color="secondary" class="missionText" />

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
                  :text="$t('mission.imageAlt')"
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
              :content="$t('programs.badge')"
              variant="outline"
              icon="luc-lightbulb"
              :icon-size="14"
              weight="bold"
              size="xs"
              class="sectionBadge"
            />

            <CBLabel :text="$t('programs.title')" tag="h2" weight="bold" class="sectionTitle" />
          </div>

          <div class="programsGrid">
            <!-- Card 1 -->
            <CBCard
              variant="outlined"
              :rounded="20"
              hover
              border-color="var(--border-light)"
              class="programCard animateOnScroll"
            >
              <div class="programIconWrapper programIconWrapper--magenta">
                <CBIcon icon="luc-megaphone" size="2rem" color="#ffffff" />
              </div>
              <CBLabel
                :text="$t('programs.items.communication.title')"
                tag="h3"
                size="lg"
                weight="bold"
                class="programTitle"
              />
              <CBLabel
                :text="$t('programs.items.communication.description')"
                size="sm"
                color="secondary"
                class="programDescription"
              />
              <div class="programCardFooter">
                <CBLabel
                  :text="$t('programs.items.communication.link')"
                  tag="span"
                  size="sm"
                  weight="semibold"
                  dense
                  class="programCardLink"
                />
              </div>
            </CBCard>

            <!-- Card 2 -->
            <CBCard
              variant="outlined"
              :rounded="20"
              hover
              border-color="var(--border-light)"
              class="programCard animateOnScroll"
            >
              <div class="programIconWrapper programIconWrapper--coral">
                <CBIcon icon="luc-graduation-cap" size="2rem" color="#ffffff" />
              </div>
              <CBLabel
                :text="$t('programs.items.education.title')"
                tag="h3"
                size="lg"
                weight="bold"
                class="programTitle"
              />
              <CBLabel
                :text="$t('programs.items.education.description')"
                size="sm"
                color="secondary"
                class="programDescription"
              />
              <div class="programCardFooter">
                <CBLabel
                  :text="$t('programs.items.education.link')"
                  tag="span"
                  size="sm"
                  weight="semibold"
                  dense
                  class="programCardLink"
                />
              </div>
            </CBCard>

            <!-- Card 3 -->
            <CBCard
              variant="outlined"
              :rounded="20"
              hover
              border-color="var(--border-light)"
              class="programCard animateOnScroll"
            >
              <div class="programIconWrapper programIconWrapper--rosa">
                <CBIcon icon="luc-users" size="2rem" color="#ffffff" />
              </div>
              <CBLabel
                :text="$t('programs.items.social.title')"
                tag="h3"
                size="lg"
                weight="bold"
                class="programTitle"
              />
              <CBLabel
                :text="$t('programs.items.social.description')"
                size="sm"
                color="secondary"
                class="programDescription"
              />
              <div class="programCardFooter">
                <CBLabel
                  :text="$t('programs.items.social.link')"
                  tag="span"
                  size="sm"
                  weight="semibold"
                  dense
                  class="programCardLink"
                />
              </div>
            </CBCard>

            <!-- Card 4 -->
            <CBCard
              variant="outlined"
              :rounded="20"
              hover
              border-color="var(--border-light)"
              class="programCard animateOnScroll"
            >
              <div class="programIconWrapper programIconWrapper--oliva">
                <CBIcon icon="luc-scale" size="2rem" color="#ffffff" />
              </div>
              <CBLabel
                :text="$t('programs.items.political.title')"
                tag="h3"
                size="lg"
                weight="bold"
                class="programTitle"
              />
              <CBLabel
                :text="$t('programs.items.political.description')"
                size="sm"
                color="secondary"
                class="programDescription"
              />
              <div class="programCardFooter">
                <CBLabel
                  :text="$t('programs.items.political.link')"
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
                <CBLabel
                  :text="$t('testimonial.author.name')"
                  tag="span"
                  weight="semibold"
                  dense
                  class="testimonialAuthorName"
                />
                <CBLabel
                  :text="$t('testimonial.author.role')"
                  tag="span"
                  size="sm"
                  color="secondary"
                  dense
                  class="testimonialAuthorRole"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Supporters Section - MODERNA -->
      <section class="supportersSection">
        <div class="supportersContainer">
          <div class="supportersHeader animateOnScroll">
            <CBBadge
              :content="$t('supporters.badge')"
              variant="outline"
              icon="luc-handshake"
              :icon-size="14"
              weight="bold"
              size="xs"
              class="sectionBadge"
            />

            <CBLabel :text="$t('supporters.title')" tag="h2" weight="bold" class="sectionTitle" />

            <CBLabel
              :text="$t('supporters.subtitle')"
              size="md"
              color="secondary"
              class="supportersSubtitle"
            />
          </div>

          <div class="supportersGrid animateOnScroll">
            <CBCard
              variant="outlined"
              :rounded="16"
              hover
              bg-color="var(--bg-white)"
              border-color="var(--border-light)"
              :border-width="1"
              class="supporterCard supporterCard--magenta"
            >
              <div class="supporterCardInner">
                <div class="supporterIconWrapper">
                  <CBIcon icon="luc-building-2" size="1.5rem" color="#ffffff" />
                </div>
                <CBLabel text="Apoiador 1" size="md" weight="semibold" class="supporterName" />
              </div>
            </CBCard>

            <CBCard
              variant="outlined"
              :rounded="16"
              hover
              bg-color="var(--bg-white)"
              border-color="var(--border-light)"
              :border-width="1"
              class="supporterCard supporterCard--coral"
            >
              <div class="supporterCardInner">
                <div class="supporterIconWrapper">
                  <CBIcon icon="luc-heart-handshake" size="1.5rem" color="#ffffff" />
                </div>
                <CBLabel text="Apoiador 2" size="md" weight="semibold" class="supporterName" />
              </div>
            </CBCard>

            <CBCard
              variant="outlined"
              :rounded="16"
              hover
              bg-color="var(--bg-white)"
              border-color="var(--border-light)"
              :border-width="1"
              class="supporterCard supporterCard--rosa"
            >
              <div class="supporterCardInner">
                <div class="supporterIconWrapper">
                  <CBIcon icon="luc-globe" size="1.5rem" color="#ffffff" />
                </div>
                <CBLabel text="Apoiador 3" size="md" weight="semibold" class="supporterName" />
              </div>
            </CBCard>

            <CBCard
              variant="outlined"
              :rounded="16"
              hover
              bg-color="var(--bg-white)"
              border-color="var(--border-light)"
              :border-width="1"
              class="supporterCard supporterCard--oliva"
            >
              <div class="supporterCardInner">
                <div class="supporterIconWrapper">
                  <CBIcon icon="luc-star" size="1.5rem" color="#ffffff" />
                </div>
                <CBLabel text="Apoiador 4" size="md" weight="semibold" class="supporterName" />
              </div>
            </CBCard>

            <CBCard
              variant="outlined"
              :rounded="16"
              hover
              bg-color="var(--bg-white)"
              border-color="var(--border-light)"
              :border-width="1"
              class="supporterCard supporterCard--laranja"
            >
              <div class="supporterCardInner">
                <div class="supporterIconWrapper">
                  <CBIcon icon="luc-award" size="1.5rem" color="#ffffff" />
                </div>
                <CBLabel text="Apoiador 5" size="md" weight="semibold" class="supporterName" />
              </div>
            </CBCard>
          </div>
        </div>
      </section>

      <!-- Contact Section - REDESENHADA -->
      <section class="contactSection">
        <div class="contactContainer">
          <div class="contactInfo animateOnScroll">
            <CBBadge
              :content="$t('contact.badge')"
              variant="outline"
              icon="luc-mail"
              :icon-size="14"
              weight="bold"
              size="xs"
              class="sectionBadge"
            />

            <CBLabel :text="$t('contact.title')" tag="h2" weight="bold" class="sectionTitle" />

            <CBLabel
              :text="$t('contact.description')"
              size="md"
              color="secondary"
              class="contactDescription"
            />

            <div class="contactMethods">
              <CBCard
                variant="outlined"
                :rounded="16"
                hover
                bg-color="var(--bg-white)"
                border-color="var(--border-light)"
                :border-width="1"
                class="contactMethodCard contactMethodCard--magenta"
              >
                <div class="contactMethodInner">
                  <div class="contactMethodIconWrapper">
                    <CBIcon icon="luc-instagram" size="1.5rem" color="#ffffff" />
                  </div>
                  <div class="contactMethodContent">
                    <CBLabel
                      :text="$t('contact.methods.instagram.label')"
                      tag="span"
                      size="xs"
                      color="tertiary"
                      weight="bold"
                      dense
                      class="contactMethodLabel"
                    />
                    <CBLabel
                      :text="$t('contact.methods.instagram.value')"
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

              <CBCard
                variant="outlined"
                :rounded="16"
                hover
                bg-color="var(--bg-white)"
                border-color="var(--border-light)"
                :border-width="1"
                class="contactMethodCard contactMethodCard--coral"
              >
                <div class="contactMethodInner">
                  <div class="contactMethodIconWrapper">
                    <CBIcon icon="luc-user-check" size="1.5rem" color="#ffffff" />
                  </div>
                  <div class="contactMethodContent">
                    <CBLabel
                      :text="$t('contact.methods.president.label')"
                      tag="span"
                      size="xs"
                      color="tertiary"
                      weight="bold"
                      dense
                      class="contactMethodLabel"
                    />
                    <CBLabel
                      :text="$t('contact.methods.president.value')"
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

              <CBCard
                variant="outlined"
                :rounded="16"
                hover
                bg-color="var(--bg-white)"
                border-color="var(--border-light)"
                :border-width="1"
                class="contactMethodCard contactMethodCard--rosa"
              >
                <div class="contactMethodInner">
                  <div class="contactMethodIconWrapper">
                    <CBIcon icon="luc-map-pin" size="1.5rem" color="#ffffff" />
                  </div>
                  <div class="contactMethodContent">
                    <CBLabel
                      :text="$t('contact.methods.location.label')"
                      tag="span"
                      size="xs"
                      color="tertiary"
                      weight="bold"
                      dense
                      class="contactMethodLabel"
                    />
                    <CBLabel
                      :text="$t('contact.methods.location.value')"
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
            <CBLabel :text="$t('cta.title')" tag="h2" weight="extrabold" class="ctaTitle" />
            <CBLabel :text="$t('cta.subtitle')" size="lg" color="secondary" class="ctaSubtitle" />
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

/* Icon wrappers com gradiente */
.heroStatIconWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  margin-bottom: 1.25rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.heroStatCard--magenta .heroStatIconWrapper {
  background: var(--gradient-magenta);
  box-shadow: var(--glow-magenta);
}

.heroStatCard--coral .heroStatIconWrapper {
  background: var(--gradient-coral);
  box-shadow: var(--glow-coral);
}

.heroStatCard--rosa .heroStatIconWrapper {
  background: var(--gradient-rosa);
  box-shadow: var(--glow-rosa);
}

/* Hover glow por variante */
.heroStatCard--magenta:hover {
  border-color: var(--border-magenta);
  box-shadow: var(--glow-magenta-card);
}

.heroStatCard--coral:hover {
  border-color: var(--border-coral);
  box-shadow: var(--glow-coral-card);
}

.heroStatCard--rosa:hover {
  border-color: var(--border-rosa);
  box-shadow: var(--glow-rosa-card);
}

.heroStatCard:hover .heroStatIconWrapper {
  transform: scale(1.1) rotate(5deg);
  filter: brightness(1.1);
}

.heroStatCard--magenta:hover .heroStatIconWrapper {
  box-shadow: var(--glow-magenta-hover);
}

.heroStatCard--coral:hover .heroStatIconWrapper {
  box-shadow: var(--glow-coral-hover);
}

.heroStatCard--rosa:hover .heroStatIconWrapper {
  box-shadow: var(--glow-rosa-hover);
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
}

/* Rosa Magenta - Comunicação */
.programIconWrapper--magenta {
  background: var(--gradient-magenta);
  box-shadow: var(--glow-magenta);
}

/* Vermelho Coral - Educação */
.programIconWrapper--coral {
  background: var(--gradient-coral);
  box-shadow: var(--glow-coral);
}

/* Rosa Escuro - Social */
.programIconWrapper--rosa {
  background: var(--gradient-rosa);
  box-shadow: var(--glow-rosa);
}

/* Verde Oliva - Político */
.programIconWrapper--oliva {
  background: var(--gradient-oliva);
  box-shadow: var(--glow-oliva);
}

.programCard:hover .programIconWrapper {
  transform: scale(1.1) rotate(5deg);
  filter: brightness(1.1);
}

.programCard:hover .programIconWrapper--magenta {
  box-shadow: var(--glow-magenta-hover);
}

.programCard:hover .programIconWrapper--coral {
  box-shadow: var(--glow-coral-hover);
}

.programCard:hover .programIconWrapper--rosa {
  box-shadow: var(--glow-rosa-hover);
}

.programCard:hover .programIconWrapper--oliva {
  box-shadow: var(--glow-oliva-hover);
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
  background: radial-gradient(circle at top center, rgba(var(--color-magenta-rgb), 0.15) 0%, transparent 70%);
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

.supportersGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.supporterCard {
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

/* Icon wrappers com gradiente — mesma linguagem visual */
.supporterIconWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.supporterCard--magenta .supporterIconWrapper {
  background: var(--gradient-magenta);
  box-shadow: var(--glow-magenta);
}

.supporterCard--coral .supporterIconWrapper {
  background: var(--gradient-coral);
  box-shadow: var(--glow-coral);
}

.supporterCard--rosa .supporterIconWrapper {
  background: var(--gradient-rosa);
  box-shadow: var(--glow-rosa);
}

.supporterCard--oliva .supporterIconWrapper {
  background: var(--gradient-oliva);
  box-shadow: var(--glow-oliva);
}

.supporterCard--laranja .supporterIconWrapper {
  background: var(--gradient-laranja);
  box-shadow: var(--glow-laranja);
}

/* Hover glow por variante */
.supporterCard--magenta:hover {
  border-color: var(--border-magenta);
  box-shadow: var(--glow-magenta-subtle);
}

.supporterCard--coral:hover {
  border-color: var(--border-coral);
  box-shadow: var(--glow-coral-subtle);
}

.supporterCard--rosa:hover {
  border-color: var(--border-rosa);
  box-shadow: var(--glow-rosa-subtle);
}

.supporterCard--oliva:hover {
  border-color: var(--border-oliva);
  box-shadow: var(--glow-oliva-card);
}

.supporterCard--laranja:hover {
  border-color: var(--border-laranja);
  box-shadow: var(--glow-laranja-subtle);
}

.supporterCard:hover .supporterIconWrapper {
  transform: scale(1.08);
  filter: brightness(1.1);
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

.contactMethodCard--magenta:hover {
  border-color: var(--border-magenta);
  box-shadow: var(--glow-magenta-subtle);
}

.contactMethodCard--coral:hover {
  border-color: var(--border-coral);
  box-shadow: var(--glow-coral-subtle);
}

.contactMethodCard--rosa:hover {
  border-color: var(--border-rosa);
  box-shadow: var(--glow-rosa-subtle);
}

/* Icon wrappers com gradiente - mesma linguagem dos programs */
.contactMethodIconWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.contactMethodCard--magenta .contactMethodIconWrapper {
  background: var(--gradient-magenta);
  box-shadow: var(--glow-magenta);
}

.contactMethodCard--coral .contactMethodIconWrapper {
  background: var(--gradient-coral);
  box-shadow: var(--glow-coral);
}

.contactMethodCard--rosa .contactMethodIconWrapper {
  background: var(--gradient-rosa);
  box-shadow: var(--glow-rosa);
}

.contactMethodCard:hover .contactMethodIconWrapper {
  transform: scale(1.08);
  filter: brightness(1.1);
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
