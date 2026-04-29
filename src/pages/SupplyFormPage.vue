<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVehiclesStore, type Vehicle } from 'stores/vehicles';
import { useSuppliesStore } from 'stores/supplies';
import { Notify } from 'quasar';
import GlassCard from 'components/GlassCard.vue';
import GlassButton from 'components/GlassButton.vue';

const route = useRoute();
const router = useRouter();
const vehiclesStore = useVehiclesStore();
const suppliesStore = useSuppliesStore();

const vehicleId = computed(() => parseInt(route.params['vehicleId'] as string));
const supplyId = computed(() =>
  route.params['supplyId'] ? parseInt(route.params['supplyId'] as string) : null,
);
const isEditing = computed(() => supplyId.value !== null);
const saving = ref(false);

const vehicle = ref<Vehicle | null>(null);

const form = reactive({
  mileage: 0,
  qtd: 0,
  fuel: 'gasolina',
  total: undefined as number | undefined,
  price_per_liter: undefined as number | undefined,
});

onMounted(async () => {
  if (vehiclesStore.vehicles.length === 0) {
    await vehiclesStore.fetchVehicles();
  }
  vehicle.value = vehiclesStore.vehicles.find((v) => v.id === vehicleId.value) ?? null;

  await suppliesStore.fetchSupplies(vehicleId.value);

  if (isEditing.value) {
    const supply = suppliesStore.supplies.find((s) => s.id === supplyId.value);
    if (supply) {
      form.mileage = supply.mileage;
      form.qtd = supply.qtd;
      form.fuel = supply.fuel;
      form.total = supply.total;
      form.price_per_liter = supply.price_per_liter;
    }
  }
});

const calculatePricePerLiter = () => {
  if (form.total && form.qtd > 0) {
    form.price_per_liter = form.total / form.qtd;
  }
};

const calculateTotal = () => {
  if (form.price_per_liter && form.qtd > 0) {
    form.total = form.price_per_liter * form.qtd;
  }
};

const save = async () => {
  if (!form.mileage || form.qtd <= 0 || !form.fuel) {
    Notify.create({ type: 'negative', message: 'Preencha todos os campos obrigatórios' });
    return;
  }

  const sorted = [...suppliesStore.supplies].sort((a, b) => a.mileage - b.mileage);

  if (isEditing.value) {
    const idx = sorted.findIndex((s) => s.id === supplyId.value);
    const prev = idx > 0 ? sorted[idx - 1] : null;
    const next = idx !== -1 && idx < sorted.length - 1 ? sorted[idx + 1] : null;

    if (prev && form.mileage <= prev.mileage) {
      Notify.create({ type: 'negative', message: 'Quilometragem deve ser maior que o abastecimento anterior' });
      return;
    }
    if (next && form.mileage >= next.mileage) {
      Notify.create({ type: 'negative', message: 'Quilometragem deve ser menor que o próximo abastecimento' });
      return;
    }
  } else if (sorted.length > 0) {
    const lastMileage = sorted[sorted.length - 1]!.mileage;
    if (form.mileage <= lastMileage) {
      Notify.create({ type: 'negative', message: 'Quilometragem deve ser maior que o último abastecimento' });
      return;
    }
  }

  saving.value = true;
  try {
    const supplyData = {
      vehicle_id: vehicleId.value,
      mileage: form.mileage,
      qtd: form.qtd,
      fuel: form.fuel,
      ...(form.total !== undefined && { total: form.total }),
      ...(form.price_per_liter !== undefined && { price_per_liter: form.price_per_liter }),
    };

    if (isEditing.value && supplyId.value) {
      await suppliesStore.updateSupply(supplyId.value, supplyData);
      Notify.create({ type: 'positive', message: 'Abastecimento atualizado com sucesso' });
    } else {
      await suppliesStore.createSupply(supplyData);
      Notify.create({ type: 'positive', message: 'Abastecimento adicionado com sucesso' });
    }
    await router.push(`/vehicle/${vehicleId.value}`);
  } catch (error) {
    console.error('Error saving supply:', error);
    Notify.create({ type: 'negative', message: 'Erro ao salvar abastecimento' });
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <q-page class="glass-page q-pa-md">
    <div class="row items-center q-mb-lg q-pt-sm">
      <glass-button
        variant="ghost"
        round
        icon="arrow_back"
        class="q-mr-sm"
        @click="$router.push(`/vehicle/${vehicleId}`)"
      />
      <div>
        <div class="section-eyebrow">{{ vehicle?.brand }} {{ vehicle?.model }}</div>
        <h1 class="page-title q-ma-none">
          {{ isEditing ? 'Editar Abastecimento' : 'Novo Abastecimento' }}
        </h1>
      </div>
    </div>

    <glass-card>
      <q-card-section class="q-pa-lg">
        <q-form @submit="save" class="q-gutter-md">
          <q-input
            v-model.number="form.mileage"
            label="Quilometragem *"
            type="number"
            required
            outlined
            class="glass-input"
            :rules="[(val) => val > 0 || 'Quilometragem deve ser maior que 0']"
          />
          <q-input
            v-model.number="form.qtd"
            label="Litros Abastecidos *"
            type="number"
            step="0.01"
            required
            outlined
            class="glass-input"
            :rules="[(val) => val > 0 || 'Quantidade deve ser maior que 0']"
          />
          <q-select
            v-model="form.fuel"
            :options="['gasolina', 'etanol', 'diesel']"
            label="Combustível *"
            required
            outlined
            class="glass-input"
          />
          <q-input
            v-model.number="form.total"
            label="Valor Total (R$)"
            type="number"
            step="0.01"
            outlined
            class="glass-input"
            @update:model-value="calculatePricePerLiter"
          />
          <q-input
            v-model.number="form.price_per_liter"
            label="Preço por Litro (R$)"
            type="number"
            step="0.01"
            outlined
            class="glass-input"
            @update:model-value="calculateTotal"
          />

          <div class="row q-gutter-sm q-pt-sm">
            <glass-button variant="ghost" @click="$router.push(`/vehicle/${vehicleId}`)">
              Cancelar
            </glass-button>
            <glass-button class="col" type="submit" variant="primary" :loading="saving">
              Salvar
            </glass-button>
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
