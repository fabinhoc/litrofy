import { defineStore } from 'pinia';
import { supabase } from 'src/boot/supabase';

export interface FuelSupply {
  id?: number;
  vehicle_id: number;
  mileage: number;
  qtd: number;
  total?: number;
  price_per_liter?: number;
  fuel: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupplyWithConsumption extends FuelSupply {
  consumption: number | undefined;
}

export const useSuppliesStore = defineStore('supplies', {
  state: () => ({
    supplies: [] as SupplyWithConsumption[],
    loading: false,
  }),

  actions: {
    async fetchSupplies(vehicleId: number) {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('fuel_supplies')
          .select('*')
          .eq('vehicle_id', vehicleId)
          .order('mileage', { ascending: true });

        if (error) throw error;
        this.supplies = this.calculateConsumptions(data || []);
      } catch (error) {
        console.error('Error fetching supplies:', error);
      } finally {
        this.loading = false;
      }
    },

    calculateConsumptions(supplies: FuelSupply[]): SupplyWithConsumption[] {
      const sorted = [...supplies].sort((a, b) => a.mileage - b.mileage);
      return sorted.map((supply, index) => {
        if (index === 0) {
          return { ...supply, consumption: undefined };
        }
        const prev = sorted[index - 1]!;
        const kmDiff = supply.mileage - prev.mileage;
        if (kmDiff <= 0 || supply.qtd <= 0) {
          return { ...supply, consumption: undefined };
        }
        const consumption = kmDiff / supply.qtd;
        return { ...supply, consumption };
      });
    },

    async createSupply(supply: Omit<FuelSupply, 'id' | 'created_at' | 'updated_at'>) {
      try {
        const { data, error } = await supabase
          .from('fuel_supplies')
          .insert(supply)
          .select()
          .single();

        if (error) throw error;

        // Update vehicle mileage
        await supabase
          .from('vehicles')
          .update({ mileage: supply.mileage })
          .eq('id', supply.vehicle_id);

        // Recalculate consumptions
        this.supplies.push(data);
        this.supplies = this.calculateConsumptions(this.supplies);

        return data;
      } catch (error) {
        console.error('Error creating supply:', error);
        throw error;
      }
    },

    async updateSupply(id: number, updates: Partial<FuelSupply>) {
      try {
        const { data, error } = await supabase
          .from('fuel_supplies')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        // Update vehicle mileage if mileage changed
        if (updates.mileage) {
          await supabase
            .from('vehicles')
            .update({ mileage: updates.mileage })
            .eq('id', data.vehicle_id);
        }

        // Recalculate consumptions
        const index = this.supplies.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.supplies[index] = data;
          this.supplies = this.calculateConsumptions(this.supplies);
        }

        return data;
      } catch (error) {
        console.error('Error updating supply:', error);
        throw error;
      }
    },

    async deleteSupply(id: number) {
      try {
        const supply = this.supplies.find((s) => s.id === id);
        const { error } = await supabase.from('fuel_supplies').delete().eq('id', id);

        if (error) throw error;

        // Update vehicle mileage to previous supply or 0
        if (supply) {
          const remaining = this.supplies.filter((s) => s.id !== id);
          const lastSupply = remaining[remaining.length - 1];
          await supabase
            .from('vehicles')
            .update({ mileage: lastSupply?.mileage || 0 })
            .eq('id', supply.vehicle_id);
        }

        this.supplies = this.supplies.filter((s) => s.id !== id);
        this.supplies = this.calculateConsumptions(this.supplies);
      } catch (error) {
        console.error('Error deleting supply:', error);
        throw error;
      }
    },

    getAverageConsumption(): number | undefined {
      const consumptions = this.supplies.map((s) => s.consumption).filter((c) => c !== undefined);

      if (consumptions.length === 0) return undefined;
      return consumptions.reduce((sum, c) => sum + c, 0) / consumptions.length;
    },

    getTotalConsumption(): number | undefined {
      const supplies = this.supplies;
      if (supplies.length < 2) return undefined;

      const first = supplies[0]!;
      const last = supplies[supplies.length - 1]!;
      const totalKm = last.mileage - first.mileage;
      const totalLiters = supplies.reduce((sum, s) => sum + s.qtd, 0);

      if (totalLiters === 0) return undefined;
      return totalKm / totalLiters;
    },
  },
});
