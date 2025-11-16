<template>
  <div class="home-view">
    <section class="upload-section">
      <TournamentUpload />
    </section>

    <section class="tournaments-section">
      <TournamentList />
    </section>
  </div>
</template>

<script setup lang="ts">
import TournamentUpload from '@/components/TournamentUpload.vue'
import TournamentList from '@/components/TournamentList.vue'
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: #f7fafc;
}

.upload-section {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 2rem 0;
}

.tournaments-section {
  padding: 2rem 0;
}
</style>
