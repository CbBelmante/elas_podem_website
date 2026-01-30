<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CBButton, CBNavbar, type INavbarMenuItem } from '@cb/components'
import '@cb/components/style.css'
import '../assets/css/theme.css'

const currentPath = ref('/')

const menuItems: INavbarMenuItem[] = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Sobre nós',
    to: '/sobre',
  },
  {
    label: 'Projetos',
    to: '/projetos',
  },
  {
    label: 'Blog',
    to: '/blog',
  },
]

const handleNavigate = ({ path }: { path: string }) => {
  currentPath.value = path
  console.log('Navegou para:', path)
}

const handleLogoClick = () => {
  currentPath.value = '/'
  console.log('Logo clicado - voltando ao home')
}

// Animações de scroll
onMounted(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('isVisible')
      }
    })
  }, observerOptions)

  document.querySelectorAll('.animateOnScroll').forEach(el => {
    observer.observe(el)
  })
})
</script>

<template>
  <div class="pageWrapper">
    <!-- Navbar -->
    <CBNavbar
      :menu-items="menuItems"
      :current-path="currentPath"
      menu-style="folder"
      placement="fixed"
      :elevation="2"
      mobile-mode="popover"
      @navigate="handleNavigate"
      @logo-click="handleLogoClick"
      class="customNavbar"
    />

    <!-- Hero Section - REDESENHADO -->
    <section class="heroSection">
      <!-- Gradientes animados de fundo -->
      <div class="heroGradientBg"></div>
      <div class="heroGradientOrb heroGradientOrb--1"></div>
      <div class="heroGradientOrb heroGradientOrb--2"></div>
      <div class="heroGradientOrb heroGradientOrb--3"></div>

      <!-- Grid de fundo sutil -->
      <div class="heroGrid"></div>

      <div class="heroContent">
        <!-- Badge superior -->
        <div class="heroBadge animateOnScroll">
          <span class="heroBadgeIcon">✨</span>
          <span>JUNTAS SOMOS MAIS FORTES</span>
        </div>

        <!-- Título principal com gradiente -->
        <h1 class="heroTitle animateOnScroll">
          ELAS
          <br>
          <span class="heroTitleGradient">PODEM</span>
        </h1>

        <!-- Subtítulo -->
        <p class="heroSubtitle animateOnScroll">
          Investimos em mulheres corajosas que lideram movimentos de<br class="hideOnMobile">
          transformação social. Cada contribuição fortalece a luta por<br class="hideOnMobile">
          direitos, igualdade e justiça.
        </p>

        <!-- Botões com efeitos premium -->
        <div class="heroActions animateOnScroll">
          <button class="btnHeroPrimary">
            <span class="btnIcon">💜</span>
            <span>Doe Agora</span>
            <div class="btnShine"></div>
          </button>

          <button class="btnHeroSecondary">
            <span>Nossa História</span>
            <span class="btnIconArrow">→</span>
          </button>
        </div>

        <!-- Estatísticas com glassmorphism -->
        <div class="heroStats animateOnScroll">
          <div class="heroStatCard">
            <div class="heroStatIcon">🎯</div>
            <div class="heroStatNumber">2.500+</div>
            <div class="heroStatLabel">Mulheres Impactadas</div>
          </div>

          <div class="heroStatCard">
            <div class="heroStatIcon">🌍</div>
            <div class="heroStatNumber">45</div>
            <div class="heroStatLabel">Comunidades</div>
          </div>

          <div class="heroStatCard">
            <div class="heroStatIcon">💰</div>
            <div class="heroStatNumber">R$ 1.2M</div>
            <div class="heroStatLabel">Investidos</div>
          </div>
        </div>
      </div>

      <!-- Indicador de scroll -->
      <div class="heroScrollIndicator">
        <div class="heroScrollMouse">
          <div class="heroScrollWheel"></div>
        </div>
      </div>
    </section>

    <!-- Mission Section - MODERNIZADA -->
    <section class="missionSection">
      <div class="missionContainer">
        <div class="missionContent animateOnScroll">
          <div class="sectionBadge">
            <span class="sectionBadgeIcon">🎯</span>
            <span>NOSSA MISSÃO</span>
          </div>

          <h2 class="sectionTitle">
            Transformando Vidas,<br>
            <span class="sectionTitleAccent">Construindo Futuros</span>
          </h2>

          <p class="missionText">
            Acreditamos que toda mulher tem o direito de viver com dignidade, segurança e autonomia.
            Trabalhamos incansavelmente para oferecer suporte educacional, econômico e emocional
            para mulheres em situação de vulnerabilidade.
          </p>

          <p class="missionText">
            Através de programas de capacitação profissional, educação financeira e apoio psicológico,
            ajudamos mulheres a reconstruírem suas vidas e se tornarem agentes de mudança em suas comunidades.
          </p>

          <button class="btnPrimary">
            <span>Conheça Nossa História</span>
            <span class="btnIconArrow">→</span>
          </button>
        </div>

        <div class="missionVisual animateOnScroll">
          <div class="missionImageCard">
            <div class="missionImageOverlay"></div>
            <div class="missionImageContent">
              <div class="missionImageIcon">🌟</div>
              <div class="missionImageText">Imagem Inspiradora</div>
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
            <span class="sectionBadgeIcon">💡</span>
            <span>NOSSOS PROGRAMAS</span>
          </div>

          <h2 class="sectionTitle">
            Como Fazemos a<br>
            <span class="sectionTitleAccent">Diferença</span>
          </h2>
        </div>

        <div class="programsGrid">
          <!-- Card 1 -->
          <div class="programCard animateOnScroll">
            <div class="programCardGlow"></div>
            <div class="programCardContent">
              <div class="programIconWrapper programIconWrapper--purple">
                <span class="programIcon">📚</span>
              </div>
              <h3 class="programTitle">Educação e Capacitação</h3>
              <p class="programDescription">
                Oferecemos cursos profissionalizantes, workshops e treinamentos que preparam mulheres para o mercado de trabalho.
              </p>
              <div class="programCardFooter">
                <span class="programCardLink">Saiba mais →</span>
              </div>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="programCard animateOnScroll">
            <div class="programCardGlow"></div>
            <div class="programCardContent">
              <div class="programIconWrapper programIconWrapper--pink">
                <span class="programIcon">💼</span>
              </div>
              <h3 class="programTitle">Empreendedorismo</h3>
              <p class="programDescription">
                Apoiamos mulheres a criarem e desenvolverem seus próprios negócios com mentoria e microcrédito.
              </p>
              <div class="programCardFooter">
                <span class="programCardLink">Saiba mais →</span>
              </div>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="programCard animateOnScroll">
            <div class="programCardGlow"></div>
            <div class="programCardContent">
              <div class="programIconWrapper programIconWrapper--violet">
                <span class="programIcon">🤝</span>
              </div>
              <h3 class="programTitle">Rede de Apoio</h3>
              <p class="programDescription">
                Criamos uma comunidade forte onde mulheres se apoiam mutuamente e compartilham experiências.
              </p>
              <div class="programCardFooter">
                <span class="programCardLink">Saiba mais →</span>
              </div>
            </div>
          </div>

          <!-- Card 4 -->
          <div class="programCard animateOnScroll">
            <div class="programCardGlow"></div>
            <div class="programCardContent">
              <div class="programIconWrapper programIconWrapper--fuchsia">
                <span class="programIcon">💪</span>
              </div>
              <h3 class="programTitle">Saúde Mental</h3>
              <p class="programDescription">
                Oferecemos acompanhamento psicológico e grupos de apoio para fortalecer a autoestima e resiliência.
              </p>
              <div class="programCardFooter">
                <span class="programCardLink">Saiba mais →</span>
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
            Transformar o futuro começa agora. De cada menina que descobre sua voz a cada mulher
            que assume um espaço de poder, estamos mudando histórias e construindo um país mais justo.
          </blockquote>
          <div class="testimonialAuthor">
            <div class="testimonialAuthorAvatar">M</div>
            <div class="testimonialAuthorInfo">
              <div class="testimonialAuthorName">Maria da Silva</div>
              <div class="testimonialAuthorRole">Líder Comunitária</div>
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
            <span class="sectionBadgeIcon">🤝</span>
            <span>PARCEIROS</span>
          </div>

          <h2 class="sectionTitle">
            Quem Apoia<br>
            <span class="sectionTitleAccent">Nossa Causa</span>
          </h2>

          <p class="supportersSubtitle">
            Com o apoio de quem acredita na transformação, seguimos formando<br class="hideOnMobile">
            meninas e mulheres para liderar o futuro.
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
          <div class="supporterCard">
            <div class="supporterCardInner">Apoiador 6</div>
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
            <span>CONTATO</span>
          </div>

          <h2 class="sectionTitle">
            Vamos Conversar?
          </h2>

          <p class="contactDescription">
            Tem dúvidas, sugestões ou quer conhecer melhor nosso trabalho?
            Entre em contato conosco!
          </p>

          <div class="contactMethods">
            <div class="contactMethodCard">
              <div class="contactMethodIcon">📧</div>
              <div class="contactMethodContent">
                <div class="contactMethodLabel">E-mail</div>
                <div class="contactMethodValue">contato@elaspodem.org</div>
              </div>
            </div>

            <div class="contactMethodCard">
              <div class="contactMethodIcon">📱</div>
              <div class="contactMethodContent">
                <div class="contactMethodLabel">WhatsApp</div>
                <div class="contactMethodValue">(11) 99999-9999</div>
              </div>
            </div>

            <div class="contactMethodCard">
              <div class="contactMethodIcon">📍</div>
              <div class="contactMethodContent">
                <div class="contactMethodLabel">Endereço</div>
                <div class="contactMethodValue">São Paulo, SP - Brasil</div>
              </div>
            </div>
          </div>
        </div>

        <div class="contactFormWrapper animateOnScroll">
          <div class="contactFormCard">
            <form class="contactForm">
              <div class="formGroup">
                <label class="formLabel">Nome completo</label>
                <input type="text" class="formInput" placeholder="Seu nome completo" required>
              </div>

              <div class="formGroup">
                <label class="formLabel">E-mail</label>
                <input type="email" class="formInput" placeholder="seu@email.com" required>
              </div>

              <div class="formGroup">
                <label class="formLabel">Assunto</label>
                <select class="formInput">
                  <option>Selecione o assunto</option>
                  <option>Quero ser voluntária</option>
                  <option>Quero doar</option>
                  <option>Parcerias</option>
                  <option>Dúvidas gerais</option>
                </select>
              </div>

              <div class="formGroup">
                <label class="formLabel">Mensagem</label>
                <textarea class="formInput formTextarea" rows="5" placeholder="Escreva sua mensagem aqui..." required></textarea>
              </div>

              <button type="submit" class="btnFormSubmit">
                <span>Enviar Mensagem</span>
                <span class="btnIconArrow">→</span>
                <div class="btnShine"></div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final - IMPACTANTE -->
    <section class="ctaSection">
      <div class="ctaGradientBg"></div>
      <div class="ctaContainer animateOnScroll">
        <div class="ctaContent">
          <h2 class="ctaTitle">Juntas Somos Mais Fortes</h2>
          <p class="ctaSubtitle">
            Sua contribuição pode mudar a vida de uma mulher e transformar toda uma comunidade.<br>
            Faça parte dessa transformação!
          </p>
          <div class="ctaActions">
            <button class="btnCtaPrimary">
              <span class="btnIcon">💜</span>
              <span>Doar Agora</span>
              <div class="btnShine"></div>
            </button>
            <button class="btnCtaSecondary">
              <span>Conhecer Projetos</span>
              <span class="btnIconArrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ============================================
   VARIÁVEIS E RESET
   ============================================ */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.pageWrapper {
  min-height: 100vh;
  background: #0a0a0a;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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

@media (max-width: 768px) {
  .customNavbar :deep(.cbNavbar__logoSection) {
    margin-left: 1rem;
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
  padding: 8rem 2rem 4rem;
  overflow: hidden;
  background: #0a0a0a;
}

/* Gradiente de fundo animado */
.heroGradientBg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    rgba(147, 51, 234, 0.1) 0%,
    rgba(192, 132, 252, 0.05) 50%,
    rgba(236, 72, 153, 0.1) 100%
  );
  animation: gradientPulse 8s ease-in-out infinite;
}

