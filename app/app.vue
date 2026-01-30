<script setup lang="ts">
import { ref } from 'vue'
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
</script>

<template>
  <div>
    <!-- Navbar -->
    <CBNavbar
      :menu-items="menuItems"
      :current-path="currentPath"
      menu-style="folder"
      placement="fixed"
      :elevation="2"
      @navigate="handleNavigate"
      @logo-click="handleLogoClick"
      class="customNavbar"
    />

    <!-- Hero Section -->
    <section class="hero">
      <div class="heroOverlay"></div>
      <div class="heroContent">
        <div class="heroTag">JUNTAS SOMOS MAIS FORTES</div>
        <h1 class="heroTitle">ELAS<br><span class="heroTitleAccent">PODEM</span></h1>
        <p class="heroSubtitle">
          Investimos em mulheres corajosas que lideram movimentos de transformação social.
          Cada contribuição fortalece a luta por direitos, igualdade e justiça.
        </p>
        <div class="heroActions">
          <CBButton size="lg" color="primary" prepend-icon="heart">
            Doe Agora
          </CBButton>
          <CBButton size="lg" variant="ghost" prepend-icon="arrow-right" class="heroSecondaryBtn">
            Nossa História
          </CBButton>
        </div>
        <div class="heroStats">
          <div class="heroStatItem">
            <div class="heroStatNumber">2.500+</div>
            <div class="heroStatLabel">Mulheres Impactadas</div>
          </div>
          <div class="heroStatItem">
            <div class="heroStatNumber">45</div>
            <div class="heroStatLabel">Comunidades</div>
          </div>
          <div class="heroStatItem">
            <div class="heroStatNumber">R$ 1.2M</div>
            <div class="heroStatLabel">Investidos</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="mission">
      <div class="missionContainer">
        <div class="missionText">
          <h2 class="sectionTitle">Nossa Missão</h2>
          <p class="missionDescription">
            Acreditamos que toda mulher tem o direito de viver com dignidade, segurança e autonomia.
            Trabalhamos incansavelmente para oferecer suporte educacional, econômico e emocional
            para mulheres em situação de vulnerabilidade.
          </p>
          <p class="missionDescription">
            Através de programas de capacitação profissional, educação financeira e apoio psicológico,
            ajudamos mulheres a reconstruírem suas vidas e se tornarem agentes de mudança em suas comunidades.
          </p>
          <CBButton color="primary" append-icon="arrow-right">
            Saiba Mais Sobre Nós
          </CBButton>
        </div>
        <div class="missionImage">
          <div class="imagePlaceholder">
            <span>Imagem Inspiradora</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Programs -->
    <section class="programs">
      <div class="programsContainer">
        <h2 class="sectionTitle">Como Fazemos a Diferença</h2>
        <div class="programsGrid">
          <div class="programCard">
            <div class="programIcon">📚</div>
            <h3 class="programTitle">Educação e Capacitação</h3>
            <p class="programDescription">
              Oferecemos cursos profissionalizantes, workshops e treinamentos que preparam mulheres para o mercado de trabalho.
            </p>
          </div>
          <div class="programCard">
            <div class="programIcon">💼</div>
            <h3 class="programTitle">Empreendedorismo</h3>
            <p class="programDescription">
              Apoiamos mulheres a criarem e desenvolverem seus próprios negócios com mentoria e microcrédito.
            </p>
          </div>
          <div class="programCard">
            <div class="programIcon">🤝</div>
            <h3 class="programTitle">Rede de Apoio</h3>
            <p class="programDescription">
              Criamos uma comunidade forte onde mulheres se apoiam mutuamente e compartilham experiências.
            </p>
          </div>
          <div class="programCard">
            <div class="programIcon">💪</div>
            <h3 class="programTitle">Saúde Mental</h3>
            <p class="programDescription">
              Oferecemos acompanhamento psicológico e grupos de apoio para fortalecer a autoestima e resiliência.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonial/Quote Section -->
    <section class="testimonial">
      <div class="testimonialContainer">
        <div class="testimonialQuote">"</div>
        <blockquote class="testimonialText">
          Transformar o futuro começa agora. De cada menina que descobre sua voz a cada mulher que assume um espaço de poder, estamos mudando histórias e construindo um país mais justo.
        </blockquote>
        <div class="testimonialAuthor">— Maria da Silva, Líder Comunitária</div>
      </div>
    </section>

    <!-- Supporters Section -->
    <section class="supporters">
      <div class="supportersContainer">
        <h2 class="sectionTitle">Quem Apoia Nossa Causa</h2>
        <p class="supportersSubtitle">
          Com o apoio de quem acredita na transformação, seguimos formando meninas e mulheres para liderar o futuro.
        </p>
        <div class="supportersGrid">
          <div class="supporterCard">Apoiador 1</div>
          <div class="supporterCard">Apoiador 2</div>
          <div class="supporterCard">Apoiador 3</div>
          <div class="supporterCard">Apoiador 4</div>
          <div class="supporterCard">Apoiador 5</div>
          <div class="supporterCard">Apoiador 6</div>
        </div>
      </div>
    </section>

    <!-- Network/Partnerships Section -->
    <section class="network">
      <div class="networkContainer">
        <div class="networkHeader">
          <h2 class="sectionTitle">Quer Fazer Parte de Uma Rede que Transforma?</h2>
          <p class="networkDescription">
            A transformação acontece em rede! Junte-se a organizações, empresas e pessoas que acreditam no poder das mulheres.
          </p>
          <CBButton size="lg" color="primary" prepend-icon="users">
            Quero Fazer Parte
          </CBButton>
        </div>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section class="contact">
      <div class="contactContainer">
        <div class="contactInfo">
          <h2 class="sectionTitle">Fale Conosco</h2>
          <p class="contactDescription">
            Tem dúvidas, sugestões ou quer conhecer melhor nosso trabalho? Entre em contato conosco!
          </p>
          <div class="contactMethods">
            <div class="contactMethod">
              <div class="contactMethodIcon">📧</div>
              <div class="contactMethodText">
                <div class="contactMethodLabel">E-mail</div>
                <div class="contactMethodValue">contato@elaspodem.org</div>
              </div>
            </div>
            <div class="contactMethod">
              <div class="contactMethodIcon">📱</div>
              <div class="contactMethodText">
                <div class="contactMethodLabel">WhatsApp</div>
                <div class="contactMethodValue">(11) 99999-9999</div>
              </div>
            </div>
            <div class="contactMethod">
              <div class="contactMethodIcon">📍</div>
              <div class="contactMethodText">
                <div class="contactMethodLabel">Endereço</div>
                <div class="contactMethodValue">São Paulo, SP - Brasil</div>
              </div>
            </div>
          </div>
        </div>
        <div class="contactForm">
          <form class="form">
            <div class="formGroup">
              <label class="formLabel">Nome completo *</label>
              <input type="text" class="formInput" placeholder="Seu nome" required>
            </div>
            <div class="formGroup">
              <label class="formLabel">E-mail *</label>
              <input type="email" class="formInput" placeholder="seu@email.com" required>
            </div>
            <div class="formGroup">
              <label class="formLabel">Assunto *</label>
              <select class="formInput">
                <option>Selecione o assunto</option>
                <option>Quero ser voluntária</option>
                <option>Quero doar</option>
                <option>Parcerias</option>
                <option>Dúvidas gerais</option>
              </select>
            </div>
            <div class="formGroup">
              <label class="formLabel">Mensagem *</label>
              <textarea class="formInput formTextarea" rows="5" placeholder="Escreva sua mensagem" required></textarea>
            </div>
            <CBButton type="submit" color="primary" prepend-icon="send" :block="true">
              Enviar Mensagem
            </CBButton>
          </form>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="ctaContent">
        <h2 class="ctaTitle">Juntas Somos Mais Fortes</h2>
        <p class="ctaSubtitle">
          Sua contribuição pode mudar a vida de uma mulher e transformar toda uma comunidade. Faça parte dessa transformação!
        </p>
        <div class="ctaActions">
          <CBButton size="lg" color="primary" prepend-icon="heart">
            Doar Agora
          </CBButton>
          <CBButton size="lg" variant="ghost" class="ctaSecondaryBtn" prepend-icon="arrow-right">
            Conhecer Projetos
          </CBButton>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Navbar customization */
