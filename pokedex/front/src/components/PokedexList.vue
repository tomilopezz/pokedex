<!-- src/components/PokedexList.vue -->
<template>
  <div>
    <input
      v-model="busqueda"
      type="text"
      placeholder="Buscar Pokémon..."
      class="input-busqueda"
    />

    <div class="grid">
      <PokemonCard
        v-for="pokemon in filtrados"
        :key="pokemon.id"
        :pokemon="pokemon"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { usePokedexStore } from "@/stores/usePokedexStore";
import PokemonCard from "./PokemonCard.vue";

const store = usePokedexStore();

const busqueda = ref("");

onMounted(() => {
  store.cargarPokemon();
});

// Getter por filtro
const filtrados = computed(() =>
  store.listaPokemon.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
);
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.input-busqueda {
  padding: 10px;
  margin-bottom: 15px;
  width: 100%;
}
</style>
