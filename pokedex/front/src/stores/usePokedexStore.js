// front/src/stores/usePokedexStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

const POKEAPI = 'https://pokeapi.co/api/v2'
const BACKEND = 'http://localhost:3000' // ajustá si tu backend corre en otro puerto

export const usePokedexStore = defineStore('pokedex', {
  state: () => ({
    listaPokemon: [],    // { id, nombre, imagen, tipos:[], habilidades:[] }
    equipoPersonal: [],  // { id, nombre, imagen, tipos }
    filtro: '',
    cargando: false,
    error: null
  }),
  getters: {
    listaFiltrada: (state) => {
      const f = state.filtro.trim().toLowerCase()
      if (!f) return state.listaPokemon
      return state.listaPokemon.filter(p => p.nombre.toLowerCase().includes(f))
    }
  },
  actions: {
    // Cargar lista de 151 y luego detalles por cada pokemon
    async cargarPokemon() {
      try {
        this.cargando = true
        this.error = null

        const { data } = await axios.get(`${POKEAPI}/pokemon?limit=151`)
        // data.results => [{name, url}, ...]
        const detalles = await Promise.all(
          data.results.map(async item => {
            try {
              const r = await axios.get(item.url)
              const d = r.data
              return {
                id: d.id,
                nombre: d.name,
                imagen: d.sprites.front_default || d.sprites.other?.['official-artwork']?.front_default || '',
                tipos: d.types.map(t => t.type.name),
                habilidades: d.abilities.map(a => a.ability.name),
                peso: d.weight,
                altura: d.height
              }
            } catch (e) {
              return null
            }
          })
        )

        this.listaPokemon = detalles.filter(Boolean).sort((a,b)=>a.id-b.id)
      } catch (err) {
        console.error('Error cargarPokemon', err)
        this.error = 'No se pudo cargar pokemons'
      } finally {
        this.cargando = false
      }
    },

    // Alternar en equipo (agregar/quitar). Máximo 6.
    togglePokemonEquipe(pokemon) {
      const existe = this.equipoPersonal.find(p => p.id === pokemon.id)
      if (existe) {
        this.equipoPersonal = this.equipoPersonal.filter(p => p.id !== pokemon.id)
      } else {
        if (this.equipoPersonal.length >= 6) return
        this.equipoPersonal.push({
          id: pokemon.id,
          nombre: pokemon.nombre,
          imagen: pokemon.imagen,
          tipos: pokemon.tipos
        })
      }
    },

    // alias con el nombre que usás en los componentes
    togglePokemonEquipo(pokemon) {
      this.togglePokemonEquipe(pokemon)
    },

    // Cargar equipo guardado en MySQL (backend)
    async cargarEquipoDesdeBD() {
      try {
        const { data } = await axios.get(`${BACKEND}/equipo`)
        // data: [{id, nombre, imagen}, ...]
        this.equipoPersonal = Array.isArray(data) ? data.map(p => ({
          id: p.id,
          nombre: p.nombre,
          imagen: p.imagen,
          tipos: [] // si querés, podés completar tipos buscando en listaPokemon por id
        })) : []
      } catch (err) {
        console.warn('No se pudo cargar equipo desde backend', err.message)
        this.equipoPersonal = []
      }
    },

    // Guardar equipo actual en MySQL (POST)
    async guardarEquipoEnBD() {
      try {
        // enviamos solo campos necesarios
        const payload = this.equipoPersonal.map(p => ({
          id: p.id,
          nombre: p.nombre,
          imagen: p.imagen
        }))
        const { data } = await axios.post(`${BACKEND}/equipo`, { equipo: payload })
        return { ok: true, data }
      } catch (err) {
        console.error('Error guardarEquipoEnBD', err)
        return { ok: false, error: err.message }
      }
    }
  }
})
