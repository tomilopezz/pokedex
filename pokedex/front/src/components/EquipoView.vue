<!-- src/components/EquipoView.vue -->
<template>
  <div>
    <h2>Equipo Personal</h2>

    <div v-if="equipo.length === 0">
      <p>No hay Pokémon en el equipo.</p>
    </div>

    <div class="grid">
      <PokemonCard
        v-for="pokemon in equipo"
        :key="pokemon.id"
        :pokemon="pokemon"
      />
    </div>

    <button @click="guardarEquipo" class="btn-guardar">
      Guardar Equipo
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { usePokedexStore } from "@/stores/usePokedexStore";
import PokemonCard from "./PokemonCard.vue";

const store = usePokedexStore();

onMounted(() => {
  store.cargarEquipoDesdeBD();
});

const equipo = computed(() => store.equipoPersonal);

const guardarEquipo = () => {
  store.guardarEquipoEnBD();
};
</script>

<style scoped>
.btn-guardar {
  margin-top: 20px;
  padding: 10px 20px;
  background: #4caf50;
  color: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
</style>