@keyframes gradientPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

/* Orbs de gradiente flutuantes */
.heroGradientOrb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
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
  0%, 100% {
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
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.5;
}

/* Conteúdo do Hero */
.heroContent {
  position: relative;
  z-index: 2;
  max-width: 1000px;
  text-align: center;
}

/* Badge superior */
.heroBadge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.heroBadge:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(147, 51, 234, 0.3);
  transform: translateY(-2px);
}

.heroBadgeIcon {
  font-size: 1rem;
}

/* Título com gradiente animado */
.heroTitle {
  font-size: clamp(3.5rem, 10vw, 7rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
  color: #ffffff;
  text-transform: uppercase;
}

.heroTitleGradient {
  background: linear-gradient(135deg, #c084fc 0%, #ec4899 50%, #f97316 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% auto;
  animation: gradientShift 8s ease infinite;
  display: inline-block;
  text-shadow: 0 0 80px rgba(192, 132, 252, 0.3);
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 100% center; }
}

/* Subtítulo */
.heroSubtitle {
  font-size: clamp(1.125rem, 2.5vw, 1.375rem);
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.7);
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

.btnHeroPrimary {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.125rem 2.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #9333ea 0%, #c084fc 100%);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 40px rgba(147, 51, 234, 0.4);
}

.btnHeroPrimary:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 60px rgba(147, 51, 234, 0.6);
}

