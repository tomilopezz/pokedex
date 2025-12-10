<!-- src/components/PokemonCard.vue -->
<template>
  <div class="pokemon-card" @click="toggleEquipo">
    <img :src="pokemon.imagen" class="pokemon-img" />
    <h3>{{ pokemon.nombre }}</h3>

    <div class="tipos">
      <span v-for="tipo in pokemon.tipos" :key="tipo" class="tipo">
        {{ tipo }}
      </span>
    </div>

    <p v-if="enEquipo" class="seleccionado">✔ En el equipo</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { usePokedexStore } from "@/stores/usePokedexStore";

const props = defineProps({
  pokemon: Object
});

const store = usePokedexStore();

const enEquipo = computed(() =>
  store.equipoPersonal.some(p => p.id === props.pokemon.id)
);

const toggleEquipo = () => {
  store.togglePokemonEquipo(props.pokemon);
};
</script>

<style scoped>
.pokemon-card {
  cursor: pointer;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: center;
}
.seleccionado {
  color: green;
  font-weight: bold;
}
</style>
