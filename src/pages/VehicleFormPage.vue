<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVehiclesStore } from 'stores/vehicles';
import { Notify } from 'quasar';
import GlassCard from 'components/GlassCard.vue';
import GlassButton from 'components/GlassButton.vue';

const route = useRoute();
const router = useRouter();
const vehiclesStore = useVehiclesStore();

const isEditing = computed(() => !!route.params['id']);
const vehicleId = computed(() => parseInt(route.params['id'] as string));
const saving = ref(false);

const form = reactive({
  brand: '',
  model: '',
  year_model: undefined as number | undefined,
  mileage: 0,
});

onMounted(async () => {
  if (isEditing.value) {
    if (vehiclesStore.vehicles.length === 0) {
      await vehiclesStore.fetchVehicles();
    }
    const vehicle = vehiclesStore.vehicles.find((v) => v.id === vehicleId.value);
    if (vehicle) {
      form.brand = vehicle.brand;
      form.model = vehicle.model || '';
      form.year_model = vehicle.year_model;
      form.mileage = vehicle.mileage;
    }
  }
});

const save = async () => {
  if (!form.brand.trim() || form.mileage < 0) {
    Notify.create({ type: 'negative', message: 'Preencha todos os campos obrigatórios corretamente' });
    return;
  }

  saving.value = true;
  try {
    const vehicleData = {
      brand: form.brand,
      model: form.model,
      mileage: form.mileage,
      ...(form.year_model !== undefined && { year_model: form.year_model }),
    };

    if (isEditing.value) {
      await vehiclesStore.updateVehicle(vehicleId.value, vehicleData);
      Notify.create({ type: 'positive', message: 'Veículo atualizado com sucesso' });
    } else {
      await vehiclesStore.createVehicle(vehicleData);
      Notify.create({ type: 'positive', message: 'Veículo adicionado com sucesso' });
    }
    await router.push('/');
  } catch (error) {
    console.error('Error saving vehicle:', error);
    Notify.create({ type: 'negative', message: 'Erro ao salvar veículo' });
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <q-page class="glass-page q-pa-md">
    <div class="row items-center q-mb-lg q-pt-sm">
      <glass-button variant="ghost" round icon="arrow_back" class="q-mr-sm" @click="$router.push('/')" />
      <div>
        <div class="section-eyebrow">Veículos</div>
        <h1 class="page-title q-ma-none">{{ isEditing ? 'Editar Veículo' : 'Novo Veículo' }}</h1>
      </div>
    </div>

    <glass-card>
      <q-card-section class="q-pa-lg">
        <q-form @submit="save" class="q-gutter-md">
          <q-input v-model="form.brand" label="Marca *" required outlined class="glass-input" />
          <q-input v-model="form.model" label="Modelo" outlined class="glass-input" />
          <q-input
            v-model.number="form.year_model"
            label="Ano do Modelo"
            type="number"
            outlined
            class="glass-input"
          />
          <q-input
            v-model.number="form.mileage"
            label="Quilometragem Atual *"
            type="number"
            required
            outlined
            class="glass-input"
          />

          <div class="row q-gutter-sm q-pt-sm">
            <glass-button variant="ghost" @click="$router.push('/')">Cancelar</glass-button>
            <glass-button class="col" type="submit" variant="primary" :loading="saving">Salvar</glass-button>
          </div>
        </q-form>
      </q-card-section>
    </glass-card>
  </q-page>
</template>

<style scoped>
.section-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--glass-text-muted);
  margin-bottom: 2px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--glass-text-primary);
}
</style>