.btnHeroPrimary:active {
  transform: translateY(-1px);
}

.btnHeroSecondary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.125rem 2.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  cursor: pointer;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btnHeroSecondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(147, 51, 234, 0.5);
  transform: translateY(-3px);
  box-shadow: 0 10px 40px rgba(147, 51, 234, 0.3);
}

.btnIcon {
  font-size: 1.25rem;
  display: inline-flex;
}

.btnIconArrow {
  font-size: 1.25rem;
  display: inline-flex;
  transition: transform 0.3s ease;
}

.btnHeroSecondary:hover .btnIconArrow,
.btnPrimary:hover .btnIconArrow {
  transform: translateX(4px);
}

/* Efeito Shine */
.btnShine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  transition: left 0.6s ease;
}

.btnHeroPrimary:hover .btnShine,
.btnCtaPrimary:hover .btnShine,
.btnFormSubmit:hover .btnShine {
  left: 100%;
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
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.heroStatCard:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(147, 51, 234, 0.3);
  transform: translateY(-5px);
  box-shadow: 0 20px 60px rgba(147, 51, 234, 0.2);
}

.heroStatIcon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.heroStatNumber {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #c084fc 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.heroStatLabel {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Scroll Indicator */
.heroScrollIndicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, 10px); }
}

.heroScrollMouse {
  width: 28px;
  height: 46px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  position: relative;
}