.customNavbar :deep(.cbNavbar__logoSection) {
  margin-left: 80px;
}

.customNavbar :deep(.cbNavbar__menuContainer) {
  justify-content: center;
}

/* Hero Section */
.hero {
  position: relative;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6b21a8 0%, #9333ea 50%, #c084fc 100%);
  padding: 6rem 2rem 4rem;
  overflow: hidden;
}

.heroOverlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(192, 132, 252, 0.2) 0%, transparent 50%);
  pointer-events: none;
}

.heroContent {
  position: relative;
  max-width: 1100px;
  text-align: center;
  z-index: 1;
}

.heroTag {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 2px;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.heroTitle {
  font-size: 6rem;
  font-weight: 900;
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1;
  letter-spacing: -2px;
  text-transform: uppercase;
}

.heroTitleAccent {
  color: #D228F4;
  text-shadow: 0 0 40px rgba(210, 40, 244, 0.5);
}

.heroSubtitle {
  font-size: 1.375rem;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 3rem;
  line-height: 1.7;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
}

.heroActions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
}

.heroSecondaryBtn {
  color: white !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
}

.heroSecondaryBtn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: white !important;
}

.heroStats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  max-width: 700px;
  margin: 0 auto;
  padding-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.heroStatItem {
  text-align: center;
}

