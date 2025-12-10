<script setup>
import PokedexList from "./components/PokedexList.vue";
import EquipoView from "./components/EquipoView.vue";
</script>

<template>
  <div class="app">
    <h1 class="titulo">Pokedex</h1>

    <div class="layout">
      <div class="pokedex">
        <PokedexList />
      </div>

      <div class="equipo">
        <EquipoView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.titulo {
  text-align: center;
  margin-bottom: 20px;
}

.layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

/* Columna izquierda */
.pokedex {
  padding-right: 10px;
}

/* Columna derecha */
.equipo {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 10px;
  position: sticky;
  top: 20px;
  height: fit-content;
}
</style>
