<script setup lang="ts">
import { onMounted } from 'vue';
import { useVehiclesStore, type Vehicle } from 'stores/vehicles';
import { useSuppliesStore } from 'stores/supplies';
import { Notify } from 'quasar';
import GlassCard from 'components/GlassCard.vue';
import GlassButton from 'components/GlassButton.vue';

const vehiclesStore = useVehiclesStore();
const suppliesStore = useSuppliesStore();

const cardVariants = ['purple', 'teal', 'pink'] as const;

onMounted(async () => {
  await vehiclesStore.fetchVehicles();
  const ids = vehiclesStore.vehicles.map((v) => v.id).filter((id): id is number => id !== undefined);
  await suppliesStore.fetchLastConsumptions(ids);
});

const deleteVehicle = async (vehicle: Vehicle) => {
  if (!vehicle.id) return;

  const confirmed = await new Promise<boolean>((resolve) => {
    Notify.create({
      type: 'negative',
      message: 'Tem certeza que deseja excluir este veículo?',
      actions: [
        { label: 'Cancelar', color: 'white', handler: () => resolve(false) },
        { label: 'Excluir', color: 'negative', handler: () => resolve(true) },
      ],
    });
  });

  if (confirmed) {
    try {
      await vehiclesStore.deleteVehicle(vehicle.id);
      Notify.create({ type: 'positive', message: 'Veículo excluído com sucesso' });
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      Notify.create({ type: 'negative', message: 'Erro ao excluir veículo' });
    }
  }
};
</script>

<template>
  <q-page class="glass-page q-pa-md">
    <!-- Page header -->
    <div class="page-header q-mb-lg q-pt-sm">
      <div class="section-eyebrow">Seus veículos</div>
      <h1 class="page-title q-ma-none">Garagem</h1>
    </div>

    <!-- Loading skeletons -->
    <div v-if="vehiclesStore.loading" class="column q-gutter-md">
      <q-skeleton
        v-for="i in 2"
        :key="i"
        type="rect"
        height="140px"
        class="vehicle-card-skeleton"
      />
    </div>

    <!-- Vehicle list -->
    <div v-else class="column q-gutter-md">
      <glass-card
        v-for="(vehicle, idx) in vehiclesStore.vehicles.filter((v) => v.id)"
        :key="vehicle.id!"
        :variant="cardVariants[idx % 3] ?? 'purple'"
        class="vehicle-card cursor-pointer"
        @click="$router.push(`/vehicle/${vehicle.id!}`)"
      >
        <div class="vehicle-card-inner q-pa-lg">
          <!-- Top row -->
          <div class="row items-center justify-between q-mb-lg">
            <div class="vehicle-chip row items-center q-gutter-x-xs">
              <q-icon name="directions_car" size="13px" />
              <span>{{ vehicle.year_model ?? '—' }}</span>
            </div>
            <q-btn
              flat
              round
              dense
              icon="more_vert"
              size="sm"
              color="white"
              style="opacity: 0.7"
              @click.stop
            >
              <q-menu class="glass-menu">
                <q-list class="glass-list">
                  <q-item
                    clickable
                    @click.stop="$router.push(`/vehicle/${vehicle.id}/edit`)"
                    class="glass-menu-item"
                  >
                    <q-item-section avatar>
                      <q-icon name="edit" color="white" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Editar</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click.stop="deleteVehicle(vehicle)" class="glass-menu-item">
                    <q-item-section avatar>
                      <q-icon name="delete" color="negative" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Excluir</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>

          <!-- Vehicle name -->
          <div class="vehicle-name q-mb-md">
            {{ vehicle.brand }}
            <span class="vehicle-model"> {{ vehicle.model }}</span>
          </div>

          <!-- Bottom row -->
          <div class="row items-center justify-between">
            <div class="vehicle-stat row items-center q-gutter-x-xs">
              <q-icon name="speed" size="14px" style="opacity: 0.65" />
              <span>{{ vehicle.mileage.toLocaleString('pt-BR') }} km</span>
              <template v-if="suppliesStore.vehicleLastConsumptions[vehicle.id!] !== undefined">
                <span style="opacity: 0.4">·</span>
                <q-icon name="local_gas_station" size="13px" style="opacity: 0.65" />
                <span>{{ suppliesStore.vehicleLastConsumptions[vehicle.id!]!.toFixed(1) }} km/L</span>
              </template>
            </div>
            <q-icon name="arrow_forward" size="16px" style="opacity: 0.4" />
          </div>
        </div>

        <!-- Shine overlay -->
        <div class="card-shine" aria-hidden="true"></div>
      </glass-card>

      <!-- Empty state -->
      <div
        v-if="vehiclesStore.vehicles.filter((v) => v.id).length === 0"
        class="empty-state column items-center q-py-xl"
      >
        <q-icon name="directions_car" size="52px" class="empty-icon q-mb-md" />
        <div class="empty-title q-mb-xs">Nenhum veículo</div>
        <div class="empty-sub">Adicione seu primeiro veículo abaixo</div>
      </div>

      <!-- Add vehicle button -->
      <glass-button
        class="add-btn"
        icon="add"
        variant="secondary"
        @click="$router.push('/vehicle/new')"
      >
        Adicionar Veículo
      </glass-button>
    </div>
  </q-page>
</template>

<style scoped>
.page-header {
  position: relative;
  z-index: 1;
}

.section-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--glass-text-muted);
  margin-bottom: 6px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--glass-text-primary);
}

/* Vehicle card */
.vehicle-card {
  position: relative;
  overflow: hidden;
}

.vehicle-card-inner {
  position: relative;
  z-index: 1;
}

.vehicle-chip {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 10px 4px 8px;
  border-radius: 999px;
  letter-spacing: 0.01em;
}

.vehicle-name {
  font-size: 22px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.vehicle-model {
  font-weight: 400;
  color: rgba(255, 255, 255, 0.72);
}

.vehicle-stat {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
}

/* Subtle card shine — top-left to center diagonal */
.card-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.03) 40%,
    transparent 70%
  );
  border-radius: inherit;
  pointer-events: none;
  z-index: 0;
}

/* Empty state */
.empty-icon {
  color: rgba(255, 255, 255, 0.18);
}

.empty-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--glass-text-secondary);
}

.empty-sub {
  font-size: 12px;
  color: var(--glass-text-muted);
}

/* Add button */
.add-btn {
  height: 52px;
  border: 1px dashed rgba(255, 255, 255, 0.18) !important;
}
</style>