.heroScrollWheel {
  width: 3px;
  height: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 2px;
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  animation: scrollWheel 2s ease-in-out infinite;
}

@keyframes scrollWheel {
  0% { top: 8px; opacity: 1; }
  50% { top: 18px; opacity: 0.5; }
  100% { top: 8px; opacity: 1; }
}

/* ============================================
   COMPONENTES REUTILIZÁVEIS
   ============================================ */
.sectionBadge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: rgba(147, 51, 234, 0.1);
  border: 1px solid rgba(147, 51, 234, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: #c084fc;
  margin-bottom: 1.5rem;
}

.sectionBadgeIcon {
  font-size: 1rem;
}

.sectionTitle {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin-bottom: 1.5rem;
}

.sectionTitleAccent {
  background: linear-gradient(135deg, #c084fc 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ============================================
   MISSION SECTION
   ============================================ */
.missionSection {
  padding: 8rem 2rem;
  background: #0a0a0a;
  position: relative;
}

.missionContainer {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

.missionText {
  font-size: 1.125rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1.5rem;
}

.btnPrimary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #9333ea 0%, #c084fc 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.btnPrimary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(147, 51, 234, 0.4);
}

.missionVisual {
  position: relative;
}

.missionImageCard {
  position: relative;
  height: 500px;
  background: linear-gradient(135deg,
    rgba(147, 51, 234, 0.2) 0%,
    rgba(192, 132, 252, 0.1) 50%,
    rgba(236, 72, 153, 0.2) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.missionImageOverlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 0%, rgba(10, 10, 10, 0.5) 100%);
}

.missionImageContent {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.missionImageIcon {
  font-size: 4rem;
}

.missionImageText {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

/* ============================================
   PROGRAMS SECTION
   ============================================ */
.programsSection {
  padding: 8rem 2rem;
  background: #0a0a0a;
}

.programsContainer {
  max-width: 1400px;
  margin: 0 auto;
}

.programsHeader {
  text-align: center;
  margin-bottom: 4rem;
}

.programsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.programCard {
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 2.5rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.programCard:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(147, 51, 234, 0.3);
  transform: translateY(-8px);
  box-shadow: 0 30px 80px rgba(147, 51, 234, 0.2);
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
  width: 70px;
  height: 70px;
  border-radius: 18px;
  margin-bottom: 1.5rem;
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
  font-size: 2rem;
}

.programTitle {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
}

.programDescription {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1.5rem;
}

.programCardFooter {
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.programCardLink {
  font-size: 0.9rem;
  font-weight: 600;
  color: #c084fc;
  cursor: pointer;
  transition: all 0.2s ease;
}

.programCardLink:hover {
  color: #ec4899;
}

/* ============================================
   TESTIMONIAL SECTION
   ============================================ */
.testimonialSection {
  padding: 8rem 2rem;
  background: #0a0a0a;
}

.testimonialContainer {
  max-width: 1000px;
  margin: 0 auto;
}

.testimonialCard {
  position: relative;
  padding: 4rem 3rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  overflow: hidden;
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
  position: relative;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-style: italic;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
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
  background: linear-gradient(135deg, #9333ea 0%, #c084fc 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}

.testimonialAuthorName {
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.25rem;
}

.testimonialAuthorRole {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
}

/* ============================================
   SUPPORTERS SECTION
   ============================================ */
.supportersSection {
  padding: 8rem 2rem;
  background: #0a0a0a;
}

.supportersContainer {
  max-width: 1400px;
  margin: 0 auto;
}

.supportersHeader {
  text-align: center;
  margin-bottom: 4rem;
}

.supportersSubtitle {
  font-size: 1.125rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.6);
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
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.supporterCard:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(147, 51, 234, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(147, 51, 234, 0.15);
}

.supporterCardInner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
}

/* ============================================
   CONTACT SECTION
   ============================================ */
.contactSection {
  padding: 8rem 2rem;
  background: #0a0a0a;
}

.contactContainer {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 5rem;
  align-items: start;
}

.contactDescription {
  font-size: 1.125rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 3rem;
}

.contactMethods {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contactMethodCard {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.contactMethodCard:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(147, 51, 234, 0.3);
  transform: translateX(5px);
}

.contactMethodIcon {
  font-size: 2rem;
  flex-shrink: 0;
}

.contactMethodLabel {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.5rem;
}

.contactMethodValue {
  font-size: 1.125rem;
  font-weight: 500;
  color: #ffffff;
}

/* Formulário */
.contactFormCard {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 3rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
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
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.formInput {
  width: 100%;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.formInput:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(147, 51, 234, 0.5);
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.formInput::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.formTextarea {
  resize: vertical;
  min-height: 120px;
}

.btnFormSubmit {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.125rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #9333ea 0%, #c084fc 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.btnFormSubmit:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(147, 51, 234, 0.4);
}

/* ============================================
   CTA SECTION
   ============================================ */
.ctaSection {
  position: relative;
  padding: 8rem 2rem;
  background: #0a0a0a;
  overflow: hidden;
}

.ctaGradientBg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    rgba(147, 51, 234, 0.15) 0%,
    rgba(192, 132, 252, 0.1) 50%,
    rgba(236, 72, 153, 0.15) 100%
  );
}

.ctaContainer {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
}

.ctaContent {
  text-align: center;
  padding: 4rem 3rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.ctaTitle {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1.5rem;
}

.ctaSubtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 3rem;
}

.ctaActions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btnCtaPrimary {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #9333ea 0%, #c084fc 100%);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 15px 50px rgba(147, 51, 234, 0.4);
}

.btnCtaPrimary:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 60px rgba(147, 51, 234, 0.6);
}

.btnCtaSecondary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btnCtaSecondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(147, 51, 234, 0.5);
  transform: translateY(-3px);
  box-shadow: 0 10px 40px rgba(147, 51, 234, 0.3);
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
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
