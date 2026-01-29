<script setup lang="ts">
import { CBButton } from '@cb/components'
import '@cb/components/style.css'
</script>

<template>
  <div class="page">
    <div class="container">
      <h1>CBButton Demo - CSS Variables Only</h1>

      <!-- Variants -->
      <section class="section">
        <h2>Variants</h2>
        <div class="grid">
          <CBButton>Solid (default)</CBButton>
          <CBButton variant="outline">Outline</CBButton>
          <CBButton variant="ghost">Ghost</CBButton>
          <CBButton variant="link">Link</CBButton>
        </div>
      </section>

      <!-- Semantic Colors - Solid -->
      <section class="section">
        <h2>Semantic Colors - Solid</h2>
        <div class="grid">
          <CBButton color="primary">Primary</CBButton>
          <CBButton color="secondary">Secondary</CBButton>
          <CBButton color="success">Success</CBButton>
          <CBButton color="warning">Warning</CBButton>
          <CBButton color="destructive">Destructive</CBButton>
        </div>
      </section>

      <!-- Semantic Colors - Outline -->
      <section class="section">
        <h2>Semantic Colors - Outline</h2>
        <div class="grid">
          <CBButton variant="outline" color="primary">Primary</CBButton>
          <CBButton variant="outline" color="secondary">Secondary</CBButton>
          <CBButton variant="outline" color="success">Success</CBButton>
          <CBButton variant="outline" color="warning">Warning</CBButton>
          <CBButton variant="outline" color="destructive">Destructive</CBButton>
        </div>
      </section>

      <!-- Semantic Colors - Ghost -->
      <section class="section">
        <h2>Semantic Colors - Ghost</h2>
        <div class="grid">
          <CBButton variant="ghost" color="primary">Primary</CBButton>
          <CBButton variant="ghost" color="secondary">Secondary</CBButton>
          <CBButton variant="ghost" color="success">Success</CBButton>
          <CBButton variant="ghost" color="warning">Warning</CBButton>
          <CBButton variant="ghost" color="destructive">Destructive</CBButton>
        </div>
      </section>

      <!-- Custom Colors -->
      <section class="section">
        <h2>Custom Colors</h2>
        <div class="grid">
          <CBButton color="#9333ea">Purple HEX</CBButton>
          <CBButton color="rgb(236, 72, 153)">Pink RGB</CBButton>
          <CBButton color="rgba(22, 163, 74, 0.8)">Green RGBA</CBButton>
        </div>
      </section>

      <!-- Custom Colors Outline -->
      <section class="section">
        <h2>Custom Colors - Outline</h2>
        <div class="grid">
          <CBButton variant="outline" color="#9333ea">Purple</CBButton>
          <CBButton variant="outline" color="#ec4899">Pink</CBButton>
          <CBButton variant="outline" color="#16a34a">Green</CBButton>
        </div>
      </section>

      <!-- Sizes -->
      <section class="section">
        <h2>Sizes</h2>
        <div class="grid">
          <CBButton size="xs">Extra Small</CBButton>
          <CBButton size="sm">Small</CBButton>
          <CBButton size="default">Default</CBButton>
          <CBButton size="lg">Large</CBButton>
        </div>
      </section>

      <!-- With Icons - Lucide -->
      <section class="section">
        <h2>Icons - Lucide</h2>
        <div class="grid">
          <CBButton prepend-icon="rocket">Launch</CBButton>
          <CBButton prepend-icon="home" variant="outline">Home</CBButton>
          <CBButton prepend-icon="heart" color="destructive">Like</CBButton>
          <CBButton append-icon="arrow-right" color="primary">Next</CBButton>
          <CBButton prepend-icon="save" append-icon="check">Save</CBButton>
        </div>
      </section>

      <!-- Icons - More Lucide -->
      <section class="section">
        <h2>Icons - More Lucide</h2>
        <div class="grid">
          <CBButton prepend-icon="user" color="primary">User</CBButton>
          <CBButton prepend-icon="settings" color="secondary">Settings</CBButton>
          <CBButton prepend-icon="github" variant="outline">GitHub</CBButton>
          <CBButton prepend-icon="star" color="#FFD700">Star</CBButton>
          <CBButton prepend-icon="zap" color="rgb(234, 179, 8)">Lightning</CBButton>
        </div>
      </section>

      <!-- Loading State -->
      <section class="section">
        <h2>Loading State</h2>
        <div class="grid">
          <CBButton :loading="true">Loading</CBButton>
          <CBButton variant="outline" :loading="true">Loading</CBButton>
          <CBButton color="success" :loading="true">Loading</CBButton>
        </div>
      </section>

      <!-- Disabled -->
      <section class="section">
        <h2>Disabled</h2>
        <div class="grid">
          <CBButton :disabled="true">Disabled</CBButton>
          <CBButton variant="outline" :disabled="true">Disabled</CBButton>
          <CBButton color="destructive" :disabled="true">Disabled</CBButton>
        </div>
      </section>

      <!-- Block -->
      <section class="section">
        <h2>Block (Full Width)</h2>
        <CBButton :block="true">Block Button</CBButton>
        <CBButton variant="outline" color="primary" :block="true">Block Outline</CBButton>
      </section>

      <!-- Rounded -->
      <section class="section">
        <h2>Rounded</h2>
        <div class="grid">
          <CBButton :rounded="false">No Radius</CBButton>
          <CBButton rounded="sm">Small Radius</CBButton>
          <CBButton rounded="default">Default</CBButton>
          <CBButton rounded="lg">Large Radius</CBButton>
          <CBButton :rounded="true">Full</CBButton>
          <CBButton :rounded="20">20px</CBButton>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
}

.section {
  background: white;
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #666;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  align-items: center;
}
</style>