.heroStatNumber {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.heroStatLabel {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

/* Impact Section */
.impact {
  background: white;
  padding: 4rem 2rem;
}

.impactContainer {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.impactCard {
  text-align: center;
  padding: 2rem;
}

.impactNumber {
  font-size: 3rem;
  font-weight: 700;
  color: #9333ea;
  margin-bottom: 0.5rem;
}

.impactLabel {
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
}

/* Mission Section */
.mission {
  background: #F9FAFB;
  padding: 5rem 2rem;
}

.missionContainer {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.sectionTitle {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.missionDescription {
  font-size: 1.125rem;
  color: #64748b;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.missionImage {
  width: 100%;
  height: 400px;
}

.imagePlaceholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #c084fc 0%, #9333ea 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
}

/* Programs Section */
.programs {
  background: white;
  padding: 5rem 2rem;
}

.programsContainer {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.programsContainer .sectionTitle {
  margin-bottom: 3rem;
}

.programsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.programCard {
  background: #F9FAFB;
  padding: 2.5rem 2rem;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.programCard:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.programIcon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.programTitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.programDescription {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
}

/* Testimonial Section */
.testimonial {
  background: white;
  padding: 5rem 2rem;
}

.testimonialContainer {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  position: relative;
}

.testimonialQuote {
  font-size: 10rem;
  font-weight: 700;
  color: #f3e8ff;
  line-height: 1;
  position: absolute;
  top: -3rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 0;
}

.testimonialText {
  position: relative;
  font-size: 1.75rem;
  font-style: italic;
  color: #1e293b;
  line-height: 1.6;
  margin: 0 0 2rem 0;
  z-index: 1;
}

.testimonialAuthor {
  font-size: 1.125rem;
  color: #9333ea;
  font-weight: 600;
}

/* Supporters Section */
.supporters {
  background: #F9FAFB;
  padding: 5rem 2rem;
}

.supportersContainer {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.supportersSubtitle {
  font-size: 1.125rem;
  color: #64748b;
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.supportersGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.supporterCard {
  background: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #64748b;
  font-weight: 600;
  border: 2px solid #E5E7EB;
  transition: all 0.3s ease;
}

.supporterCard:hover {
  border-color: #9333ea;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(147, 51, 234, 0.1);
}

/* Network Section */
.network {
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  padding: 5rem 2rem;
}

.networkContainer {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.networkDescription {
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

/* Contact Section */
.contact {
  background: white;
  padding: 5rem 2rem;
}

.contactContainer {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
}

.contactDescription {
  font-size: 1.125rem;
  color: #64748b;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.contactMethods {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contactMethod {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.contactMethodIcon {
  font-size: 2rem;
  flex-shrink: 0;
}

.contactMethodLabel {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.25rem;
}

.contactMethodValue {
  font-size: 1.125rem;
  color: #1e293b;
  font-weight: 500;
}

/* Form Styles */
.form {
  background: #F9FAFB;
  padding: 2.5rem;
  border-radius: 12px;
}

.formGroup {
  margin-bottom: 1.5rem;
}

.formLabel {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.formInput {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 1rem;
  color: #1e293b;
  background: white;
  transition: all 0.2s ease;
}

.formInput:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.formTextarea {
  resize: vertical;
  font-family: inherit;
}

/* CTA Section */
.cta {
  background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
  padding: 5rem 2rem;
  text-align: center;
}

.ctaSecondaryBtn {
  color: white !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
}

.ctaSecondaryBtn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: white !important;
}

.ctaContent {
  max-width: 800px;
  margin: 0 auto;
}

.ctaTitle {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
}

.ctaSubtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.ctaActions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive */
@media (max-width: 768px) {
  .heroTitle {
    font-size: 3.5rem;
    letter-spacing: -1px;
  }

  .heroSubtitle {
    font-size: 1.125rem;
  }

  .heroStats {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .heroStatNumber {
    font-size: 2rem;
  }

  .missionContainer {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .sectionTitle {
    font-size: 2rem;
  }

  .ctaTitle {
    font-size: 2rem;
  }

  .customNavbar :deep(.cbNavbar__logoSection) {
    margin-left: 1rem;
  }

  .programsGrid {
    grid-template-columns: 1fr;
  }

  .testimonialQuote {
    font-size: 6rem;
    top: -2rem;
  }

  .testimonialText {
    font-size: 1.25rem;
  }

  .supportersGrid {
    grid-template-columns: repeat(2, 1fr);
  }

  .contactContainer {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}
</style>
