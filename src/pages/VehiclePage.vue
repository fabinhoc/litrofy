<template>
  <q-page class="glass-page q-pa-md">
    <!-- Back + Vehicle hero -->
    <div class="q-mb-lg">
      <glass-button
        variant="ghost"
        round
        icon="arrow_back"
        class="q-mb-md"
        @click="$router.push('/')"
      />

      <glass-card variant="purple" class="vehicle-hero">
        <div class="vehicle-hero-inner q-pa-lg">
          <div class="row items-start justify-between no-wrap">
            <div>
              <div class="hero-eyebrow">Veículo</div>
              <div class="hero-name q-mt-xs">
                {{ vehicle?.brand }}
                <span class="hero-model"> {{ vehicle?.model }}</span>
              </div>
              <div class="hero-stats row items-center q-gutter-x-sm q-mt-sm">
                <q-icon name="speed" size="13px" style="opacity: 0.6" />
                <span>{{ vehicle?.mileage?.toLocaleString('pt-BR') }} km</span>
                <span v-if="vehicle?.year_model" class="hero-year">· {{ vehicle.year_model }}</span>
              </div>
            </div>
            <q-icon name="directions_car" size="52px" class="hero-bg-icon" />
          </div>
        </div>
        <div class="card-shine" aria-hidden="true"></div>
      </glass-card>
    </div>

    <!-- Consumption metrics -->
    <div v-if="suppliesStore.supplies.length > 1" class="q-mb-lg">
      <div class="section-label q-mb-sm">Consumo</div>
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <metric-card
            label="Média"
            :value="suppliesStore.getAverageConsumption()?.toFixed(1) ?? 'N/A'"
            unit="km/L"
            sublabel="por abastecimento"
            icon="local_gas_station"
            :progress="
              suppliesStore.getAverageConsumption()
                ? Math.min(suppliesStore.getAverageConsumption()! * 10, 100)
                : 0
            "
          />
        </div>
        <div class="col-6">
          <metric-card
            label="Total"
            :value="suppliesStore.getTotalConsumption()?.toFixed(1) ?? 'N/A'"
            unit="km/L"
            sublabel="desde o início"
            icon="analytics"
            :progress="
              suppliesStore.getTotalConsumption()
                ? Math.min(suppliesStore.getTotalConsumption()! * 10, 100)
                : 0
            "
          />
        </div>
      </div>
    </div>

    <!-- Supply list -->
    <div class="section-label q-mb-sm">Abastecimentos</div>

    <div class="column q-gutter-sm">
      <glass-card
        v-for="supply in suppliesStore.supplies.filter((s) => s.id)"
        :key="supply.id!"
        class="supply-card"
      >
        <div class="supply-inner q-pa-md">
          <div class="row items-center no-wrap">
            <!-- Fuel icon -->
            <div class="supply-icon-wrap q-mr-md" :class="`supply-icon--${supply.fuel}`">
              <q-icon name="local_gas_station" size="18px" color="white" />
            </div>

            <!-- Info -->
            <div class="col">
              <div class="row items-center justify-between q-mb-xs">
                <div class="supply-main">
                  {{ supply.mileage.toLocaleString('pt-BR') }} km
                  <span class="supply-sep">·</span>
                  {{ supply.qtd }} L
                  <span class="supply-sep">·</span>
                  <span class="supply-fuel">{{ supply.fuel }}</span>
                </div>
                <q-btn flat round dense icon="more_vert" size="xs" color="white" style="opacity: 0.55" @click.stop>
                  <q-menu class="glass-menu">
                    <q-list class="glass-list">
                      <q-item clickable @click.stop="$router.push(`/vehicle/${vehicleId}/supply/${supply.id}/edit`)" class="glass-menu-item">
                        <q-item-section avatar><q-icon name="edit" color="white" /></q-item-section>
                        <q-item-section><q-item-label>Editar</q-item-label></q-item-section>
                      </q-item>
                      <q-item clickable @click.stop="deleteSupply(supply)" class="glass-menu-item">
                        <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
                        <q-item-section><q-item-label>Excluir</q-item-label></q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>

              <div class="row items-center justify-between">
                <div class="supply-consumption" :class="{ 'supply-consumption--first': !supply.consumption }">
                  <q-icon
                    v-if="supply.consumption"
                    name="trending_up"
                    size="12px"
                    class="q-mr-xs"
                  />
                  {{ supply.consumption ? `${supply.consumption.toFixed(1)} km/L` : 'Primeiro abastecimento' }}
                </div>
                <div class="supply-meta">
                  <span v-if="supply.total">R$ {{ supply.total }}</span>
                  <span class="supply-sep" v-if="supply.total">·</span>
                  {{ new Date(supply.created_at!).toLocaleDateString('pt-BR') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </glass-card>

      <!-- Empty state -->
      <div
        v-if="suppliesStore.supplies.filter((s) => s.id).length === 0"
        class="empty-state column items-center q-py-xl"
      >
        <q-icon name="local_gas_station" size="48px" class="empty-icon q-mb-md" />
        <div class="empty-title q-mb-xs">Nenhum abastecimento</div>
        <div class="empty-sub">Toque + para registrar o primeiro</div>
      </div>
    </div>

    <q-inner-loading :showing="suppliesStore.loading" />

    <!-- FAB -->
    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <glass-button
        round
        variant="primary"
        icon="add"
        pill
        size="lg"
        @click="$router.push(`/vehicle/${vehicleId}/supply/new`)"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useVehiclesStore, type Vehicle } from 'stores/vehicles';
import { useSuppliesStore, type FuelSupply } from 'stores/supplies';
import { Notify } from 'quasar';
import GlassCard from 'components/GlassCard.vue';
import GlassButton from 'components/GlassButton.vue';
import MetricCard from 'components/MetricCard.vue';

const route = useRoute();
const vehiclesStore = useVehiclesStore();
const suppliesStore = useSuppliesStore();

const vehicleId = computed(() => parseInt(route.params['id'] as string));
const vehicle = ref<Vehicle | null>(null);

onMounted(async () => {
  if (vehicleId.value) {
    vehicle.value = vehiclesStore.vehicles.find((v) => v.id === vehicleId.value) ?? null;
    await suppliesStore.fetchSupplies(vehicleId.value);
  }
});

const deleteSupply = async (supply: FuelSupply) => {
  if (!supply.id) return;

  const confirmed = await new Promise<boolean>((resolve) => {
    Notify.create({
      type: 'negative',
      message: 'Tem certeza que deseja excluir este abastecimento?',
      actions: [
        { label: 'Cancelar', color: 'white', handler: () => resolve(false) },
        { label: 'Excluir', color: 'negative', handler: () => resolve(true) },
      ],
    });
  });

  if (confirmed) {
    try {
      await suppliesStore.deleteSupply(supply.id);
      Notify.create({ type: 'positive', message: 'Abastecimento excluído com sucesso' });
    } catch (error) {
      console.error('Error deleting supply:', error);
      Notify.create({ type: 'negative', message: 'Erro ao excluir abastecimento' });
    }
  }
};
</script>

<style scoped>
.section-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--glass-text-muted);
}

