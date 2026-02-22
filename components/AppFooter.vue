<script setup lang="ts">
import { CBImage, CBLabel, CBIcon } from '@cb/components';
</script>

<template>
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
</template>

<style scoped>
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
}
</style>