/* Vehicle hero card */
.vehicle-hero {
  position: relative;
  overflow: hidden;
}

.vehicle-hero-inner {
  position: relative;
  z-index: 1;
}

.hero-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

.hero-name {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.15;
}

.hero-model {
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
}

.hero-stats {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
}

.hero-year {
  color: rgba(255, 255, 255, 0.4);
}

.hero-bg-icon {
  color: rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
  margin-top: -4px;
}

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

/* Supply cards */
.supply-card {
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.supply-card:hover {
  transform: translateY(-2px);
}

.supply-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.supply-icon--gasolina {
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.5), rgba(234, 88, 12, 0.35));
  border: 1px solid rgba(217, 119, 6, 0.3);
}

.supply-icon--etanol {
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.5), rgba(14, 165, 233, 0.35));
  border: 1px solid rgba(13, 148, 136, 0.3);
}

.supply-icon--diesel {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.5), rgba(59, 130, 246, 0.35));
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.supply-main {
  font-size: 13px;
  font-weight: 600;
  color: var(--glass-text-primary);
}

.supply-fuel {
  text-transform: capitalize;
}

.supply-sep {
  color: var(--glass-text-muted);
  margin: 0 2px;
}

.supply-consumption {
  font-size: 12px;
  font-weight: 500;
  color: var(--glass-text-secondary);
  display: flex;
  align-items: center;
}

.supply-consumption--first {
  font-style: italic;
  color: var(--glass-text-muted);
}

.supply-meta {
  font-size: 11px;
  color: var(--glass-text-muted);
}

/* Empty state */
.empty-icon {
  color: rgba(255, 255, 255, 0.15);
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
</style>
